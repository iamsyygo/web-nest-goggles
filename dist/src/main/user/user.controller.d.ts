import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { PageQueryDto } from './dto/query-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<boolean>;
    login(loginUserDto: CreateUserDto, req: any): Promise<{
        authorization: string;
        user: import("./entities/user.entity").User;
    }>;
    findAll(): string;
    findList(pageQueryDto: PageQueryDto): Promise<{
        list: import("./entities/user.entity").User[];
        total: number;
        meta: {
            page: number;
            pageSize: number;
            totalSize: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/user.entity").User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<boolean>;
    remove(id: string): Promise<boolean>;
}
