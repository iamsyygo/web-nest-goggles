import { DataStatusEnum } from '@/types/enum';
import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bookmark')
export class Bookmark {
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
  })
  status: DataStatusEnum;

  @DeleteDateColumn({
    type: 'timestamp',
    comment: '删除时间',
    nullable: true,
    default: null,
  })
  deleteDate: Date;

  @Column({ comment: '标题' })
  title: string;

  @Column({ comment: '地址', length: 1000 })
  url: string;

  @Column({ comment: '描述', nullable: true })
  description: string;

  @Column({ comment: '排序', nullable: true })
  sort: number;

  @Column({ comment: '图标', nullable: true, length: 3000 })
  icon: string;

  @Column({ comment: '添加时间' })
  addDate: Date;
}
