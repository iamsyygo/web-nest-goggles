import { parse } from '@/utils/stack-trace';
import { parseErrorMessage } from '../utils';
import * as requestIp from 'request-ip';
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import * as chalk from 'chalk';
import * as dayjs from 'dayjs';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { isErrored } from 'winston-daily-rotate-file';

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

    const { ip, method, path } = request;
    const userAgent = request.headers['user-agent'];
    const clientIp = requestIp.getClientIp(ip) || ip;
    const isHttpErrored = exception instanceof HttpException;

    const logData = {
      date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      ip: clientIp,
      method,
      path,
      userAgent,
      status,
      exception: exception,
    };

    // if (exception.constructor.name === 'HttpException') {
    // const stack = exception.stack.split('\n').slice(0, 2);
    // consola.error(stack.join(' '));
    // this.logger.error(stack.join(' '));
    // }

    if (process.env.NODE_ENV === 'development' && isHttpErrored) {
      // 截取前两行 stack
      // const stack = exception.stack.split('\n').slice(0, 2);
      // const { location, message, type } = parseErrorMessage(stack.join('\n'));
      // const prefix = chalk.redBright('[Nest] ✘ - ');
      // const t = chalk.bgRedBright.black(' Error ') + chalk.redBright(` - ${type} `);
      // const method = location.method ? chalk.yellowBright(`[${location.method}] `) : '';
      // const msg = message ? chalk.redBright(`${message} `) : '';
      // const stackPath = location.filePath
      //   ? chalk.redBright(`\n error at ${location.filePath}:${location.position}`)
      //   : '';
      // @ts-ignore
      // const log = prefix + dayjs().format('YYYY-MM-DD HH:mm:ss') + ' ' + t + method + msg + stackPath;
      // const firstStack = parse(exception)[0];
      // this.logger.log('error', log, {
      //   stack: {
      //     ...firstStack,
      //     fileName: firstStack.fileName + ':' + firstStack.lineNumber + ':' + firstStack.columnNumber,
      //   },
      // });

      this.logger.log('error', logData.exception.message, logData);
    }

    const result = {
      success: false,
      timestamp: +new Date(),
      code: status,
      uri: request.url,
      error: exception.message || 'Unknown Error',
    };

    if (exception instanceof BadRequestException) {
      const response = exception.getResponse?.();
      result.error = response?.['error'] || exception.message;
      // @ts-expect-error
      result.message = Array.isArray(response?.message) ? response.message.join('; ') : response?.message;
    }
    response.status(status).json(result);
  }
}
