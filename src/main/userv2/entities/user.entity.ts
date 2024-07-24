import { Column, DeleteDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DataSexEnum, DataStatusEnum } from '@/types/enum';
import { Role } from '@/main/role/entities/role.entity';

export enum PLATFORM_ENUM {
  CURRENT,
  GITHUB,
}

@Entity({
  name: 'user_v2',
})
export class UserV2 {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, comment: '用户名', length: 100 })
  username: string;

  @Column({
    type: 'varchar',
    comment: '密码',
  })
  password: string;

  @Column({ nullable: true, unique: true, comment: '邮箱' })
  email: string;

  @Column({
    type: 'enum',
    default: DataSexEnum.UNKNOWN,
    enum: DataSexEnum,
    comment: '性别',
  })
  sex: DataSexEnum;

  @Column({
    type: 'enum',
    enum: PLATFORM_ENUM,
    default: PLATFORM_ENUM.CURRENT,
    comment: '用户来源(所属平台)',
  })
  platform: PLATFORM_ENUM;

  @Column({
    type: 'varchar',
    length: 1000,
    comment: '头像',
    nullable: true,
  })
  avatar: string;

  @Column({
    type: 'varchar',
    length: 100,
    comment: '备注',
    nullable: true,
  })
  comment: string;

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
  })
  status: DataStatusEnum;

  @DeleteDateColumn({
    type: 'timestamp',
    comment: '删除时间',
    nullable: true,
    default: null,
  })
  deleteDate: Date;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_v2_role_relation',
  })
  roles: Role[];
}
