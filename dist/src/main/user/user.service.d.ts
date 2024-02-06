import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PageQueryDto } from './dto/query-user.dto';
export declare class UserService {
    private readonly configService;
    private jwtService;
    private readonly userRepo;
    constructor(configService: ConfigService, jwtService: JwtService);
    create(createUserDto: CreateUserDto): Promise<boolean>;
    login(loginUserDto: CreateUserDto, req: Request): Promise<{
        authorization: string;
        user: User;
    }>;
    findList({ page, pageSize }: PageQueryDto): Promise<{
        list: User[];
        total: number;
        meta: {
            page: number;
            pageSize: number;
            totalSize: number;
        };
    }>;
    findAll(): string;
    findOne(id: number): Promise<User>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<boolean>;
    remove(id: number): Promise<boolean>;
}
