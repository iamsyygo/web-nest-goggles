import { ApiProperty } from '@nestjs/swagger';

export class CreateBookmarkDto {
  @ApiProperty({ type: 'file', format: 'binary' })
  file: Express.Multer.File;
}
