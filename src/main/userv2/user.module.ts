import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthStrategy, JwtUseFactory } from '../../config/jwt.config';
import { UserV2 } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserV2]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: JwtUseFactory,
    }),
  ],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService, JwtAuthStrategy],
})
export class UserModuleV2 {}
