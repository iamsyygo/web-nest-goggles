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
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserPasswordDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { SkipJwtPassport } from '../../decorator/skip-jwt-passport.decorator';
import { PageQueryDto } from './dto/query-user.dto';
import { JwtService } from '@nestjs/jwt';

@ApiTags('系统用户')
@Controller('user')
export class UserController {
  @Inject()
  private jwtService: JwtService;

  constructor(private readonly userService: UserService) {}
  @ApiOperation({ description: '', summary: '创建用户' })
  @SkipJwtPassport()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ description: '', summary: '登录用户' })
  @SkipJwtPassport()
  @Post('/login')
  @HttpCode(200)
  login(@Body() loginUserDto: CreateUserDto, @Request() req) {
    return this.userService.login(loginUserDto, req);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ description: '', summary: '用户列表查询' })
  @SkipJwtPassport()
  @Get('/list')
  findList(@Query() pageQueryDto: PageQueryDto) {
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

  @Get('refresh-token')
  async refresh(@Query('refresh_token') refreshToken: string) {
    const data = this.jwtService.verify(refreshToken);

    if (!data) throw new HttpException('refresh_token 无效，请重新登录', 401);

    const user = await this.userService.findOne(data.userId);

    const access_token = this.jwtService.sign(
      {
        userId: user.id,
        username: user.username,
      },
      {
        expiresIn: '30m',
      },
    );

    const refresh_token = this.jwtService.sign(
      {
        userId: user.id,
      },
      {
        expiresIn: '7d',
      },
    );

    return {
      access_token,
      refresh_token,
    };
  }
}
