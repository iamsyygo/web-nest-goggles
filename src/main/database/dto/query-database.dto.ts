import { ApiProperty } from '@nestjs/swagger';

export class QueryStructureDatabaseDto {
  @ApiProperty({ description: '名称' })
  tableName: string;

  @ApiProperty({ description: '数据库名称', example: 'goggles-dev' })
  tableSchema: string;
}
