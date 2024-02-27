import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { yamlConfigLoad } from './config/yaml.config';
import { winstonUseFactory } from './config/winston.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmUseFactory } from './config/typeorm.config';
// import { redisUseFactory } from './config/redis.config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppExceptionFilter } from './filter/exception.filter';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppResponseInterceptor } from './interceptor/response.interceptor';
import { UserModule } from './main/user/user.module';
import { BlobUploadModule } from './main/blob-upload/blob-upload.module';
import { AppJwtAuthGuard } from './guard/jwt-passport.guard';
import { RoleModule } from './main/role/role.module';
import { PermissionModule } from './main/permission/permission.module';
import { EmailModule } from './main/email/email.module';
import { RedisModule } from './main/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [yamlConfigLoad],
      isGlobal: true,
      cache: true,
    }),
    WinstonModule.forRootAsync({
      // fix('WinstonModule): use imports ConfigModule in winstonUseFactory cannot get ConfigService data
      // @see https://github.com/gremo/nest-winston#async-configuration
      // imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: winstonUseFactory,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: typeOrmUseFactory,
    }),
    ScheduleModule.forRoot(),
    UserModule,
    BlobUploadModule,
    RoleModule,
    PermissionModule,
    EmailModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   inject: [ConfigService],
    //   provide: AppEnum.REDIS,
    //   useFactory: redisUseFactory,
    // },
    { provide: APP_GUARD, useClass: AppJwtAuthGuard },
    { provide: APP_FILTER, useClass: AppExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: AppResponseInterceptor },
  ],
})
export class AppModule {}
