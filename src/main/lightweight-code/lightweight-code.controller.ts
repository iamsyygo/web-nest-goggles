import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LightweightCodeService } from './lightweight-code.service';
import { CreateLightweightCodeDto } from './dto/create-lightweight-code.dto';
import { UpdateLightweightCodeDto } from './dto/update-lightweight-code.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryLightweightCodeDto } from './dto/query-lightweight-code.dto';

@ApiTags('轻量实验室相关接口')
@Controller('lightweight-code')
export class LightweightCodeController {
  constructor(private readonly lightweightCodeService: LightweightCodeService) {}

  @ApiOperation({ summary: '根据表获取前端字段配置' })
  @Post('/get-lightweight-code')
  getLightweight(@Body() queryLightweightCodeDto: QueryLightweightCodeDto) {
    return this.lightweightCodeService.getLightweight(queryLightweightCodeDto);
  }

  @Get()
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id: string) {}

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLightweightCodeDto: UpdateLightweightCodeDto) {}

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
