import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { yamlConfigLoad } from '@/config/yaml.config';
import { winstonUseFactory } from '@/config/winston.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmUseFactory } from '@/config/typeorm.config';
// import { redisUseFactory } from '@/config/redis.config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppExceptionFilter } from '@/filter/exception.filter';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppResponseInterceptor } from '@/interceptor/response.interceptor';
import { UploadModule } from '@/main/upload/upload.module';
import { RoleModule } from '@/main/role/role.module';
import { PermissionModule } from '@/main/permission/permission.module';
import { EmailModule } from '@/main/email/email.module';
import { RedisModule } from '@/main/redis/redis.module';
import { MenuModule } from '@/main/menu/menu.module';
import { MiniprogramModule } from './main/miniprogram/miniprogram.module';
import { DatabaseModule } from '@/main/database/database.module';
import { MinioModule } from '@/main/minio/minio.module';
import { GithubModule } from '@/main/github/github.module';
import { BookmarksModule } from '@/main/bookmarks/bookmarks.module';
import { DictModule } from '@/main/dict/dict.module';
import { ConfigModule as SysConfigModule } from '@/main/sys-config/config.module';
// import { LoggerModule } from './main/logger/logger.module';
import { LightweightCodeModule } from './main/lightweight-code/lightweight-code.module';
import { AuthModule } from '@/main/auth/auth.module';
import { UserModule } from './main/user/user.module';
import { JwtAuthGuard } from '@/guard/jwt-auth.guard';

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
    UploadModule,
    RoleModule,
    PermissionModule,
    EmailModule,
    RedisModule,
    MinioModule,
    MenuModule,
    MiniprogramModule,
    DatabaseModule,
    GithubModule,
    BookmarksModule,
    DictModule,
    SysConfigModule,
    LightweightCodeModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   inject: [ConfigService],
    //   provide: AppEnum.REDIS,
    //   useFactory: redisUseFactory,
    // },
    // { provide: APP_GUARD, useClass: AppJwtAuthGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_FILTER, useClass: AppExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: AppResponseInterceptor },
  ],
})
export class AppModule {}
