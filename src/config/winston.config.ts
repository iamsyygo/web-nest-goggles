import { ConfigService } from '@nestjs/config';
import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as path from 'path';
import { parse } from '@/utils/stack-trace';
import * as chalk from 'chalk';

const chalkmaps = {
  error: chalk.redBright,
  warn: chalk.yellowBright,
  info: chalk.blueBright,
  http: chalk.greenBright,
  verbose: chalk.magentaBright,
  debug: chalk.cyanBright,
  silly: chalk.whiteBright,
};

export const winstonUseFactory = (
  configService: ConfigService,
): WinstonModuleOptions | Record<keyof any, any> => {
  // production mode does not output logs
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
          winston.format.printf((info) => {
            // 加粗
            const nest = chalk.bold('[Nest]');
            // 灰色
            const date = chalk.gray(info.date);
            const log = `${nest} ${date}  {${info.path}, ${info.method}} route
${info.level}: ${info.message}`;

            if (info.level === 'error') {
              const firstStack = parse(info.exception)[0];
              const filePath =
                firstStack.fileName + ':' + firstStack.lineNumber + ':' + firstStack.columnNumber;

              return chalkmaps[info.level || 'info'](log) + '\n' + chalk.redBright(filePath);
            }
            return chalkmaps[info.level || 'info'](log);
          }),
        ),
      }),
      new winston.transports.DailyRotateFile({
        format: winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.printf(({ level, timestamp, exception, message }) => {
            const firstStack = parse(exception)[0];
            return JSON.stringify(
              {
                level,
                timestamp,
                message,
                stack: {
                  ...firstStack,
                  fileName: firstStack.fileName + ':' + firstStack.lineNumber + ':' + firstStack.columnNumber,
                },
              },
              null,
              2,
            );
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
        format: winston.format.json({
          space: 2,
        }),
        dirname: dir,
        filename: filename + '.exception.log',
        datePattern,
        ...rest,
      }),
    ],
    // rejectionHandlers: [
    //   new winston.transports.DailyRotateFile({
    //     format: winston.format.json({
    //       space: 2,
    //     }),
    //     dirname: dir,
    //     filename: filename + '.reject.log',
    //     datePattern,
    //     ...rest,
    //   }),
    // ],

    exitOnError: true,
  };
};
