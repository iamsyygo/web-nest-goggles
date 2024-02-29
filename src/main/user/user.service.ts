import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserPasswordDto } from './dto/update-user.dto';
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
    const user = await this.userRepo.findOne({ where: { email: createUserDto.email } });
    if (!!user) throw new BadRequestException('用户名已存在');

    await this.onVerifyCode({ email: createUserDto.email, code: createUserDto.code });

    const salt = this.configService.get('bcrypt.salt', 10);
    const password = await hashSync(createUserDto.password, salt);

    const results = await this.userRepo.insert({
      ...createUserDto,
      password,
    });

    if (results.identifiers.length === 0) throw new BadRequestException('创建失败');
    await this.redisService.del(`app_register_captcha_${createUserDto.email}`);
    return true;
  }

  async login({ username, password, code }: CreateUserDto, req: Request) {
    const user = await this.userRepo.findOne({
      where: { username },
      relations: { roles: { permissions: true } },
    });
    if (!user) throw new BadRequestException('用户名不存在');

    await this.onVerifyCode({ email: user.email, code });

    const issuccess = await compare(password, user.password);
    if (!issuccess) throw new BadRequestException('密码错误');

    const { access_token, refresh_token } = await this.getAppToken(user);

    // @ts-ignore
    user.lastLoginIp = req.headers.host.split(':')[0];
    const u = await this.userRepo.save(user);

    delete u.password;
    return {
      // authorization,
      access_token,
      refresh_token,
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
    return this.userRepo.find();
  }
  findOne(id: number) {
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
      relations: {
        roles: {
          permissions: true,
        },
      },
    });
  }
  async update(id: number, updateUserDto: UpdateUserDto) {
    const { email, code } = updateUserDto;
    // if (updateUserDto.password) {
    //   delete updateUserDto.password;
    // }
    // fix roles not update link:https://github.com/typeorm/typeorm/issues/8245
    // const result = await this.userRepo.update(id, updateUserDto);

    const user = await this.userRepo.findOne({ where: { email } });
    if (user.id !== id) throw new BadRequestException('邮箱已存在');

    await this.onVerifyCode({ email: email, code: code });

    const result = await this.userRepo.save(updateUserDto);
    if (!result) throw new BadRequestException('更新失败');

    await this.redisService.del(`app_register_captcha_${email}`);
    return true;
  }

  async updatePassword(id: number, updateUserPasswordDto: UpdateUserPasswordDto) {
    const { confirmPassword, newPassword, oldPassword } = updateUserPasswordDto;
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new BadRequestException('用户不存在');

    const issuccess = await compare(oldPassword, user.password);
    if (!issuccess) throw new BadRequestException('原密码错误');
    if (newPassword !== confirmPassword) throw new BadRequestException('两次密码不一致');

    await this.onVerifyCode({ email: user.email, code: updateUserPasswordDto.code });

    const salt = this.configService.get('bcrypt.salt', 10);
    const password = await hashSync(newPassword, salt);
    const result = await this.userRepo.update(id, { password });
    if (result.affected === 0) throw new BadRequestException('更新失败');
    return true;
  }

  async remove(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new BadRequestException('用户不存在');
    const result = await this.userRepo.softRemove({ ...user });
    return !!result;
  }

  // 找回密码
  // async findPassword(email: string, code: string) {
  //   const user = await this.userRepo.findOne({ where: { email } });
  //   if (!user) throw new BadRequestException('用户不存在');

  //   const redisCode = await this.redisService.get(`app_register_captcha_${user.email}`);
  //   if (!redisCode) throw new BadRequestException('验证码已失效');
  //   if (redisCode !== code) throw new BadRequestException('验证码不正确');
  //   return true;
  // }
  async onVerifyCode(value: { email: string; code: string; prefix?: string }) {
    const { email, code, prefix = 'app_register_captcha_' } = value;
    const c = await this.redisService.get(prefix + email);
    if (!c) {
      throw new UnauthorizedException('验证码已失效');
    }
    if (c !== code) {
      throw new UnauthorizedException('验证码不正确');
    }
    return true;
  }

  async getAppToken(user: User) {
    const jwtYamlCfg = this.configService.get('jwt') as AppYamlConfig['jwt'];
    const refreshYamlCfg = this.configService.get('refresh_token') as AppYamlConfig['refresh_token'];

    if (!jwtYamlCfg.secret || !refreshYamlCfg.secret) {
      throw new HttpException('jwt.secret is required，服务端错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const sign = await this.jwtService.signAsync(
      { id: user.id, username: user.username, email: user.email },
      { secret: jwtYamlCfg.secret, expiresIn: jwtYamlCfg.signOptions.expiresIn },
    );
    const access_token = 'Bearer ' + sign;

    const refresh_token = await this.jwtService.signAsync(
      { id: user.id, email: user.email },
      { secret: refreshYamlCfg.secret, expiresIn: refreshYamlCfg.signOptions.expiresIn },
    );

    return {
      access_token,
      refresh_token,
    };
  }
}
