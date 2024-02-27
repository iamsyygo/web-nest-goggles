"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const nest_winston_1 = require("nest-winston");
const yaml_config_1 = require("./config/yaml.config");
const winston_config_1 = require("./config/winston.config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_config_1 = require("./config/typeorm.config");
const schedule_1 = require("@nestjs/schedule");
const exception_filter_1 = require("./filter/exception.filter");
const core_1 = require("@nestjs/core");
const response_interceptor_1 = require("./interceptor/response.interceptor");
const user_module_1 = require("./main/user/user.module");
const blob_upload_module_1 = require("./main/blob-upload/blob-upload.module");
const jwt_passport_guard_1 = require("./guard/jwt-passport.guard");
const role_module_1 = require("./main/role/role.module");
const permission_module_1 = require("./main/permission/permission.module");
const email_module_1 = require("./main/email/email.module");
const redis_module_1 = require("./main/redis/redis.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                load: [yaml_config_1.yamlConfigLoad],
                isGlobal: true,
                cache: true,
            }),
            nest_winston_1.WinstonModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: winston_config_1.winstonUseFactory,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: typeorm_config_1.typeOrmUseFactory,
            }),
            schedule_1.ScheduleModule.forRoot(),
            user_module_1.UserModule,
            blob_upload_module_1.BlobUploadModule,
            role_module_1.RoleModule,
            permission_module_1.PermissionModule,
            email_module_1.EmailModule,
            redis_module_1.RedisModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            { provide: core_1.APP_GUARD, useClass: jwt_passport_guard_1.AppJwtAuthGuard },
            { provide: core_1.APP_FILTER, useClass: exception_filter_1.AppExceptionFilter },
            { provide: core_1.APP_INTERCEPTOR, useClass: response_interceptor_1.AppResponseInterceptor },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map