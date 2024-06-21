import { Module } from '@nestjs/common';
import { DictService } from './dict.service';
import { DictController } from './dict.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DictCategory, DictItem } from './entities/dict.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DictCategory, DictItem])],
  controllers: [DictController],
  providers: [DictService],
})
export class DictModule {}
