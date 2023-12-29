import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';

@Injectable()
export class AppService {
  getHello(): string {
    // return 'Hello World!';
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    // throw new Error('Forbidden');
  }
}
