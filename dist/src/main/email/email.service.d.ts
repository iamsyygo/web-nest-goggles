import { ConfigService } from '@nestjs/config';
import { Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
export declare class EmailService {
    private readonly configService;
    transporter: Transporter;
    emailConfig: AppYamlConfig['email'];
    resendApiKey: string;
    constructor(configService: ConfigService);
    sendQQEmail({ to, subject, html }: Mail.Options): Promise<void>;
    sendResendEmail({ to, subject, html }: {
        to: any;
        subject: any;
        html: any;
    }): Promise<void>;
}
