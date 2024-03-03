import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, MaxLength, MinLength, IsEmail } from 'class-validator';
import {} from '@nestjs/mapped-types';

export class CreateUserDto {
  // @IsNotEmpty()
  // @MinLength(3, { message: '用户名长度不能小于3位' })
  // @MaxLength(20, { message: '用户名长度不能大于20位' })
  // @ApiProperty({ description: '用户名', example: 'admin' })
  // username: string;

  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  @ApiProperty({ description: '邮箱', example: '2683030687@qq.com' })
  email: string;

  @IsNotEmpty({ message: '验证码不能为空' })
  @ApiProperty({ description: '验证码', example: '123456' })
  code: string;

  @MinLength(8, { message: '密码长度不能小于8位' })
  @MaxLength(20, { message: '密码长度不能大于20位' })
  @ApiProperty({ description: '密码', example: '12345690' })
  // @Matches(/^[\w_-]{10,20}$/, {
  //   message: '密码可以是字母、数字、下划线、中划线组成的10-20位字符串',
  // })
  password: string;
}
