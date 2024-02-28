import { EmailService } from './email.service';
export declare class EmailController {
    private readonly emailService;
    private redisService;
    constructor(emailService: EmailService);
    sendQQEmailCode(email: any): Promise<boolean>;
    sendResendEmailCode(email: any): Promise<boolean>;
    private handleCaptcha;
}
