import { User } from '../entities/user.entity';
declare const UpdateUserDto_base: import("@nestjs/common").Type<Partial<Omit<User, "password" | "createDate" | "updateDate" | "lastLoginIp" | "lastLoginDate">>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
}
export {};
