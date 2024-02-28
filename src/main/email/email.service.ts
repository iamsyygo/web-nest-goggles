import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  transporter: Transporter;
  emailConfig: AppYamlConfig['email'];
  resendApiKey: string;

  constructor(private readonly configService: ConfigService) {
    const email = this.configService.get('email') as AppYamlConfig['email'];
    this.resendApiKey = this.configService.get('resendApiKey');
    this.emailConfig = email;
    this.transporter = createTransport(email);
  }

  async sendQQEmail({ to, subject, html }: Mail.Options) {
    await this.transporter.sendMail({
      from: {
        name: '系统邮件',
        address: this.emailConfig.auth.user,
      },
      to,
      subject,
      html,
    });
  }

  async sendResendEmail({ to, subject, html }) {
    const resend = new Resend(this.resendApiKey);
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject,
      html,
    });
  }
}
