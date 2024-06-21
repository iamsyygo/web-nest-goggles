import { PartialType } from '@nestjs/swagger';
import { CreateDictDto, CreateCategoryDto } from './create-dict.dto';

export class UpdateDictDto extends PartialType(CreateDictDto) {
  id: number;
}
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  id: number;
}
