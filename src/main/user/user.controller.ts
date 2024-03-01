import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  HttpCode,
  HttpException,
  Query,
  Inject,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserPasswordDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { SkipJwtPassport } from '../../decorator/skip-jwt-passport.decorator';
import { PageQueryUserDto } from './dto/query-user.dto';
import { JwtService } from '@nestjs/jwt';
import { AppJwtRefreshAuthGuard } from '../../guard/jwt.refresh-passport.guard';
import { ConfigService } from '@nestjs/config';

@ApiTags('系统用户相关接口')
@Controller('user')
export class UserController {
  @Inject()
  private jwtService: JwtService;

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}
  @ApiOperation({ description: '', summary: '创建用户' })
  @SkipJwtPassport()
  @Post('/sign-up')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.userService.signUp(createUserDto);
  }

  @ApiOperation({ description: '', summary: '登录用户' })
  @SkipJwtPassport()
  @Post('/sign-in')
  @HttpCode(200)
  signIn(@Body() loginUserDto: CreateUserDto, @Request() req) {
    return this.userService.signIn(loginUserDto, req);
  }

  @ApiOperation({ description: '', summary: '获取所有的用户' })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ description: '', summary: '用户列表查询' })
  @SkipJwtPassport()
  @Get('/list')
  findList(@Query() pageQueryDto: PageQueryUserDto) {
    return this.userService.findList(pageQueryDto);
  }

  @ApiOperation({ description: '', summary: '根据 id 查询' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @ApiOperation({ description: '', summary: '更新用户' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @ApiOperation({ description: '', summary: '更新用户密码' })
  @Patch('updated-key/:id')
  updatePassword(@Param('id') id: string, @Body() updateUserPasswordDto: UpdateUserPasswordDto) {
    return this.userService.updatePassword(+id, updateUserPasswordDto);
  }

  @ApiOperation({ description: '', summary: '删除用户' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @ApiOperation({ description: '', summary: '刷新令牌' })
  // @UseGuards(AppJwtRefreshAuthGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refresh_token: {
          type: 'string',
          description: '刷新令牌',
        },
      },
    },
  })
  @Post('refresh-token')
  async refreshToken(@Body('refresh_token') refreshToken: string) {
    let results: { id: any };
    const refreshYamlCfg = this.configService.get('refresh_token') as AppYamlConfig['refresh_token'];
    if (!refreshYamlCfg.secret) {
      throw new HttpException('jwt.secret is required，服务端错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    try {
      results = await this.jwtService.verifyAsync(refreshToken, {
        secret: refreshYamlCfg.secret,
      });
    } catch (error) {
      throw new HttpException('refresh_token 无效，请重新登录' + error, 401);
    }

    const user = await this.userService.findOne(results.id);
    const { access_token, refresh_token } = await this.userService.getAppToken(user);

    return {
      access_token,
      refresh_token,
    };
  }
}
