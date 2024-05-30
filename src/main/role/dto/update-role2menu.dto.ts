import { ApiProperty } from '@nestjs/swagger';

export class UpdateRole2MenuDto {
  @ApiProperty({ description: '角色 id', example: 1 })
  role: number;

  @ApiProperty({ description: '菜单 id 列表', example: [2, 3, 4] })
  menuIds: number[];
}
