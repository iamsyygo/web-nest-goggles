import { IsJwtPublic } from '@/decorator/is-jwt-public.decorator';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DatabaseService } from './database.service';
import { CreateDatabaseDto } from './dto/create-database.dto';
import { QueryStructureDatabaseDto } from './dto/query-database.dto';
import { UpdateDatabaseDto } from './dto/update-database.dto';

@ApiTags('数据库信息相关接口')
@Controller('database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Post()
  create(@Body() createDatabaseDto: CreateDatabaseDto) {
    return this.databaseService.create(createDatabaseDto);
  }

  @Get()
  @IsJwtPublic()
  findAll() {
    return this.databaseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.databaseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDatabaseDto: UpdateDatabaseDto) {
    return this.databaseService.update(+id, updateDatabaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.databaseService.remove(+id);
  }

  @ApiOperation({ summary: '获取表结构' })
  @IsJwtPublic()
  @Get('table-structure')
  findTableStructure(@Query() dto: QueryStructureDatabaseDto) {
    return this.databaseService.findTableStructure(dto.tableName, dto.tableSchema);
  }
}
