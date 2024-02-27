"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppResponseInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let AppResponseInterceptor = class AppResponseInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, rxjs_1.map)((data) => {
            const ctx = context.switchToHttp();
            const request = ctx.getRequest();
            const response = ctx.getResponse();
            const status = response.statusCode || common_1.HttpStatus.OK;
            response.status(status).json({
                success: true,
                code: status,
                bizdata: data,
                message: '请求成功',
                timestamp: +Date.now(),
                uri: request.url,
            });
        }));
    }
};
exports.AppResponseInterceptor = AppResponseInterceptor;
exports.AppResponseInterceptor = AppResponseInterceptor = __decorate([
    (0, common_1.Injectable)()
], AppResponseInterceptor);
//# sourceMappingURL=response.interceptor.js.map