import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto, CreateDictDto } from './dto/create-dict.dto';
import { UpdateCategoryDto, UpdateDictDto } from './dto/update-dict.dto';
import { DictCategory, DictItem } from './entities/dict.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Like, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { createHierarchy } from '@/utils/tree.handle';
import { QueryDictDto } from './dto/query-dict.dto';
import { transformPageResult } from '@/utils';

@Injectable()
export class DictService {
  @InjectRepository(DictCategory)
  private categoryRepository: Repository<DictCategory>;

  @InjectRepository(DictItem)
  private dictRepository: Repository<DictItem>;

  @InjectDataSource()
  private readonly dataSource: DataSource;

  async createDict(createDictDto: CreateDictDto) {
    const dicts = await this.dictRepository.find({
      where: {
        value: createDictDto.value,
        categoryCode: createDictDto.categoryCode,
      },
    });

    if (dicts.length) {
      throw new HttpException('分类中已存在此字典值', HttpStatus.BAD_REQUEST);
    }

    const entity = plainToClass(DictItem, createDictDto);
    const dict = await this.dictRepository.save(entity);
    return dict;
  }
  async createCategory(createCategoryDto: CreateCategoryDto) {
    const categorys = await this.categoryRepository.find({
      where: {
        code: createCategoryDto.code,
      },
    });

    if (categorys.length) {
      throw new HttpException('已存在此分类 code', HttpStatus.BAD_REQUEST);
    }
    const entity = plainToClass(DictCategory, createCategoryDto);
    const category = await this.categoryRepository.save(entity);
    return category;
  }

  async getCategories() {
    const category = await this.categoryRepository.find();
    return createHierarchy(category);
  }

  // update category
  async updateCategory(updateDictDto: UpdateCategoryDto) {
    if (!updateDictDto.id) {
      throw new HttpException('分类 id 不能为空', HttpStatus.BAD_REQUEST);
    }

    const category = await this.categoryRepository.findOne({
      where: { id: updateDictDto.id },
    });

    if (!category) {
      throw new HttpException('分类不存在', HttpStatus.BAD_REQUEST);
    }

    const entity = plainToClass(DictCategory, updateDictDto);
    await this.categoryRepository.save(entity);
    return entity;
  }

  // remove category
  async removeCategory(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new HttpException('分类不存在', HttpStatus.BAD_REQUEST);
    }

    await this.categoryRepository.remove(category);
    return true;
  }

  // remove dict
  async removeDict(id: number) {
    const dict = await this.dictRepository.findOne({
      where: { id },
    });

    if (!dict) {
      throw new HttpException('字典不存在', HttpStatus.BAD_REQUEST);
    }

    await this.dictRepository.remove(dict);
    return true;
  }

  // update dict
  async updateDict(updateDictDto: UpdateDictDto) {
    if (!updateDictDto.id) {
      throw new HttpException('字典 id 不能为空', HttpStatus.BAD_REQUEST);
    }

    const dict = await this.dictRepository.findOne({
      where: { id: updateDictDto.id },
    });

    if (!dict) {
      throw new HttpException('字典不存在', HttpStatus.BAD_REQUEST);
    }

    const entity = plainToClass(DictItem, updateDictDto);
    await this.dictRepository.save(entity);
    return entity;
  }

  async getDictList(query: QueryDictDto) {
    const { page = 1, pageSize = 10 } = query;
    const results = await this.dictRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: {
        categoryCode: query.categoryCode,
        label: query.label ? Like(`%${query.label}%`) : Like('%%'),
        value: query.value ? Like(`%${query.value}%`) : Like('%%'),
        status: query.status,
      },
      withDeleted: false,
    });
    return transformPageResult({
      results,
      page,
      pageSize,
    });
  }

  async findAll() {
    const [rawResult] = await this.dataSource.query(`SELECT
      JSON_OBJECTAGG(category_code, data_array) AS result
    FROM (
      SELECT
          category_code,
          JSON_ARRAYAGG(JSON_OBJECT('label', label, 'value', value)) AS data_array
      FROM dict_item
      WHERE status = '1'
      GROUP BY category_code
    ) AS subquery;`);
    return rawResult.result || {};
  }
  async findAllV2() {
    const [rawResult] = await this.dataSource.query(`SELECT
    JSON_OBJECTAGG(category_code, data_array) AS result
FROM (
    SELECT
        category_code,
        JSON_OBJECTAGG(value, label) AS data_array
    FROM
        dict_item
    WHERE
        status = '1'
    GROUP BY
        category_code
) AS subquery;`);
    return rawResult.result || {};
  }
}
