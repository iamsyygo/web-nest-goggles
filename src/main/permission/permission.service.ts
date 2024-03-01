import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PageQueryPermissionDto } from './dto/query-permission.dto';

@Injectable()
export class PermissionService {
  @InjectRepository(Permission)
  private readonly permissionRepo: Repository<Permission>;

  async create(createPermissionDto: CreatePermissionDto) {
    // 确保值名称唯一
    const permissionValuePresence = await this.permissionRepo.findOne({
      where: { value: createPermissionDto.value },
    });
    if (!permissionValuePresence?.id) {
      throw new BadRequestException('权限值已存在');
    }

    const permissionNamePresence = await this.permissionRepo.findOne({
      where: { name: createPermissionDto.name },
    });
    if (!permissionNamePresence?.id) {
      throw new BadRequestException('权限名称已存在');
    }
    return await this.permissionRepo.insert(createPermissionDto);
  }

  async findAll() {
    const reslut = await this.permissionRepo.find();
    return reslut;
  }

  async findOne(id: number) {
    const reslut = await this.permissionRepo.findOne({ where: { id } });
    return reslut;
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.permissionRepo.findOne({ where: { id } });
    if (!permission) {
      throw new BadRequestException('权限不存在');
    }

    const reslut = await this.permissionRepo.update(id, {
      ...updatePermissionDto,
    });
    return reslut.affected > 0;
  }

  async remove(id: number) {
    const reslut = await this.permissionRepo.softDelete(id);
    return reslut.affected > 0;
  }

  async findList(queryDto: PageQueryPermissionDto) {
    const { page = 1, pageSize = 10 } = queryDto;
    const [list, total] = await this.permissionRepo.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { list, total };
  }

  async findByIds(ids: number[]) {
    // return await this.permissionRepo.findByIds(ids);
    const reslut = await this.permissionRepo.findBy({ id: In(ids) });
    return reslut;
  }
}
