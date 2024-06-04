import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from './entities/upload.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtAuthStrategy, JwtUseFactory } from '@/config/jwt.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Upload]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: JwtUseFactory,
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService, JwtAuthStrategy],
})
export class UploadModule {}
