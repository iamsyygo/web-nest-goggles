import { OmitType, PartialType, PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(
  OmitType(User, ['createDate', 'password', 'lastLoginDate', 'lastLoginIp', 'updateDate'] as const),
) {}
