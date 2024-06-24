import { Injectable, ConsoleLogger, LoggerService as _LoggerService, LogLevel } from '@nestjs/common';
import { Logger, createLogger } from 'winston';

@Injectable()
export class LoggerService implements _LoggerService {
  private readonly logger: Logger;

  constructor(options) {
    this.logger = createLogger(options);
  }

  log(message: string, context: string) {
    this.logger.log('info', `[${context}] ${message}`);
  }

  error(message: string, context: string) {
    this.logger.log('error', `[${context}] ${message}`);
  }

  warn(message: string, context: string) {
    this.logger.log('warn', `[${context}] ${message}`);
  }
}
