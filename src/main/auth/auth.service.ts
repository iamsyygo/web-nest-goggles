import { UserService } from '@/main/user/user.service';
import {
  BadRequestException,
  Inject,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IPayload } from './types/jwt';
import { compare, hashSync } from 'bcryptjs';
import { SigninEmailDto, SigninUserNameDto, SignupDto } from './dto/create-auth.dto';
import { RedisService } from '../redis/redis.service';
import { AppRedisKeyEnum } from '@/types/enum';
import { ICaptcha } from './types/captcha';
import { Request } from 'express';

@Injectable()
export class AuthService {
  @Inject()
  private userService: UserService;

  @Inject()
  private redisService: RedisService;

  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string, body: SigninEmailDto & SigninUserNameDto): Promise<any> {
    const { email, code } = body;
    let user = null;
    if (email) {
      user = await this.userService.findOne({ email });
      if (!user) throw new BadRequestException('用户不存在');
      await this.onverifyCaptcha({ email, code });
    }

    if (username) {
      user = await this.userService.findOne({ username });
      if (!user) throw new BadRequestException('用户不存在');
    }
    const passwordMatch = await compare(pass, user.password);
    if (!passwordMatch) throw new BadRequestException('密码错误');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async signin(user: Request['user']) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: 'Bearer ' + this.getAccessToken(payload),
      refresh_token: 'Bearer ' + this.getRefreshToken(payload),
    };
  }

  async signup(dto: SignupDto) {
    const { email, username, password } = dto;
    const exist = await this.userService.findOne({ email, username });
    if (exist) throw new BadRequestException('用户已存在');
    const salt = this.configService.get('bcrypt.salt', 10);
    const pass = await hashSync(password, salt);
    const user = await this.userService.create({ email, username, password: pass });
    if (!user) throw new BadRequestException('注册失败');
    return true;
  }

  async anewRefresh(refreshToken: string) {
    let results: { id: any };
    const refreshYamlCfg = this.configService.get('refresh_token') as AppYamlConfig['refresh_token'];
    if (!refreshYamlCfg.secret) {
      throw new ServiceUnavailableException('服务配置错误');
    }
    try {
      results = await this.jwtService.verifyAsync(refreshToken, {
        secret: refreshYamlCfg.secret,
      });
    } catch (error) {
      throw new BadRequestException('无效的令牌');
    }

    const user = await this.userService.findOne(results.id);
    const payload: IPayload = { username: user.username, sub: user.id };
    return {
      access_token: 'Bearer ' + this.getAccessToken(payload),
      refresh_token: 'Bearer ' + this.getRefreshToken(payload),
    };
  }

  getAccessToken(payload: IPayload) {
    return this.jwtService.sign(payload);
  }
  getRefreshToken(payload: IPayload) {
    const refreshYamlCfg = this.configService.get('refresh_token') as AppYamlConfig['refresh_token'];
    return this.jwtService.sign(
      { id: payload.sub, email: payload.username },
      { secret: refreshYamlCfg.secret, expiresIn: refreshYamlCfg.signOptions.expiresIn },
    );
  }

  async onverifyCaptcha(value: ICaptcha) {
    const { email, code, prefix = AppRedisKeyEnum.CAPTCHA } = value;
    if (!code) throw new BadRequestException('验证码不能为空');
    const c = await this.redisService.get(prefix + email);
    if (!c) {
      throw new UnauthorizedException('验证码已失效');
    }
    if (code !== c) {
      throw new UnauthorizedException('验证码不正确');
    }
    return true;
  }
}
