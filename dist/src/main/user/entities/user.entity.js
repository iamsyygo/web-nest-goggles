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
exports.User = void 0;
const openapi = require("@nestjs/swagger");
const enum_1 = require("../../../types/enum");
const typeorm_1 = require("typeorm");
const role_entity_1 = require("../../role/entities/role.entity");
let User = class User {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, createDate: { required: true, type: () => Date }, updateDate: { required: true, type: () => Date }, status: { required: true, enum: require("../../../types/enum").DataStatusEnum }, deleteDate: { required: true, type: () => Date }, gender: { required: true, enum: require("../../../types/enum").DataSexEnum }, username: { required: true, type: () => String }, password: { required: true, type: () => String }, email: { required: true, type: () => String }, phoneNumber: { required: true, type: () => String }, bio: { required: true, type: () => String }, avatar: { required: true, type: () => String }, socialLinks: { required: true, type: () => String }, lastLoginIp: { required: true, type: () => String }, lastLoginDate: { required: true, type: () => Date }, roles: { required: true, type: () => [require("../../role/entities/role.entity").Role] } };
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        comment: '注册时间',
        update: false,
    }),
    __metadata("design:type", Date)
], User.prototype, "createDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        comment: '修改时间',
        onUpdate: 'CURRENT_TIMESTAMP',
        nullable: true,
        transformer: { from: (value) => value, to: () => new Date() },
    }),
    __metadata("design:type", Date)
], User.prototype, "updateDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        comment: '状态',
        default: enum_1.DataStatusEnum.ENABLE,
        enum: enum_1.DataStatusEnum,
        select: false,
    }),
    __metadata("design:type", Number)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({
        type: 'timestamp',
        comment: '删除时间',
        nullable: true,
        default: null,
    }),
    __metadata("design:type", Date)
], User.prototype, "deleteDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        default: enum_1.DataSexEnum.UNKNOWN,
        enum: enum_1.DataSexEnum,
        comment: '性别',
    }),
    __metadata("design:type", Number)
], User.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 30,
        comment: '用户名',
    }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 80,
        comment: '密码',
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 30,
        comment: '邮箱',
        nullable: true,
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 30,
        comment: '手机号码',
        nullable: true,
    }),
    __metadata("design:type", String)
], User.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 30,
        comment: '简介',
        nullable: true,
    }),
    __metadata("design:type", String)
], User.prototype, "bio", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 30,
        comment: '头像',
        nullable: true,
    }),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        comment: '社交链接',
        nullable: true,
    }),
    __metadata("design:type", String)
], User.prototype, "socialLinks", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 30,
        comment: '最后登录IP',
        nullable: true,
    }),
    __metadata("design:type", String)
], User.prototype, "lastLoginIp", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        onUpdate: 'CURRENT_TIMESTAMP',
        transformer: { from: (value) => value, to: () => new Date() },
        nullable: true,
        comment: '最后登录时间',
    }),
    __metadata("design:type", Date)
], User.prototype, "lastLoginDate", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => role_entity_1.Role),
    (0, typeorm_1.JoinTable)({
        name: 'user_role_relation',
    }),
    __metadata("design:type", Array)
], User.prototype, "roles", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)()
], User);
//# sourceMappingURL=user.entity.js.map