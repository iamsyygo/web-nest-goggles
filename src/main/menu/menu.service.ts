import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { RoleService } from '../role/role.service';
import { Role } from '../role/entities/role.entity';
import { QueryMenuTreeDto } from './dto/query-menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async createMenu(createMenuDto: CreateMenuDto) {
    const { roleIds } = createMenuDto;
    const roles = await this.roleRepository.findByIds(roleIds.split(','));

    const entities = plainToClass(Menu, {
      ...createMenuDto,
      roles,
    });
    return this.menuRepository.save(entities);
  }

  async findMenuByRole(ids: number[]) {
    if (!ids?.length) return [];

    const queryBuilder = this.menuRepository.createQueryBuilder('menu');

    // 根据多个角色 id 获取菜单列表
    const menus = await queryBuilder
      .innerJoinAndSelect('menu.roles', 'role', 'role.id IN (:...roleIds)', { roleIds: ids })
      .addOrderBy('menu.parentId, menu.sort', 'ASC') // 按照 parentId 和 order 排序
      // 排除一些字段返回
      .select(['menu.id', 'menu.parentId', 'menu.name', 'menu.path', 'menu.icon'])
      .getMany();

    return this.createMenuHierarchy(menus);
  }

  findOne(id: number) {
    return this.menuRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
  }

  async update(id: number, dto: UpdateMenuDto) {
    const hasMenu = await this.menuRepository.findOne({
      where: { id },
    });
    console.log(hasMenu);

    if (!hasMenu) {
      return '菜单不存在';
    }

    const { roleIds } = dto;
    const roles = await this.roleRepository.findByIds(roleIds.split(','));

    if (!roles.length) return '角色不存在';

    const entities = plainToClass(Menu, {
      ...dto,
      roles,
    });
    return this.menuRepository.save(entities);
  }

  async remove(id: number) {
    const result = await this.menuRepository.delete(id);
    if (result.affected === 0) return '菜单不存在';

    return true;
  }

  private createMenuHierarchy(menus: Menu[]) {
    const menuMap = new Map<number, Menu>();
    const pathMaps: Record<string, Menu> = {};
    const menuTree: Menu[] = [];

    for (const menu of menus) {
      delete menu.roles;
      menuMap.set(menu.id, menu);
      pathMaps[menu.path] = menu;

      const parentMenu = menuMap.get(menu.parentId);
      if (parentMenu) {
        parentMenu.children ??= [];
        parentMenu.children.push(menu);
      } else {
        menuTree.push(menu);
      }
    }
    return {
      menus: menuTree,
      pathMaps,
    };
  }
}
