import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { SigninEmailDto, SigninUserNameDto } from './dto/create-auth.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }
  async validate(request: Request, username: string, password: string): Promise<any> {
    const body = request.body as SigninEmailDto & SigninUserNameDto;
    const user = await this.authService.validateUser(username, password, body);
    if (!user) {
      throw new UnauthorizedException('身份验证失败');
    }
    return user;
  }
}
