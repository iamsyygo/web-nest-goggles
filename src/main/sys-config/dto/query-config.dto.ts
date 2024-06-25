import { ApiProperty } from '@nestjs/swagger';

export class PageQueryConfigDto {
  @ApiProperty({ description: '页码', example: 1 })
  page: number;

  @ApiProperty({ description: '每页数量', example: 10 })
  pageSize: number;

  @ApiProperty({ description: '名称', example: 10 })
  name: string;
}
