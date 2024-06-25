import { ApiProperty } from '@nestjs/swagger';

// export class CreateConfigDto extends OmitType(config, ['createDate', 'updateDate', 'deleteDate'] as const) {}
export class CreateConfigDto {
  @ApiProperty({ description: '配置名称', example: 'admin' })
  name: string;

  @ApiProperty({ description: '配置值', example: 1 })
  value: number;

  @ApiProperty({ description: '配置描述', example: '管理员' })
  description?: string;
}
