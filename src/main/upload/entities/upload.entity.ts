import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DataStatusEnum } from '@/types/enum';

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
    default: null,
    nullable: true,
    // transformer: { from: (value: Date) => value, to: () => new Date() },
  })
  deleteDate: Date;

  @Column({
    type: 'varchar',
    length: 30,
    comment: '文件名',
  })
  fileName: string;

  @Column({
    type: 'varchar',
    // select: false,
    length: 500,
    comment: '文件路径',
  })
  url: string;

  @Column({
    type: 'varchar',
    length: 500,
    comment: '下载地址',
  })
  downloadUrl: string;

  @Column({
    type: 'varchar',
    length: 500,
    comment: '路径名',
  })
  pathname: string;

  @Column({
    type: 'varchar',
    length: 30,
    comment: '文件类型',
  })
  contentType: string;

  @Column({
    type: 'varchar',
    length: 500,
    comment: 'contentDisposition',
  })
  contentDisposition: string;

  @Column({
    type: 'varchar',
    length: 100,
    comment: '文件大小',
  })
  size: number;
}
