import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { CreateDatabaseDto } from './dto/create-database.dto';
import { UpdateDatabaseDto } from './dto/update-database.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipJwtPassport } from '@/decorator/skip-jwt-passport.decorator';
import { QueryStructureDatabaseDto } from './dto/query-database.dto';

@ApiTags('数据库信息相关接口')
@Controller('database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Post()
  create(@Body() createDatabaseDto: CreateDatabaseDto) {
    return this.databaseService.create(createDatabaseDto);
  }

  @Get()
  @SkipJwtPassport()
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
  @SkipJwtPassport()
  @Get('table-structure')
  findTableStructure(@Query() dto: QueryStructureDatabaseDto) {
    return this.databaseService.findTableStructure(dto.tableName, dto.tableSchema);
  }
}
