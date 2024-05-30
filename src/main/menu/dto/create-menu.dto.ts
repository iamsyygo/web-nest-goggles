import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuDto {
  @ApiProperty({ description: '菜单名称' })
  name: string;

  @ApiProperty({ description: '菜单编码(路由)' })
  path: string;

  @ApiProperty({ description: '菜单层级', default: 1 })
  level: number;

  @ApiProperty({ description: '菜单所属父菜单 id', required: false })
  parentId: number;

  @ApiProperty({ description: '菜单描述', required: false })
  description: string;

  @ApiProperty({ description: '排序', required: false })
  sort: number;

  @ApiProperty({ description: '状态：1启用、0禁用', default: 1, required: false })
  status: number;

  @ApiProperty({ description: '菜单图标', required: false })
  icon: string;

  // @ApiProperty({ description: '菜单类型：1菜单、2按钮', default: 1 })
  // type: number;

  @ApiProperty({ description: '权限: 1所有权限、2系统权限、3自定义权限', default: [1] })
  roles: any[];
}
