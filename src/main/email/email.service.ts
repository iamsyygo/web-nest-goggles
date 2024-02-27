import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class EmailService {
  transporter: Transporter;
  emailConfig: AppYamlConfig['email'];

  constructor(private readonly configService: ConfigService) {
    const email = this.configService.get('email') as AppYamlConfig['email'];
    this.emailConfig = email;
    this.transporter = createTransport(email);
  }

  async sendEmail({ to, subject, html }: Mail.Options) {
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
}
