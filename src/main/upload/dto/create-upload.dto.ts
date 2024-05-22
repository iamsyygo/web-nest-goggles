import {} from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateBlobUploadDto {
  // @ApiProperty({ description: '文件名称', example: '文件名称' })
  // @IsString()
  // name: string;

  // @ApiProperty({ description: '文件大小', example: '4.5 * 1024KB' })
  // @IsString()
  // size: string;

  @ApiProperty({ type: 'file', format: 'binary' })
  file: any;
}
