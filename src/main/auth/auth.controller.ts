import { IsJwtPublic } from '@/decorator/is-jwt-public.decorator';
import { Body, Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request as Req } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/create-auth.dto';
import { LocalAuthGuard } from '@/guard/local-auth.guard';

declare module 'express' {
  interface Request {
    user: {
      username: string;
      password: string;
      id: number;
    };
  }
}

@ApiTags('系统认证中心')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ description: '', summary: '登录用户' })
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @IsJwtPublic()
  @HttpCode(200)
  async signin(@Request() request: Req) {
    return this.authService.signin(request.user);
  }

  @ApiOperation({ description: '', summary: '注册用户' })
  @Post('signup')
  @HttpCode(201)
  @IsJwtPublic()
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @ApiOperation({ description: '', summary: '刷新令牌' })
  @Post('refresh')
  @IsJwtPublic()
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.anewRefresh(refreshToken);
  }
}
