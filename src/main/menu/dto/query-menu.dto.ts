import { ApiProperty } from '@nestjs/swagger';

export class QueryMenuTreeDto {
  @ApiProperty({ description: '角色 ids' })
  ids: number[];
}
