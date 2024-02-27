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
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { SkipJwtPassport } from '../../decorator/skip-jwt-passport.decorator';
import { PageQueryDto } from './dto/query-user.dto';

@ApiTags('系统用户')
@Controller('user')
export class UserController {
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

  @ApiOperation({ description: '', summary: '删除用户' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
