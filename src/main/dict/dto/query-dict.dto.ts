import { DataStatusEnum } from '@/types/enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class QueryDictDto {
  @ApiProperty({ description: '页码', example: 1 })
  page: number;

  @ApiProperty({ description: '每页数量', example: 10 })
  pageSize: number;

  @ApiProperty({ description: '字典名称' })
  label: string;

  @ApiProperty({ description: '字典值' })
  value: string;

  @ApiProperty({ description: '字典分类' })
  categoryCode?: number;

  // @ApiProperty({ description: '排序' })
  // sort?: number;

  @ApiProperty({ description: '描述' })
  description?: string;

  @ApiProperty({ description: '状态', enum: DataStatusEnum })
  status?: DataStatusEnum;
}
