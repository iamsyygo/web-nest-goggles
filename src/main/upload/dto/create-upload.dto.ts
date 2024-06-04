import { ApiProperty } from '@nestjs/swagger';

export class CreateUploadDto {
  @ApiProperty({ type: 'file', format: 'binary' })
  file: Express.Multer.File;
}
