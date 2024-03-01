import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import { DataStatusEnum } from '../../../types/enum';

@Entity('menu')
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '创建时间',
    update: false,
  })
  createTime: Date;

  @Column({
    type: 'timestamp',
    comment: '修改时间',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: true,
    transformer: { from: (value: Date) => value, to: () => new Date() },
  })
  updateTime: Date;

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
    // transformer: { from: (value: Date) => value, to: () => new Date() },
  })
  deleteDate: Date;

  @Column({ comment: '菜单名称' })
  name: string;

  @Column({ comment: '菜单编码(路由)' })
  path: string;

  @Column({ comment: '菜单层级', default: 1 })
  level: number;

  @Column({ comment: '菜单所属菜单', nullable: true, type: 'varchar' })
  parentId: number;

  @Column({ comment: '菜单描述', nullable: true })
  description: string;

  @Column({ comment: '排序', nullable: true })
  sort: number;

  @Column({ comment: '菜单图标', nullable: true })
  icon: string;

  @ManyToMany(() => Role, (Role) => Role)
  @JoinTable({
    name: 'menu_role_relation',
  })
  roles: Role[];

  @ManyToOne(() => Menu, (Menu) => Menu.children, {
    onDelete: 'CASCADE', // 级联删除
    createForeignKeyConstraints: true, // 取消外键约束
  })
  parent: Menu;

  @OneToMany(() => Menu, (Menu) => Menu.parent)
  children: Menu[];
}