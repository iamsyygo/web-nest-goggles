import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export declare const typeOrmUseFactory: (configService: ConfigService) => TypeOrmModuleOptions;
