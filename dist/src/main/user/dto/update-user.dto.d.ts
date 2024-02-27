import { User } from '../entities/user.entity';
declare const UpdateUserDto_base: import("@nestjs/common").Type<Partial<Omit<User, "createDate" | "updateDate" | "password" | "lastLoginIp" | "lastLoginDate">>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
}
export {};
