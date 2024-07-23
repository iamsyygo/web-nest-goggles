import { Module } from '@nestjs/common';
import { LightweightCodeService } from './lightweight-code.service';
import { LightweightCodeController } from './lightweight-code.controller';

@Module({
  controllers: [LightweightCodeController],
  providers: [LightweightCodeService],
})
export class LightweightCodeModule {}
