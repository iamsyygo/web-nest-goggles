import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { PageQueryRoleDto } from './dto/query-role.dto';
import { transformPageResult } from '@/utils';
import { Menu } from '../menu/entities/menu.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class RoleService {
  @InjectRepository(Role)
  private readonly roleRepo: Repository<Role>;
  @InjectRepository(Menu)
  private menuRepository: Repository<Menu>;
  @InjectRepository(User)
  private userRepository: Repository<User>;

  async create(createRoleDto: CreateRoleDto) {
    // 确保角色值名称唯一
    const roleValuePresence = await this.roleRepo.findOne({
      where: { value: createRoleDto.value },
    });
    if (roleValuePresence) {
      throw new BadRequestException('角色值已存在');
    }
    const roleNamePresence = await this.roleRepo.findOne({ where: { name: createRoleDto.name } });
    if (roleNamePresence) {
      throw new BadRequestException('角色名称已存在');
    }
    await this.roleRepo.insert(createRoleDto);
    return true;
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
    const { page = 1, pageSize = 10, name } = queryDto;
    const results = await this.roleRepo.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: {
        name: name ? Like(`%${name}%`) : Like('%%'),
      },
      withDeleted: true,
    });
    return transformPageResult({
      results,
      page,
      pageSize,
    });
  }

  async findByIds(ids: number[]) {
    const reslut = await this.roleRepo.findBy({ id: In(ids) });
    return reslut;
  }

  // 根据菜单id绑定角色
  async bindRoleMenu(role: number, menuIds: number[]) {
    const roleEntity = await this.roleRepo.findOne({
      where: { id: role },
    });
    if (!roleEntity) {
      throw new BadRequestException('角色不存在');
    }

    const menuEntities = await this.menuRepository.find({
      where: { id: In(menuIds) },
    });

    if (!menuEntities.length) {
      throw new BadRequestException('菜单不存在');
    }
    roleEntity.menus = menuEntities;
    await this.roleRepo.save(roleEntity);
  }
}
