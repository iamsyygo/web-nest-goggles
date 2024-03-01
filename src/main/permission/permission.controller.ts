import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageQueryPermissionDto } from './dto/query-permission.dto';

@ApiTags('系统权限相关接口')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @ApiOperation({ summary: '创建权限' })
  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @ApiOperation({ summary: '分页获取权限' })
  @Get('/list')
  findList(@Query() pageQueryDto: PageQueryPermissionDto) {
    return this.permissionService.findList(pageQueryDto);
  }

  @ApiOperation({ summary: '根据 ids 查询多个' })
  @Get('/query-by-ids')
  findByIds(@Query() ids: string) {
    const dto = ids.split(',').map((id) => +id);
    return this.permissionService.findByIds(dto);
  }

  @ApiOperation({ summary: '获取所有权限' })
  @Get()
  findAll() {
    return this.permissionService.findAll();
  }

  @ApiOperation({ summary: '获取单个权限' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(+id);
  }

  @ApiOperation({ summary: '更新权限' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionService.update(+id, updatePermissionDto);
  }

  @ApiOperation({ summary: '删除权限' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionService.remove(+id);
  }
}
