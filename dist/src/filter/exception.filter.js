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
exports.AppExceptionFilter = void 0;
const utils_1 = require("../utils");
const common_1 = require("@nestjs/common");
const decorators_1 = require("@nestjs/common/decorators");
const chalk = require("chalk");
const dayjs = require("dayjs");
const nest_winston_1 = require("nest-winston");
const winston_1 = require("winston");
let AppExceptionFilter = class AppExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const status = exception.getStatus?.() || common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        if (exception.stack) {
            const stack = exception.stack.split('\n').slice(0, 2);
            const { location, message, type } = (0, utils_1.parseErrorMessage)(stack.join('\n'));
            const prefix = chalk.redBright('[Nest] ✘ - ');
            const t = chalk.bgRedBright.black(' Error ') + chalk.redBright(` - ${type} `);
            const method = location.method ? chalk.yellowBright(`[${location.method}] `) : '';
            const msg = message ? chalk.redBright(`${message} `) : '';
            const stackPath = location.filePath
                ? chalk.redBright(`\n error at ${location.filePath}:${location.position}`)
                : '';
            const log = prefix + dayjs().format('YYYY-MM-DD HH:mm:ss') + ' ' + t + method + msg + stackPath;
            this.logger.log('error', log, { stack: exception.stack });
        }
        const result = {
            success: false,
            timestamp: +new Date(),
            code: status,
            uri: request.url,
            error: exception.message || 'Unknown Error',
        };
        if (exception instanceof common_1.BadRequestException) {
            const response = exception.getResponse?.();
            result.error = response?.['error'] || exception.message;
            result.message = Array.isArray(response?.message) ? response.message.join('; ') : response?.message;
        }
        response.status(status).json(result);
    }
};
exports.AppExceptionFilter = AppExceptionFilter;
__decorate([
    (0, decorators_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER),
    __metadata("design:type", winston_1.Logger)
], AppExceptionFilter.prototype, "logger", void 0);
exports.AppExceptionFilter = AppExceptionFilter = __decorate([
    (0, common_1.Catch)()
], AppExceptionFilter);
//# sourceMappingURL=exception.filter.js.map