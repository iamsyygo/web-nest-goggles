import { IsJwtPublic } from '@/decorator/is-jwt-public.decorator';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Redirect,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request as RequestType, Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto, SigninEmailDto, SigninUserNameDto } from './dto/create-auth.dto';
import { LocalAuthGuard } from '@/guard/local-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { GithubUser } from './types/github';
import { PLATFORM_ENUM } from '../user/entities/user.entity';

declare module 'express' {
  interface Request {
    user: {
      username: string;
      password: string;
      id: number;
      platform: PLATFORM_ENUM;
    };
  }
}

@ApiTags('系统认证中心')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ description: '', summary: '登录用户' })
  @UseGuards(LocalAuthGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', description: '用户名' },
        password: { type: 'string', description: '密码' },
      },
    },
  })
  @Post('signin')
  @IsJwtPublic()
  @HttpCode(200)
  async signin(@Request() request: RequestType) {
    return this.authService.signin(request.user);
  }

  @ApiOperation({ description: '', summary: '登录用户 email' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', description: '邮箱' },
        code: { type: 'string', description: '验证码' },
      },
    },
  })
  @Post('signin/email')
  @IsJwtPublic()
  @HttpCode(200)
  async signinOnEmail(@Body() dto: SigninEmailDto) {
    return this.authService.signinOnEmail(dto);
  }

  @ApiOperation({ description: '', summary: '登录用户 github' })
  @Get('signin/github')
  @UseGuards(AuthGuard('github'))
  @IsJwtPublic()
  @HttpCode(200)
  async signinOnGithub() {}

  @Get('callback')
  @IsJwtPublic()
  @UseGuards(AuthGuard('github'))
  async authCallback(@Req() req, @Res() res: Response) {
    const user = req.user as GithubUser;
    const token = await this.authService.signinOnGithub(user);
    res.redirect(
      `http://192.168.31.100:3000/login?access_token=${token.access_token}&refresh_token=${token.refresh_token}`,
    );
    return true;
  }

  @ApiOperation({ description: '', summary: '注册用户' })
  @Post('signup')
  @HttpCode(201)
  @IsJwtPublic()
  async signup(@Body() dto: SignupDto) {
    console.log(dto);

    return this.authService.signup(dto);
  }

  @ApiOperation({ description: '', summary: '刷新令牌' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: { type: 'string', description: '刷新令牌' },
      },
    },
  })
  @Post('refresh')
  @IsJwtPublic()
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.anewRefresh(refreshToken);
  }
}
