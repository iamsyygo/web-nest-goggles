import { Controller, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('系统用户相关接口 v2')
@Controller('/v2/user')
export class UserController {
  @Inject()
  private jwtService: JwtService;
}
