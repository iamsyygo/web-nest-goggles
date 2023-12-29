import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import { consola } from 'consola';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

/**
 * Custom exception filter
 * @description Catch all exceptions and do something
 * @see https://docs.nestjs.com/exception-filters
 */
@Catch(HttpException || Error)
export class AppExceptionFilter implements ExceptionFilter {
  @Inject(WINSTON_MODULE_PROVIDER)
  private readonly logger: Logger;

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const status = exception.getStatus();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    if (exception.stack) {
      const stack = exception.stack.split('\n').slice(0, 2);
      consola.error(stack.join(' '));
      this.logger.error(stack.join(' '));
    }
    response.status(status).json({
      timestamp: +new Date(),
      code: status,
      error: exception.message || 'Unknown Error',
    });
  }
}
