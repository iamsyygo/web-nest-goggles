import { DataSexEnum, DataStatusEnum } from '../../../types/enum';
import { Role } from '../../role/entities/role.entity';
export declare class User {
    id: number;
    createDate: Date;
    updateDate: Date;
    status: DataStatusEnum;
    deleteDate: Date;
    gender: DataSexEnum;
    username: string;
    password: string;
    email: string;
    phoneNumber: string;
    bio: string;
    avatar: string;
    socialLinks: string;
    lastLoginIp: string;
    lastLoginDate: Date;
    roles: Role[];
}
