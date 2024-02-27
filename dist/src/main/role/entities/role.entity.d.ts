import { DataStatusEnum } from '../../../types/enum';
import { Permission } from '../../permission/entities/permission.entity';
export declare class Role {
    id: number;
    createDate: Date;
    updateDate: Date;
    status: DataStatusEnum;
    deleteDate: Date;
    name: string;
    permissions: Permission[];
}
