import { Column, DeleteDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DataSexEnum, DataStatusEnum } from '../../../types/enum';
import { Role } from '../../role/entities/role.entity';

// platform 用户来源
export enum PLATFORM_ENUM {
  // 当前
  CURRENT,
  // GitHub
  GITHUB,
}

// 示例：
// https://juejin.cn/post/7100159206132547621?searchId=20240125143117C746E8C1354801836F0E#heading-5

@Entity()
// @Index(['username'], { unique: true }) // 设置唯一索引
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '注册时间',
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
    // transformer: { from: (value: Date) => value, to: () => new Date() },
  })
  deleteDate: Date;

  @Column({
    type: 'enum',
    default: DataSexEnum.UNKNOWN,
    enum: DataSexEnum,
    comment: '性别',
  })
  gender: DataSexEnum;

  @Column({
    type: 'varchar',
    length: 30,
    comment: '用户名',
  })
  username: string;

  @Column({
    type: 'varchar',
    // select: false,
    length: 80,
    comment: '密码',
    nullable: true, // github 登录不需要密码
  })
  password: string;

  // fix: unable to read configuration file
  // @BeforeInsert()
  // async encryptPassword() {
  //   if (!this.password) throw new Error('密码是空的');
  //   this.password = await hashSync(this.password, YAML_DATA.bcrypt.salt);
  // }

  @Column({
    type: 'varchar',
    length: 30,
    comment: '邮箱',
    nullable: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 30,
    comment: '手机号码',
    nullable: true,
  })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: PLATFORM_ENUM,
    default: PLATFORM_ENUM.CURRENT,
    comment: '用户来源(所属平台)，0: 当前，1: GitHub',
  })
  platform: PLATFORM_ENUM;

  @Column({
    type: 'varchar',
    length: 30,
    comment: '平台标识',
    nullable: true,
  })
  platformId: string;

  @Column({
    type: 'varchar',
    length: 30,
    comment: '简介',
    nullable: true,
  })
  bio: string;

  @Column({
    type: 'varchar',
    length: 30,
    comment: '头像',
    nullable: true,
  })
  avatar: string;

  @Column({
    type: 'varchar',
    length: 50,
    comment: '社交链接',
    nullable: true,
  })
  socialLinks: string;

  @Column({
    type: 'varchar',
    length: 30,
    comment: '最后登录IP',
    nullable: true,
  })
  lastLoginIp: string;

  @Column({
    type: 'timestamp',
    onUpdate: 'CURRENT_TIMESTAMP',
    transformer: { from: (value: Date) => value, to: () => new Date() },
    nullable: true,
    comment: '最后登录时间',
  })
  lastLoginDate: Date;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_role_relation',
  })
  roles: Role[];
}
