import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RedisService } from '../redis/redis.service';
import { EmailService } from './email.service';
import { AppRedisKeyEnum } from '../../types/enum';
import { SkipJwtPassport } from '../../decorator/skip-jwt-passport.decorator';

@ApiTags('邮箱相关接口')
@Controller('email')
export class EmailController {
  @Inject()
  private redisService: RedisService;
  constructor(private readonly emailService: EmailService) {}

  @ApiOperation({ summary: '发送邮件验证码' })
  @ApiQuery({ name: 'email', required: true, description: '邮箱', example: '268303068722@qq.com' })
  @SkipJwtPassport()
  @Get('qq-code')
  async sendQQEmailCode(@Query('email') email) {
    const code = await this.handleCaptcha(email);
    try {
      await this.emailService.sendQQEmail({
        to: email,
        subject: '注册验证码',
        html: `<h3>你的注册验证码是 <span style="color:blue">${code}</span></h3>`,
      });
      return true;
    } catch (error) {
      this.redisService.del(AppRedisKeyEnum.CAPTCHA + email);
      throw new Error(error);
    }
  }

  @ApiOperation({ summary: '发送Resend验证码' })
  @ApiQuery({ name: 'email', required: true, description: '邮箱', example: '268303068722@qq.com' })
  @SkipJwtPassport()
  @Get('resend-code')
  async sendResendEmailCode(@Query('email') email) {
    const code = await this.handleCaptcha(email);
    try {
      await this.emailService.sendResendEmail({
        to: email,
        subject: '注册验证码',
        html: `<h3>你的注册验证码是 <span style="color:blue">${code}</span></h3>`,
      });
      return true;
    } catch (err) {
      this.redisService.del(AppRedisKeyEnum.CAPTCHA + email);
      throw new Error(err);
    }
  }

  private async handleCaptcha(email: string) {
    // 生成验证码
    const code = Math.random().toString(36).slice(-6);
    const has = await this.redisService.get(AppRedisKeyEnum.CAPTCHA + email);
    if (has) {
      throw new Error('请不要频繁发送验证码');
    }
    // 保存到redis
    this.redisService.set(AppRedisKeyEnum.CAPTCHA + email, code, 3 * 60);
    return code;
  }
}
