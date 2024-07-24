import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, MaxLength, MinLength, IsEmail } from 'class-validator';
import {} from '@nestjs/mapped-types';

export class CreateUserDto {
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  @ApiProperty({ description: '邮箱', example: '2683030687@qq.com' })
  email: string;

  @MinLength(8, { message: '密码长度不能小于8位' })
  @MaxLength(20, { message: '密码长度不能大于20位' })
  @ApiProperty({ description: '密码', example: '12345690' })
  password: string;
}
