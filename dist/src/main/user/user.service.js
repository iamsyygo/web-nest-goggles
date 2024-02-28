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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const bcryptjs_1 = require("bcryptjs");
const jwt_1 = require("@nestjs/jwt");
const redis_service_1 = require("../redis/redis.service");
let UserService = class UserService {
    constructor(configService, jwtService) {
        this.configService = configService;
        this.jwtService = jwtService;
    }
    async create(createUserDto) {
        const codeInRedis = await this.redisService.get(`app_register_captcha_${createUserDto.email}`);
        if (!codeInRedis) {
            throw new common_1.UnauthorizedException('验证码已失效');
        }
        if (createUserDto.code !== codeInRedis) {
            throw new common_1.UnauthorizedException('验证码不正确');
        }
        const notEmpty = await this.userRepo.findOne({
            where: {
                username: createUserDto.email,
            },
        });
        if (!!notEmpty)
            throw new common_1.BadRequestException('用户名已存在');
        const salt = this.configService.get('bcrypt.salt', 10);
        const password = await (0, bcryptjs_1.hashSync)(createUserDto.password, salt);
        const user = await this.userRepo.insert({
            ...createUserDto,
            password,
        });
        if (user.identifiers.length === 0)
            throw new common_1.BadRequestException('创建失败');
        await this.redisService.del(`app_register_captcha_${createUserDto.email}`);
        return true;
    }
    async login(loginUserDto, req) {
        const codeInRedis = await this.redisService.get(`app_register_captcha_${loginUserDto.email}`);
        if (!codeInRedis) {
            throw new common_1.UnauthorizedException('验证码已失效');
        }
        if (loginUserDto.code !== codeInRedis) {
            throw new common_1.UnauthorizedException('验证码不正确');
        }
        const user = await this.userRepo.findOne({
            where: {
                username: loginUserDto.username,
            },
            relations: {
                roles: true,
            },
        });
        if (!user)
            throw new common_1.BadRequestException('用户名不存在');
        const pair = await (0, bcryptjs_1.compare)(loginUserDto.password, user.password);
        if (!pair)
            throw new common_1.BadRequestException('密码错误');
        const token = await this.jwtService.signAsync({
            id: user.id,
            username: user.username,
            email: user.email,
        });
        const authorization = 'Bearer ' + token;
        user.lastLoginIp = req.headers.host.split(':')[0];
        const u = await this.userRepo.save(user);
        delete u.password;
        return {
            authorization,
            user: u,
        };
    }
    async findList({ page = 1, pageSize = 10 }) {
        const [list, total] = await this.userRepo.findAndCount({
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        return {
            list,
            total,
            meta: {
                page: +page,
                pageSize: +pageSize,
                totalSize: Math.ceil(total / pageSize),
            },
        };
    }
    findAll() {
        return `This action returns all user`;
    }
    findOne(id) {
        return this.userRepo.findOne({
            where: { id },
            select: {
                password: false,
                ...this.userRepo.metadata.ownColumns.reduce((prev, cur) => {
                    prev[cur.propertyName] = true;
                    return prev;
                }, {}),
            },
        });
    }
    async update(id, updateUserDto) {
        const result = await this.userRepo.update(id, updateUserDto);
        if (result.affected === 0)
            throw new common_1.BadRequestException('更新失败');
        return true;
    }
    async remove(id) {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user)
            throw new common_1.BadRequestException('用户不存在');
        const result = await this.userRepo.softRemove({ ...user });
        return !!result;
    }
};
exports.UserService = UserService;
__decorate([
    (0, typeorm_1.InjectRepository)(user_entity_1.User),
    __metadata("design:type", typeorm_2.Repository)
], UserService.prototype, "userRepo", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", redis_service_1.RedisService)
], UserService.prototype, "redisService", void 0);
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        jwt_1.JwtService])
], UserService);
//# sourceMappingURL=user.service.js.map