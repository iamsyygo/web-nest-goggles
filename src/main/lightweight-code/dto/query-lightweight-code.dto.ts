import { ApiProperty } from '@nestjs/swagger';

export class QueryLightweightCodeDto {
  @ApiProperty({ description: '表名称', required: false })
  tableName: string;

  @ApiProperty({ description: '字段中文名称', required: false })
  name: string;

  @ApiProperty({ description: '字段英文名称', required: false })
  key: string;

  @ApiProperty({ description: '排除字段', required: false })
  exclude: string[];
}
