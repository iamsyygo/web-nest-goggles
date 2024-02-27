import { EmailService } from './email.service';
export declare class EmailController {
    private readonly emailService;
    private redisService;
    constructor(emailService: EmailService);
    sendEmailCode(email: any): Promise<boolean>;
}
