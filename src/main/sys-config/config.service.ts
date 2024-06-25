import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { Config } from './entities/config.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { PageQueryConfigDto } from './dto/query-config.dto';
import { transformPageResult } from '@/utils';
import { Menu } from '../menu/entities/menu.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ConfigService {
  @InjectRepository(Config)
  private readonly configRepo: Repository<Config>;
  private userRepository: Repository<User>;

  async create(createConfigDto: CreateConfigDto) {
    // 确保配置值名称唯一
    const configValuePresence = await this.configRepo.findOne({
      where: { value: createConfigDto.value },
    });
    if (configValuePresence) {
      throw new BadRequestException('配置值已存在');
    }
    const configNamePresence = await this.configRepo.findOne({ where: { name: createConfigDto.name } });
    if (configNamePresence) {
      throw new BadRequestException('配置名称已存在');
    }
    await this.configRepo.insert(createConfigDto);
    return true;
  }

  async findAll() {
    const reslut = await this.configRepo.find();
    return reslut;
  }

  async findOne(id: number) {
    const reslut = await this.configRepo.findOne({ where: { id } });
    return reslut;
  }

  async update(id: number, updateConfigDto: UpdateConfigDto) {
    const config = await this.configRepo.findOne({ where: { id } });
    if (!config) {
      throw new BadRequestException('配置不存在');
    }

    const reslut = await this.configRepo.update(id, {
      ...updateConfigDto,
    });
    return reslut.affected > 0;
  }

  async remove(id: number) {
    const reslut = await this.configRepo.softDelete(id);
    return reslut.affected > 0;
  }

  async findList(queryDto: PageQueryConfigDto) {
    const { page = 1, pageSize = 10, name } = queryDto;
    const results = await this.configRepo.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: {
        name: name ? Like(`%${name}%`) : Like('%%'),
      },
      withDeleted: false,
    });
    return transformPageResult({
      results,
      page,
      pageSize,
    });
  }

  async findByIds(ids: number[]) {
    const reslut = await this.configRepo.findBy({ id: In(ids) });
    return reslut;
  }
  async save(entity: UpdateConfigDto & CreateConfigDto) {
    const configEntity = await this.configRepo.findOne({
      where: {
        name: entity.name,
        value: entity.value,
      },
    });
    if (
      (configEntity?.name === entity.name || configEntity?.value === entity.value) &&
      entity.id !== configEntity.id
    ) {
      throw new BadRequestException('配置名称或值已存在');
    }
    return this.configRepo.save(entity);
  }
}
