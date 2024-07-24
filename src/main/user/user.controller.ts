import { Controller, Inject, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';

@ApiTags('系统用户相关接口 v2')
@Controller('/v2/user')
export class UserController {
  @Inject()
  private jwtService: JwtService;

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ description: '', summary: '获取前 x 个月的用户注册量' })
  @Post('/register-count')
  registerCount() {
    return this.userService.registerCount();
  }
}
