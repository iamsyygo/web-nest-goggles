import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Upload {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '上传时间',
    update: false,
  })
  createDate: Date;

  @Column({
    type: 'timestamp',
    comment: '修改时间',
    onUpdate: 'CURRENT_TIMESTAMP',
    transformer: { from: (value: Date) => value, to: () => new Date() },
  })
  updateDate: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    comment: '删除时间',
    default: null,
    nullable: true,
  })
  deleteDate: Date;

  @Column({
    type: 'varchar',
    length: 100,
    comment: '文件名',
  })
  objectName: string;

  @Column({
    type: 'varchar',
    length: 100,
    comment: 'etag 信息',
  })
  etag: string;

  @Column({
    type: 'varchar',
    length: 100,
    comment: '原文件名',
  })
  originalname: string;

  @Column({
    type: 'varchar',
    length: 30,
    comment: '用户ID',
  })
  userId: string;

  @Column({
    type: 'varchar',
    length: 50,
    comment: '用户名称',
    nullable: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 1000,
    comment: 'minio 地址',
    nullable: true,
  })
  url: string;

  @Column({
    type: 'varchar',
    length: 100,
    comment: '文件类型',
    nullable: true,
  })
  mimetype: string;

  @Column({
    type: 'int',
    comment: '文件大小',
    nullable: true,
  })
  size: number;
}
