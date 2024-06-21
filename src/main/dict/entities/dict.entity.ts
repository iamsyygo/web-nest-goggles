import { DataStatusEnum } from '@/types/enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';

@Entity('dict_category')
export class DictCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, comment: '字典分类名称' })
  name: string;

  @Column({ unique: true, comment: '字典分类 code' })
  code: string;

  @Column({ comment: '描述', nullable: true })
  description: string;

  @Column({
    type: 'timestamp',
    comment: '创建时间',
    default: () => 'CURRENT_TIMESTAMP',
    update: false,
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    comment: '更新时间',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: true,
    transformer: { from: (value: Date) => value, to: () => new Date() },
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    comment: '删除时间',
    nullable: true,
    default: null,
    select: false,
  })
  deleteAt: Date;

  @Column({
    type: 'enum',
    comment: '状态',
    default: DataStatusEnum.ENABLE,
    enum: DataStatusEnum,
  })
  status: DataStatusEnum;

  @Column({ nullable: true, comment: '父级 id' })
  parentId: number;

  @Column({ comment: '排序', nullable: true })
  sort: number;
}

@Entity('dict_item')
export class DictItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '字典名称',
  })
  label: string;

  @Column({
    comment: '字典值',
    // unique: true,
    type: 'varchar',
  })
  value: string;

  //   @ManyToOne(() => DictCategory, (category) => category.items)
  //   @JoinColumn({ name: 'category_id' })
  //   category: DictCategory;

  @Column({
    type: 'timestamp',
    comment: '创建时间',
    default: () => 'CURRENT_TIMESTAMP',
    update: false,
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    comment: '更新时间',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: true,
    transformer: { from: (value: Date) => value, to: () => new Date() },
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    comment: '删除时间',
    nullable: true,
    default: null,
    select: false,
  })
  deleteAt: Date;

  @Column({
    type: 'enum',
    comment: '状态',
    default: DataStatusEnum.ENABLE,
    enum: DataStatusEnum,
  })
  status: DataStatusEnum;

  @Column({ comment: '分类 code', type: 'varchar' })
  categoryCode: any;

  @Column({ comment: '排序', nullable: true })
  sort: number;
}
