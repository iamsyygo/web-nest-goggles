import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryMenuTreeDto } from './dto/query-menu.dto';
import { User } from '../user/entities/user.entity';
import { User as useUser } from '@/decorator/user.decorator';

@ApiTags('系统菜单相关接口')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @ApiOperation({ summary: '创建菜单' })
  @Post('create')
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.createMenu(createMenuDto);
  }

  @ApiOperation({ summary: '获取菜单树' })
  @ApiBody({ description: '角色 ids', type: QueryMenuTreeDto })
  @Post('menu-tree')
  findMenuTree(@useUser() user: any) {
    return this.menuService.findMenuByRole(user);
  }

  @ApiOperation({ summary: 'v2 获取菜单树' })
  @Post('find-menu-tree')
  findMenuTreeV2(@useUser() user: any) {
    return this.menuService.findMenuTree(user);
  }

  @ApiOperation({ summary: '根据id获取菜单' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(+id);
  }

  @ApiOperation({ summary: '根据id更新菜单' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(+id, updateMenuDto);
  }

  @ApiOperation({ summary: '根据id删除菜单' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }
}
