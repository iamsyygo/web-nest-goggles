import { Module } from '@nestjs/common';
import { BlobUploadService } from './blob-upload.service';
import { BlobUploadController } from './blob-upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlobUpload } from './entities/blob-upload.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtAuthStrategy, JwtUseFactory } from '../../config/jwt.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlobUpload]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: JwtUseFactory,
    }),
  ],
  controllers: [BlobUploadController],
  providers: [BlobUploadService, JwtAuthStrategy],
})
export class BlobUploadModule {}
