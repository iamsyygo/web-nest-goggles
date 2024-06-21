import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DictService } from './dict.service';
import { CreateCategoryDto, CreateDictDto } from './dto/create-dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryDictDto } from './dto/query-dict.dto';

@ApiTags('字典相关接口')
@Controller('dict')
export class DictController {
  constructor(private readonly dictService: DictService) {}

  @ApiOperation({ summary: '创建字典' })
  @Post('/create-dict')
  createDict(@Body() createDictDto: CreateDictDto) {
    return this.dictService.createDict(createDictDto);
  }

  @ApiOperation({ summary: '创建字典分类' })
  @Post('/create-category')
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.dictService.createCategory(createCategoryDto);
  }
  @ApiOperation({ summary: '获取所有字典分类' })
  @Post('/get-categories')
  getCategories() {
    return this.dictService.getCategories();
  }

  @ApiOperation({ summary: '获取字典列表' })
  @Get('/get-dict-list')
  getDictList(@Query() query: QueryDictDto) {
    return this.dictService.getDictList(query);
  }
  @ApiOperation({ summary: '更新字典分类' })
  @Patch('/update-category')
  updateCategory(@Body() updateCategoryDto: UpdateDictDto) {
    return this.dictService.updateCategory(updateCategoryDto);
  }

  @ApiOperation({ summary: '更新字典' })
  @Patch('/update-dict')
  updateDict(@Body() updateDictDto: UpdateDictDto) {
    return this.dictService.updateDict(updateDictDto);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.dictService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDictDto: UpdateDictDto) {
  //   return this.dictService.update(+id, updateDictDto);
  // }

  @ApiOperation({ summary: '删除字典' })
  @Delete('/remove-dict/:id')
  removeDict(@Param('id') id: string) {
    return this.dictService.removeDict(+id);
  }

  @ApiOperation({ summary: '删除字典分类' })
  @Delete('/remove-category/:id')
  removeCategory(@Param('id') id: string) {
    return this.dictService.removeCategory(+id);
  }

  @ApiOperation({ summary: '获取所有字典(前端使用)' })
  @Get('/get-all-dict')
  findAll() {
    return this.dictService.findAll();
  }

  @ApiOperation({ summary: '获取所有字典(前端使用) v2' })
  @Get('/get-all-dict-v2')
  findAllV2() {
    return this.dictService.findAllV2();
  }
}
