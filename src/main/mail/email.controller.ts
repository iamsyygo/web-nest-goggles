import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Inject } from '@nestjs/common';
import { EmailService } from './email.service';
import { CreateMailDto } from './dto/create-email.dto';
import { UpdateMailDto } from './dto/update-email.dto';
import { RedisService } from '../redis/redis.service';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('email')
export class EmailController {
  @Inject()
  private redisService: RedisService;
  constructor(private readonly emailService: EmailService) {}

  @ApiOperation({ description: '发送邮件验证码', summary: '发送邮件验证码' })
  @ApiQuery({ name: 'email', required: true, description: '邮箱' })
  @Get('code')
  async sendEmailCode(@Query('email') email) {
    const code = Math.random().toString(36).slice(-6);

    // 5分钟内有效
    await this.redisService.set(`app_register_${email}`, code, 5 * 60);
    await this.emailService.sendEmail({
      to: email,
      subject: '注册验证码',
      html: `<h3>你的注册验证码是 <span style="color:blue">${code}</span></h3>`,
    });
    return true;
  }
}
