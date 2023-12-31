import { DataEnumSex, DataEnumStatus } from '@/types/enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
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
  registrationDate: Date;

  @Column({
    type: 'timestamp',
    comment: '更新时间',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: true,
    transformer: { from: (value: Date) => value, to: () => new Date() },
  })
  updateDate: Date;

  @Column({
    type: 'enum',
    comment: '状态',
    default: DataEnumStatus.ENABLE,
    enum: DataEnumStatus,
    select: false,
  })
  status: DataEnumStatus;

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

  @Column({
    type: 'varchar',
    length: 30,
    comment: '邮箱',
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 30,
    comment: '手机号码',
  })
  phoneNumber: string;

  @Column({
    type: 'varchar',
    length: 30,
    comment: '姓名',
  })
  fullName: string;

  @Column({
    type: 'varchar',
    length: 30,
    comment: '简介',
  })
  bio: string;

  @Column({
    type: 'varchar',
    length: 30,
    comment: '头像',
  })
  avatar: string;

  @Column({
    type: 'varchar',
    length: 50,
    comment: '社交链接',
  })
  socialLinks: string;

  @Column({
    type: 'varchar',
    length: 30,
    comment: '性别',
  })
  gender: any;

  //   @Column({
  //     type: 'varchar',
  //     length: 30,
  //     comment: '用户类型',
  //   })
  //   userType: any;

  //   @Column({
  //     type: 'varchar',
  //     length: 30,
  //     comment: '账号状态',
  //   })
  //   accountStatus: any;

  @Column({
    type: 'varchar',
    length: 30,
    comment: '最后登录IP',
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
