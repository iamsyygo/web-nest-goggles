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
import { PLATFORM_ENUM, User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { compare, hashSync } from 'bcryptjs';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PageQueryUserDto } from './dto/query-user.dto';
import { RedisService } from '../redis/redis.service';
import { AppRedisKeyEnum } from '../../types/enum';
import axios from 'axios';
import { transformPageResult } from '@/utils';

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

  async signUp(createUserDto: CreateUserDto) {
    const user = await this.userRepo.findOne({ where: { email: createUserDto.email } });
    if (!!user) throw new BadRequestException('用户名已存在');

    await this.onVerifyCode({
      email: createUserDto.email,
      code: createUserDto.code,
      prefix: AppRedisKeyEnum.CAPTCHA,
    });

    const salt = this.configService.get('bcrypt.salt', 10);
    const password = await hashSync(createUserDto.password, salt);

    const results = await this.userRepo.insert({
      ...createUserDto,
      password,
    });

    if (results.identifiers.length === 0) throw new BadRequestException('创建失败');
    await this.redisService.del(AppRedisKeyEnum.CAPTCHA + createUserDto.email);
    return true;
  }

  async signIn({ email, password, code }: CreateUserDto, req: Request) {
    const user = await this.userRepo.findOne({
      where: { email },
      relations: { roles: { permissions: true } },
    });
    if (!user) throw new BadRequestException('用户不存在');

    await this.onVerifyCode({ email: user.email, code, prefix: AppRedisKeyEnum.CAPTCHA });

    const issuccess = await compare(password, user.password);
    if (!issuccess) throw new BadRequestException('密码错误');

    const { access_token, refresh_token } = await this.getAppToken(user);

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

  async findList({ page = 1, pageSize = 10 }: PageQueryUserDto) {
    const results = await this.userRepo.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      withDeleted: true,
    });
    return transformPageResult({
      results,
      page,
      pageSize,
    });
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

    await this.redisService.del(AppRedisKeyEnum.CAPTCHA + email);
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

  //   const redisCode = await this.redisService.get(AppRedisKeyEnum.CAPTCHA + email);
  //   if (!redisCode) throw new BadRequestException('验证码已失效');
  //   if (redisCode !== code) throw new BadRequestException('验证码不正确');
  //   return true;
  // }
  async onVerifyCode(value: { email: string; code: string; prefix?: string }) {
    const { email, code, prefix = AppRedisKeyEnum.CAPTCHA } = value;
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

    const refresh = await this.jwtService.signAsync(
      { id: user.id, email: user.email },
      { secret: refreshYamlCfg.secret, expiresIn: refreshYamlCfg.signOptions.expiresIn },
    );

    return {
      access_token,
      refresh_token: 'Bearer ' + refresh,
    };
  }

  // github 登录
  async authGithub(code, req: Request) {
    const githubYamlCfg = this.configService.get('github') as AppYamlConfig['github'];
    const { client_id, client_secret } = githubYamlCfg;

    if (!code) {
      throw new BadRequestException('code 必填');
    }
    const query = new URLSearchParams({
      client_id,
      client_secret,
      code,
    }).toString();

    const { data } = await axios.post('https://github.com/login/oauth/access_token?' + query, {
      headers: {
        Accept: 'application/json',
      },
    });

    const access_token = new URLSearchParams(data).get('access_token');
    if (!access_token) throw new BadRequestException('获取 access_token 失败');
    const result = await axios.get('https://api.github.com/user', {
      headers: {
        Accept: 'application/json',
        Authorization: 'token ' + access_token,
      },
    });

    const user = await this.userRepo.findOne({ where: { platformId: result.data.node_id } });
    const lastLoginIp = req.headers.host.split(':')[0];

    if (!user?.platformId) {
      const u = await this.userRepo.save({
        username: result.data.login,
        platform: PLATFORM_ENUM.GITHUB,
        platformId: result.data.node_id,
        lastLoginIp,
      });
      const { access_token: accesstoken, refresh_token } = await this.getAppToken(u);
      delete u.password;
      return { access_token: accesstoken, refresh_token, user: u };
    }

    const u = await this.userRepo.save({ ...user, lastLoginIp });
    const { access_token: accesstoken, refresh_token } = await this.getAppToken(u);
    delete u.password;
    return { access_token: accesstoken, refresh_token, user: u };
  }

  // 前 x 个月的用户注册量,与用户注册量统计
  async registerCount(count = 6) {
    const total = await this.userRepo.count();
    const results = await this.userRepo.query(
      `SELECT COUNT(*) as count, DATE_FORMAT(create_date, '%Y-%m') as date FROM user WHERE create_date >= DATE_SUB(CURDATE(), INTERVAL ? MONTH) GROUP BY DATE_FORMAT(create_date, '%Y-%m') ORDER BY date DESC`,
      [count],
    );
    return {
      total,
      results,
    };
  }
}
