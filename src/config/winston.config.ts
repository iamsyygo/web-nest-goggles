import { ConfigService } from '@nestjs/config';
import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as path from 'path';

export const winstonUseFactory = (
  configService: ConfigService,
): WinstonModuleOptions | Record<keyof any, any> => {
  if (process.env.NODE_ENV !== 'development') return {};

  const winstonWonfig = configService.get('logs.winston') as AppYamlConfig['logs']['winston'];
  const { dirname, filename, datePattern, level, ...rest } = winstonWonfig;
  const pwd = process.cwd();
  const dir = path.join(pwd, dirname || '/logs/winston');

  return {
    // format: winston.format.label(),
    transports: [
      new winston.transports.Console({
        level,
        format: winston.format.combine(
          // winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.printf((info) => {
            return info.message;
          }),
        ),
      }),
      new winston.transports.DailyRotateFile({
        format: winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.printf(({ level, timestamp, stack, message }) => {
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
      new winston.transports.DailyRotateFile({
        dirname: dir,
        filename: filename + '.exception.log',
        datePattern,
        ...rest,
      }),
    ],
    rejectionHandlers: [
      new winston.transports.DailyRotateFile({
        dirname: dir,
        filename: filename + '.reject.log',
        datePattern,
        ...rest,
      }),
    ],
    exitOnError: true,
  };
};
