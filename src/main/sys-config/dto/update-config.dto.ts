import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateConfigDto } from './create-config.dto';

export class UpdateConfigDto extends PartialType(CreateConfigDto) {
  @ApiProperty({ description: '配置id' })
  id?: number;
}
