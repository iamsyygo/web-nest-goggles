import { Column, DeleteDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DataStatusEnum } from '../../../types/enum';
import { Permission } from '../../permission/entities/permission.entity';
import { Menu } from '@/main/menu/entities/menu.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '创建时间',
    update: false,
  })
  createDate: Date;

  @Column({
    type: 'timestamp',
    comment: '修改时间',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: true,
    transformer: { from: (value: Date) => value, to: () => new Date() },
  })
  updateDate: Date;

  @Column({
    type: 'enum',
    comment: '状态',
    default: DataStatusEnum.ENABLE,
    enum: DataStatusEnum,
    select: false,
  })
  status: DataStatusEnum;

  @DeleteDateColumn({
    type: 'timestamp',
    comment: '删除时间',
    nullable: true,
    default: null,
  })
  deleteDate: Date;

  @Column({
    type: 'varchar',
    length: 30,
    comment: '名称',
  })
  name: string;

  @Column({
    type: 'int',
    comment: '名称',
  })
  value: number;

  @Column({
    type: 'varchar',
    length: 100,
    comment: '描述',
  })
  description: string;

  @ManyToMany(() => Menu, (Menu) => Menu)
  @JoinTable({
    name: 'menu_role_relation',
  })
  menus: Menu[];

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'role_permission_relation',
  })
  permissions: Permission[];
}
