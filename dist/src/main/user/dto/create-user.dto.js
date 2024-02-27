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
exports.CreateUserDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateUserDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { username: { required: true, type: () => String, minLength: 3, maxLength: 20 }, email: { required: true, type: () => String }, code: { required: true, type: () => String }, password: { required: true, type: () => String, minLength: 8, maxLength: 20 } };
    }
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, class_validator_1.MinLength)(3, { message: '用户名长度不能小于3位' }),
    (0, class_validator_1.MaxLength)(20, { message: '用户名长度不能大于20位' }),
    (0, swagger_1.ApiProperty)({ description: '用户名', example: 'admin' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: '邮箱不能为空' }),
    (0, class_validator_1.IsEmail)({}, { message: '邮箱格式不正确' }),
    (0, swagger_1.ApiProperty)({ description: '邮箱', example: '2683030687@qq.com' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: '验证码不能为空' }),
    (0, swagger_1.ApiProperty)({ description: '验证码', example: '123456' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.MinLength)(8, { message: '密码长度不能小于8位' }),
    (0, class_validator_1.MaxLength)(20, { message: '密码长度不能大于20位' }),
    (0, swagger_1.ApiProperty)({ description: '密码', example: '12345690' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
//# sourceMappingURL=create-user.dto.js.map