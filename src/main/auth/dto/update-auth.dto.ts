import { PartialType } from '@nestjs/swagger';
import { SignupDto } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(SignupDto) {}
