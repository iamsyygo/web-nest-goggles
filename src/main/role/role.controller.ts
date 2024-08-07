import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageQueryRoleDto } from './dto/query-role.dto';
import { UpdateRole2MenuDto } from './dto/update-role2menu.dto';

@ApiTags('系统角色相关接口')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({ summary: '创建角色' })
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @ApiOperation({ summary: '分页获取角色' })
  @Get('/list')
  findList(@Query() pageQueryDto: PageQueryRoleDto) {
    return this.roleService.findList(pageQueryDto);
  }

  @ApiOperation({ summary: '根据 ids 查询多个' })
  @Get('/query-by-ids')
  findByIds(@Query() ids: string) {
    const dto = ids.split(',').map((id) => +id);
    return this.roleService.findByIds(dto);
  }

  @ApiOperation({ summary: '获取所有角色' })
  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @ApiOperation({ summary: '获取单个角色' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @ApiOperation({ summary: '更新角色' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @ApiOperation({ summary: '更新角色菜单' })
  @Post('role2menu')
  bindRoleMenu(@Body() updateRole2MenuDto: UpdateRole2MenuDto) {
    return this.roleService.bindRoleMenu(updateRole2MenuDto.role, updateRole2MenuDto.menuIds);
  }

  @ApiOperation({ summary: '删除角色' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }

  @ApiOperation({ summary: '根据实体保存' })
  @Post('save')
  save(@Body() entity: UpdateRoleDto & CreateRoleDto) {
    return this.roleService.save(entity);
  }
}
