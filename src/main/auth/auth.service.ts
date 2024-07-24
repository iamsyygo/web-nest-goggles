import { UserService } from '@/main/userv2/user.service';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IPayload } from './types/jwt';
import { Request } from 'express';
import { compare, hashSync } from 'bcryptjs';
import { SignupDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  @Inject()
  private userService: UserService;

  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne({ username });
    if (!user) throw new BadRequestException('用户不存在');
    const passwordMatch = await compare(pass, user.password);
    if (!passwordMatch) throw new BadRequestException('密码错误');
    const { password, ...result } = user;
    password;
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
}
