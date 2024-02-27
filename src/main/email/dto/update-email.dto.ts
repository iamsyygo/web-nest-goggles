import { PartialType } from '@nestjs/swagger';
import { CreateMailDto } from './create-email.dto';

export class UpdateMailDto extends PartialType(CreateMailDto) {}
