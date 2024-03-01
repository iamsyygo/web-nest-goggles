import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PageQueryRoleDto } from './dto/query-role.dto';

@Injectable()
export class RoleService {
  @InjectRepository(Role)
  private readonly roleRepo: Repository<Role>;

  async create(createRoleDto: CreateRoleDto) {
    // 确保角色值名称唯一
    const roleValuePresence = await this.roleRepo.findOne({
      where: { value: createRoleDto.value },
    });
    if (!roleValuePresence?.id) {
      throw new BadRequestException('角色值已存在');
    }

    const roleNamePresence = await this.roleRepo.findOne({ where: { name: createRoleDto.name } });
    if (!roleNamePresence?.id) {
      throw new BadRequestException('角色名称已存在');
    }
    return await this.roleRepo.insert(createRoleDto);
  }

  async findAll() {
    const reslut = await this.roleRepo.find();
    return reslut;
  }

  async findOne(id: number) {
    const reslut = await this.roleRepo.findOne({ where: { id } });
    return reslut;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) {
      throw new BadRequestException('角色不存在');
    }

    const reslut = await this.roleRepo.update(id, {
      ...updateRoleDto,
    });
    return reslut.affected > 0;
  }

  async remove(id: number) {
    const reslut = await this.roleRepo.softDelete(id);
    return reslut.affected > 0;
  }

  async findList(queryDto: PageQueryRoleDto) {
    const { page = 1, pageSize = 10 } = queryDto;
    const [list, total] = await this.roleRepo.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { list, total };
  }

  async findByIds(ids: number[]) {
    const reslut = await this.roleRepo.findBy({ id: In(ids) });
    return reslut;
  }
}
