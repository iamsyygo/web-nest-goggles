import { DataSexEnum, DataStatusEnum } from '@/types/enum';
import { hashSync } from 'bcryptjs';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
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
    length: 80,
    comment: '密码',
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
}
