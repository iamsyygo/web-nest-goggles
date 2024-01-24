import { ApiProperty } from '@nestjs/swagger';
import { Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @MinLength(8, { message: '用户名长度不能小于8位' })
  @MaxLength(20, { message: '用户名长度不能大于20位' })
  @ApiProperty({ description: '用户名', example: 'admin' })
  username: string;

  @MinLength(10, { message: '密码长度不能小于10位' })
  @MaxLength(20, { message: '密码长度不能大于20位' })
  @ApiProperty({ description: '密码', example: '12345690' })
  @Matches(/^[\w_-]{10,20}$/, {
    message: '密码可以是字母、数字、下划线、中划线组成的10-20位字符串',
  })
  password: string;
}
