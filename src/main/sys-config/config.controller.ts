import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ConfigService } from './config.service';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageQueryConfigDto } from './dto/query-config.dto';

@ApiTags('系统配置相关接口')
@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @ApiOperation({ summary: '创建配置' })
  @Post()
  create(@Body() createConfigDto: CreateConfigDto) {
    return this.configService.create(createConfigDto);
  }

  @ApiOperation({ summary: '分页获取配置' })
  @Get('/list')
  findList(@Query() pageQueryDto: PageQueryConfigDto) {
    return this.configService.findList(pageQueryDto);
  }

  @ApiOperation({ summary: '根据 ids 查询多个' })
  @Get('/query-by-ids')
  findByIds(@Query() ids: string) {
    const dto = ids.split(',').map((id) => +id);
    return this.configService.findByIds(dto);
  }

  @ApiOperation({ summary: '获取所有配置' })
  @Get()
  findAll() {
    return this.configService.findAll();
  }

  @ApiOperation({ summary: '获取单个配置' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.configService.findOne(+id);
  }

  @ApiOperation({ summary: '更新配置' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConfigDto: UpdateConfigDto) {
    return this.configService.update(+id, updateConfigDto);
  }

  @ApiOperation({ summary: '删除配置' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.configService.remove(+id);
  }

  @ApiOperation({ summary: '根据实体保存' })
  @Post('save')
  save(@Body() entity: UpdateConfigDto & CreateConfigDto) {
    return this.configService.save(entity);
  }
}
