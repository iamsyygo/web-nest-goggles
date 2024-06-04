import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { In, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { RoleService } from '../role/role.service';
import { Role } from '../role/entities/role.entity';
import { QueryMenuTreeDto } from './dto/query-menu.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createMenu(dto: CreateMenuDto) {
    const { roles } = dto;
    let rdata = [];
    if (roles?.length) {
      rdata = await this.roleRepository.findBy({ id: In(roles) });
    }
    const entities = plainToClass(Menu, {
      ...dto,
      roles: rdata,
    });

    const mdata = await this.menuRepository.save(entities);

    // if has parent menu, update parent menu children
    let pplain: Menu = null;
    if (dto.parentId) {
      const parentMenu = await this.menuRepository.findOne({
        where: { id: dto.parentId },
      });
      pplain = parentMenu;

      // update parent menu children
      parentMenu.children ??= [];
      parentMenu.children.push(mdata);
      await this.menuRepository.save(parentMenu);
    }
    return mdata;
  }

  async findMenuByRole(user: User) {
    if (!user?.id) return [];
    // 查询用户的角色
    const { roles } = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['roles'],
    });

    const queryBuilder = this.menuRepository.createQueryBuilder('menu');
    const rids = roles.map(({ id }) => id);

    const mrs = await queryBuilder.innerJoinAndSelect('menu.roles', 'role', 'role.id IN (:...rids)', {
      rids,
    });

    const menuData = await mrs.getMany();

    const menuTree = await mrs
      .leftJoinAndSelect('menu.children', 'children')

      // 过滤 children role != user role
      .innerJoinAndSelect('children.roles', 'crole', 'crole.id IN (:...rids)', {
        rids,
      })

      .where('menu.parent IS NULL')
      .addOrderBy('menu.sort', 'ASC')
      // 排除一些字段返回
      .select([
        'menu.id',
        'menu.name',
        'menu.path',
        'menu.icon',
        'menu.sort',
        'menu.description',
        'menu.level',
        'menu.status',
        // 'children',
        'children.id',
        'children.name',
        'children.path',
        'children.icon',
        'children.sort',
        'children.description',
        'children.level',
        'children.status',
      ])
      .getMany();

    // const menus = await queryBuilder
    //   .innerJoinAndSelect('menu.roles', 'role', 'role.id IN (:...rids)', {
    //     rids,
    //   })
    //   // .leftJoinAndSelect('menu.parent', 'parent')
    //   .leftJoinAndSelect('menu.children', 'children')
    //   .where('menu.parent IS NULL')
    //   .addOrderBy('menu.sort', 'ASC')
    //   // 排除一些字段返回
    //   .select([
    //     'menu.id',
    //     'menu.name',
    //     'menu.path',
    //     'menu.icon',
    //     'menu.sort',
    //     'menu.description',
    //     'menu.level',
    //     'menu.status',
    //     // 'children',
    //     'children.id',
    //     'children.name',
    //     'children.path',
    //     'children.icon',
    //     'children.sort',
    //     'children.description',
    //     'children.level',
    //     'children.status',
    //   ])
    //   .getMany();

    const paths = menuData.map((menu) => menu.path);

    return { menus: menuTree, paths };
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

    const { roles } = dto;
    const rolesData = await this.roleRepository.findBy({ id: In(roles) });

    if (!rolesData.length) return '角色不存在';

    const entities = plainToClass(Menu, {
      ...dto,
      roles: rolesData,
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
      const parentMenu = menu.parent && menuMap.get(menu.parent.id);
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

  /**
   * 根据角色 id 获取菜单列表
   * @param roles
   * @returns 菜单列表对象pathMaps
   */
  async findMenuByRoleIds(roles: number[]) {
    const queryBuilder = this.menuRepository.createQueryBuilder('menu');
    const menus = await queryBuilder
      .innerJoinAndSelect('menu.roles', 'role', 'role.id IN (:...rids)', {
        rids: roles,
      })
      .andWhere('menu.status = 1')
      .select(['menu.id', 'menu.path'])
      .getMany();

    return menus.map((menu) => menu.path);
  }
}
