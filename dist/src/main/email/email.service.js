"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer_1 = require("nodemailer");
const resend_1 = require("resend");
let EmailService = class EmailService {
    constructor(configService) {
        this.configService = configService;
        const email = this.configService.get('email');
        this.resendApiKey = this.configService.get('resendApiKey');
        this.emailConfig = email;
        this.transporter = (0, nodemailer_1.createTransport)(email);
    }
    async sendQQEmail({ to, subject, html }) {
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
        const resend = new resend_1.Resend(this.resendApiKey);
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to,
            subject,
            html,
        });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map