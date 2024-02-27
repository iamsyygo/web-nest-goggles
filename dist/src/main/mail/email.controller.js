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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const email_service_1 = require("./email.service");
const redis_service_1 = require("../redis/redis.service");
const swagger_1 = require("@nestjs/swagger");
let EmailController = class EmailController {
    constructor(emailService) {
        this.emailService = emailService;
    }
    async sendEmailCode(email) {
        const code = Math.random().toString(36).slice(-6);
        await this.redisService.set(`app_register_${email}`, code, 5 * 60);
        await this.emailService.sendEmail({
            to: email,
            subject: '注册验证码',
            html: `<h3>你的注册验证码是 <span style="color:blue">${code}</span></h3>`,
        });
        return true;
    }
};
exports.EmailController = EmailController;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", redis_service_1.RedisService)
], EmailController.prototype, "redisService", void 0);
__decorate([
    (0, swagger_1.ApiOperation)({ description: '发送邮件验证码', summary: '发送邮件验证码' }),
    (0, swagger_1.ApiQuery)({ name: 'email', required: true, description: '邮箱' }),
    (0, common_1.Get)('code'),
    openapi.ApiResponse({ status: 200, type: Boolean }),
    __param(0, (0, common_1.Query)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "sendEmailCode", null);
exports.EmailController = EmailController = __decorate([
    (0, common_1.Controller)('email'),
    __metadata("design:paramtypes", [email_service_1.EmailService])
], EmailController);
//# sourceMappingURL=email.controller.js.map