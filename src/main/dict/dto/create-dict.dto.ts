import { DataStatusEnum } from '@/types/enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateDictDto {
  @IsNotEmpty({ message: '字典名称不能为空' })
  @ApiProperty({ description: '字典名称' })
  label: string;

  @IsNotEmpty({ message: '字典值不能为空' })
  @ApiProperty({ description: '字典值' })
  value: string;

  @IsNotEmpty({ message: '字典分类不能为空' })
  @ApiProperty({ description: '字典分类' })
  categoryCode?: number;

  @ApiProperty({ description: '排序' })
  sort?: number;

  @ApiProperty({ description: '描述' })
  description?: string;

  @ApiProperty({ description: '状态', enum: DataStatusEnum })
  status?: DataStatusEnum;
}

export class CreateCategoryDto {
  @IsNotEmpty({ message: '字典分类名称不能为空' })
  @ApiProperty({ description: '字典分类名称' })
  name: string;

  @IsNotEmpty({ message: '字典分类 code 不能为空' })
  @ApiProperty({ description: '字典分类 code' })
  code: string;

  @ApiProperty({ description: '字典分类 parentId' })
  parentId?: number;

  @ApiProperty({ description: '排序' })
  sort?: number;

  @ApiProperty({ description: '描述' })
  description?: string;

  @ApiProperty({ description: '状态', enum: DataStatusEnum })
  status?: DataStatusEnum;
}
