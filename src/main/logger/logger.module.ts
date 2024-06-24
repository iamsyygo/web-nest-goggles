import { LoggerService } from './logger.service';
import { LoggerController } from './logger.controller';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { LoggerOptions, createLogger, format, transports } from 'winston';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

export const WINSTON_LOGGER_TOKEN = 'WINSTON_LOGGER';

@Global()
@Module({
  controllers: [LoggerController],
  providers: [LoggerService],
})
export class LoggerModule {
  public static forRootAsync(): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          inject: [ConfigService],
          provide: WINSTON_LOGGER_TOKEN,
          useFactory: async (configService: ConfigService) => {
            const winstonWonfig = configService.get('logs.winston') as AppYamlConfig['logs']['winston'];
            const { dirname, filename, datePattern, level, ...rest } = winstonWonfig;

            const pwd = process.cwd();
            const dir = path.join(pwd, dirname || '/logs/winston');
            const loggerOptions: LoggerOptions = {
              transports: [
                new transports.Console({
                  level: 'info',
                  format: format.combine(
                    // winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                    format.printf((info) => {
                      return info.message;
                    }),
                  ),
                }),
                new transports.DailyRotateFile({
                  format: format.combine(
                    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                    format.printf(({ level, timestamp, stack, message }) => {
                      if (!stack) return message;
                      return JSON.stringify({ level, timestamp, stack });
                    }),
                  ),
                  dirname: dir,
                  filename: filename + '.info.log',
                  datePattern,
                  ...rest,
                }),
              ],
              // ...winstonConfig,
              exceptionHandlers: [
                new transports.DailyRotateFile({
                  dirname: dir,
                  filename: filename + '.exception.log',
                  datePattern,
                  ...rest,
                }),
              ],
              rejectionHandlers: [
                new transports.DailyRotateFile({
                  dirname: dir,
                  filename: filename + '.reject.log',
                  datePattern,
                  ...rest,
                }),
              ],
              exitOnError: true,
            };
            return new LoggerService(loggerOptions);
          },
        },
      ],
      exports: [WINSTON_LOGGER_TOKEN],
    };
  }

  public static forRoot(): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: WINSTON_LOGGER_TOKEN,
          useValue: new LoggerService({
            transports: [
              new transports.Console({
                level: 'info',
                format: format.combine(
                  // winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                  format.printf((info) => {
                    return info.message;
                  }),
                ),
              }),
            ],
            exceptionHandlers: [new transports.Console()],
            rejectionHandlers: [new transports.Console()],
            exitOnError: true,
          }),
        },
      ],
      exports: [WINSTON_LOGGER_TOKEN],
    };
  }
}
