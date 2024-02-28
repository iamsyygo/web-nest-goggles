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

  @ApiOperation({ summary: '发送邮件验证码' })
  @ApiQuery({ name: 'email', required: true, description: '邮箱', example: '268303068722@qq.com' })
  @Get('qq-code')
  async sendQQEmailCode(@Query('email') email) {
    const code = await this.handleCaptcha(email);
    await this.emailService.sendQQEmail({
      to: email,
      subject: '注册验证码',
      html: `<h3>你的注册验证码是 <span style="color:blue">${code}</span></h3>`,
    });
    return true;
  }

  @ApiOperation({ description: '发送Resend验证码', summary: '发送邮件验证码' })
  @ApiQuery({ name: 'email', required: true, description: '邮箱' })
  @Get('resend-code')
  async sendResendEmailCode(@Query('email') email) {
    const code = await this.handleCaptcha(email);
    await this.emailService.sendQQEmail({
      to: email,
      subject: '注册验证码',
      html: `<h3>你的注册验证码是 <span style="color:blue">${code}</span></h3>`,
    });
    return true;
  }

  private async handleCaptcha(email: string) {
    // 生成验证码
    const code = Math.random().toString(36).slice(-6);

    const has = await this.redisService.get(`app_register_captcha_${email}`);
    if (has) {
      throw new Error('请不要频繁发送验证码');
    }

    // 保存到redis
    this.redisService.set(`app_register_captcha_${email}`, code, 5 * 60);
    return code;
  }
}
