import { ApiProperty } from '@nestjs/swagger';

export class QueryAuthDto {
  @ApiProperty({ description: '', required: false })
  name: string;
}
