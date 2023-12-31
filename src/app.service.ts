import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { BadRequestException, HttpException } from '@nestjs/common/exceptions';

@Injectable()
export class AppService {
  getHello(): string {
    // return 'Hello World!';
    // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    // throw new BadRequestException();
    // throw new Error('Forbidden');

    return 'Hello World!';
  }
}
