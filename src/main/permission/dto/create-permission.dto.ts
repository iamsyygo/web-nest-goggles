import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({ description: '角色名称', example: 'admin' })
  name: string;

  @ApiProperty({ description: '角色值', example: 1 })
  value: number;

  @ApiProperty({ description: '角色描述', example: '管理员' })
  description: string;
}
