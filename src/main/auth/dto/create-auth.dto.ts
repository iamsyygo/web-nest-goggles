import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength, IsEmail } from 'class-validator';
export class SignupDto {
  @ApiProperty({ description: '用户名', example: 'admin' })
  username: string;

  @MinLength(8, { message: '密码长度不能小于8位' })
  @MaxLength(20, { message: '密码长度不能大于20位' })
  @ApiProperty({ description: '密码', example: '12345690' })
  password: string;

  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  @ApiProperty({ description: '邮箱', example: '2683030687@qq.com' })
  email: string;
}

export class SigninUserNameDto {
  @ApiProperty({ description: '用户名', example: 'admin' })
  username: string;

  @MinLength(8, { message: '密码长度不能小于8位' })
  @MaxLength(20, { message: '密码长度不能大于20位' })
  @ApiProperty({ description: '密码', example: '12345690' })
  password: string;
}

export class SigninEmailDto {
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  @ApiProperty({ description: '邮箱', example: '2683030687@qq.com' })
  email: string;

  @IsNotEmpty({ message: '验证码不能为空' })
  code: string;
}
