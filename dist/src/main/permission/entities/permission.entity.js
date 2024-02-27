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
exports.Permission = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const enum_1 = require("../../../types/enum");
let Permission = class Permission {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, createDate: { required: true, type: () => Date }, updateDate: { required: true, type: () => Date }, status: { required: true, enum: require("../../../types/enum").DataStatusEnum }, deleteDate: { required: true, type: () => Date }, name: { required: true, type: () => String } };
    }
};
exports.Permission = Permission;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Permission.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        comment: '创建时间',
        update: false,
    }),
    __metadata("design:type", Date)
], Permission.prototype, "createDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        comment: '修改时间',
        onUpdate: 'CURRENT_TIMESTAMP',
        nullable: true,
        transformer: { from: (value) => value, to: () => new Date() },
    }),
    __metadata("design:type", Date)
], Permission.prototype, "updateDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        comment: '状态',
        default: enum_1.DataStatusEnum.ENABLE,
        enum: enum_1.DataStatusEnum,
        select: false,
    }),
    __metadata("design:type", Number)
], Permission.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({
        type: 'timestamp',
        comment: '删除时间',
        nullable: true,
        default: null,
    }),
    __metadata("design:type", Date)
], Permission.prototype, "deleteDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 30,
        comment: '名称',
    }),
    __metadata("design:type", String)
], Permission.prototype, "name", void 0);
exports.Permission = Permission = __decorate([
    (0, typeorm_1.Entity)()
], Permission);
//# sourceMappingURL=permission.entity.js.map