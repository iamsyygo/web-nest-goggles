import { IsJwtPublic } from '@/decorator/is-jwt-public.decorator';
import { LocalAuthGuard } from '@/guard/local-auth.guard';
import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SigninEmailDto, SigninUserNameDto, SignupDto } from './dto/create-auth.dto';

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
  // @UseGuards(LocalAuthGuard)
  @Post('signin')
  @IsJwtPublic()
  @HttpCode(200)
  async signin(@Body() dto: SigninUserNameDto & SigninEmailDto) {
    return this.authService.signin(dto);
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
