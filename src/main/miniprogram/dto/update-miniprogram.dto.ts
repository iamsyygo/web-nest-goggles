import { PartialType } from '@nestjs/swagger';
import { CreateMiniprogramDto } from './create-miniprogram.dto';

export class UpdateMiniprogramDto extends PartialType(CreateMiniprogramDto) {}
