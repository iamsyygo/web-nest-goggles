import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { compare, hashSync } from 'bcryptjs';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PageQueryDto } from './dto/query-user.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly userRepo: Repository<User>;

  @Inject()
  private redisService: RedisService;

  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const codeInRedis = await this.redisService.get(`app_register_${createUserDto.email}`);
    if (!codeInRedis) {
      throw new UnauthorizedException('验证码已失效');
    }
    if (createUserDto.code !== codeInRedis) {
      throw new UnauthorizedException('验证码不正确');
    }

    const notEmpty = await this.userRepo.findOne({
      where: {
        username: createUserDto.email,
      },
    });
    if (!!notEmpty) throw new BadRequestException('用户名已存在');

    const salt = this.configService.get('bcrypt.salt', 10);
    const password = await hashSync(createUserDto.password, salt);
    const user = await this.userRepo.insert({
      ...createUserDto,
      password,
    });

    if (user.identifiers.length === 0) throw new BadRequestException('创建失败');
    await this.redisService.del(`app_register_${createUserDto.email}`);
    return true;
  }

  async login(loginUserDto: CreateUserDto, req: Request) {
    const codeInRedis = await this.redisService.get(`app_register_${loginUserDto.email}`);
    if (!codeInRedis) {
      throw new UnauthorizedException('验证码已失效');
    }
    if (loginUserDto.code !== codeInRedis) {
      throw new UnauthorizedException('验证码不正确');
    }

    const user = await this.userRepo.findOne({
      where: {
        username: loginUserDto.username,
      },
      relations: {
        roles: true,
      },
    });
    if (!user) throw new BadRequestException('用户名不存在');
    const pair = await compare(loginUserDto.password, user.password);
    if (!pair) throw new BadRequestException('密码错误');

    const token = await this.jwtService.signAsync({
      id: user.id,
      username: user.username,
      email: user.email,
    });
    const authorization = 'Bearer ' + token;

    // @ts-ignore
    user.lastLoginIp = req.headers.host.split(':')[0];
    const u = await this.userRepo.save(user);

    delete u.password;
    return {
      authorization,
      user: u,
    };
  }

  async findList({ page = 1, pageSize = 10 }: PageQueryDto) {
    const [list, total] = await this.userRepo.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      // withDeleted: true,
    });
    return {
      list,
      total,
      meta: {
        page: +page,
        pageSize: +pageSize,
        totalSize: Math.ceil(total / pageSize),
      },
    };
  }
  findAll() {
    return `This action returns all user`;
  }
  findOne(id: number) {
    // console.log(`this.userRepo`, this.userRepo.metadata.ownColumns);

    return this.userRepo.findOne({
      where: { id },
      // select: getSelect(User, ['!prototype']),
      select: {
        password: false,
        ...this.userRepo.metadata.ownColumns.reduce((prev, cur) => {
          prev[cur.propertyName] = true;
          return prev;
        }, {}),
      },
    });
  }
  async update(id: number, updateUserDto: UpdateUserDto) {
    const result = await this.userRepo.update(id, updateUserDto);
    if (result.affected === 0) throw new BadRequestException('更新失败');
    return true;
  }

  async remove(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new BadRequestException('用户不存在');
    const result = await this.userRepo.softRemove({ ...user });
    return !!result;
  }
}
