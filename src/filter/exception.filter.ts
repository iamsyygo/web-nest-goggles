import { parseErrorMessage } from '@/utils';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import * as chalk from 'chalk';
import * as dayjs from 'dayjs';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

/**
 * Custom exception filter
 * @description Catch all exceptions and do something
 * @see https://docs.nestjs.com/exception-filters
 */
@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  @Inject(WINSTON_MODULE_PROVIDER)
  private readonly logger: Logger;

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const status = exception.getStatus?.() || HttpStatus.INTERNAL_SERVER_ERROR;
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    // if (exception.constructor.name === 'HttpException') {
    // const stack = exception.stack.split('\n').slice(0, 2);
    // consola.error(stack.join(' '));
    // this.logger.error(stack.join(' '));
    // }

    if (exception.stack) {
      // 截取前两行 stack
      const stack = exception.stack.split('\n').slice(0, 2);

      const { location, message, type } = parseErrorMessage(stack.join('\n'));

      const prefix = chalk.redBright('[Nest] ✘ - ');
      const t = chalk.bgRedBright.black(' Error ') + chalk.redBright(` - ${type} `);
      const method = location.method ? chalk.yellowBright(`[${location.method}] `) : '';
      const msg = message ? chalk.redBright(`${message} `) : '';
      const stackPath = location.filePath
        ? chalk.redBright(`\nat ${location.filePath}:${location.position}`)
        : '';
      const log = prefix + dayjs().format('YYYY-MM-DD HH:mm:ss') + ' ' + t + method + msg + stackPath;
      this.logger.log('error', log, { stack: exception.stack });
    }

    response.status(status).json({
      success: false,
      timestamp: +new Date(),
      code: status,
      error: exception.message || 'Unknown Error',
      uri: request.url,
    });
  }
}
