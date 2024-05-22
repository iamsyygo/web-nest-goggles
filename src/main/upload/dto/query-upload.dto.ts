import { ApiProperty } from '@nestjs/swagger';
import { Matches, MaxLength, MinLength } from 'class-validator';
import { Upload } from '../entities/upload.entity';

export class PageQueryDto {
  @ApiProperty({ description: '页码', example: 1 })
  page: number;

  @ApiProperty({ description: '每页数量', example: 10 })
  pageSize: number;
}
