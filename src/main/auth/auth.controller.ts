import { Body, Controller, Get, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '@/guard/local-auth.guard';
import { Request as Req } from 'express';
import { SignupDto } from './dto/create-auth.dto';

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

  // @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return 'This action returns a auth';
  }

  @ApiOperation({ description: '', summary: '登录用户' })
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @HttpCode(200)
  async signin(@Request() req: Req) {
    return this.authService.signin(req.user);
  }

  @ApiOperation({ description: '', summary: '注册用户' })
  @Post('signup')
  @HttpCode(201)
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }
}
