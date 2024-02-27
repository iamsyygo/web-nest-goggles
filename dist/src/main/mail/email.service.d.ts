import { ConfigService } from '@nestjs/config';
import { Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
export declare class EmailService {
    private readonly configService;
    transporter: Transporter;
    emailConfig: AppYamlConfig['email'];
    constructor(configService: ConfigService);
    sendEmail({ to, subject, html }: Mail.Options): Promise<void>;
}
