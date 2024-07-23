import { PartialType } from '@nestjs/swagger';
import { CreateLightweightCodeDto } from './create-lightweight-code.dto';

export class UpdateLightweightCodeDto extends PartialType(CreateLightweightCodeDto) {}
