import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, Length, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmpty()
  @MinLength(12, { message: '用户名长度不能小于12位' })
  @ApiProperty({ description: '用户名', example: 'admin' })
  username: string;

  @ApiProperty({ description: '密码', example: '123456' })
  password: string;
}
