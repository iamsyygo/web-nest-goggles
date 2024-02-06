import { ConfigService } from '@nestjs/config';
import { WinstonModuleOptions } from 'nest-winston';
import 'winston-daily-rotate-file';
export declare const winstonUseFactory: (configService: ConfigService) => WinstonModuleOptions;
