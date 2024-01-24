import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { compare, hashSync } from 'bcryptjs';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import dayjs from 'dayjs';
import { PageQueryDto } from './dto/query-user.dto';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly userRepo: Repository<User>;

  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const notEmpty = await this.userRepo.findOne({
      where: {
        username: createUserDto.username,
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
    return true;
  }

  async login(loginUserDto: CreateUserDto, req: Request) {
    const user = await this.userRepo.findOne({
      where: {
        username: loginUserDto.username,
      },
    });
    if (!user) throw new BadRequestException('用户名不存在');
    const pair = await compare(loginUserDto.password, user.password);
    if (!pair) throw new BadRequestException('密码错误');

    const token = await this.jwtService.signAsync({ id: user.id, username: user.username });
    const authorization = 'Bearer ' + token;

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
      skip: page * pageSize,
      take: pageSize,
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
    return `This action returns a #${id} user`;
  }
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
