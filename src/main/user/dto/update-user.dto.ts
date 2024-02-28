import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto extends PartialType(
  OmitType(User, ['createDate', 'password', 'lastLoginDate', 'lastLoginIp', 'updateDate'] as const),
) {}

export class UpdateUserPasswordDto {
  @IsNotEmpty({ message: '旧密码不能为空' })
  @ApiProperty({ description: '旧密码', example: '123456' })
  oldPassword: string;

  @IsNotEmpty({ message: '新密码不能为空' })
  @ApiProperty({ description: '新密码', example: '123456' })
  newPassword: string;

  @IsNotEmpty({ message: '确认密码不能为空' })
  @ApiProperty({ description: '确认密码', example: '123456' })
  confirmPassword: string;
}
