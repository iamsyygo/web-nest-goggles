import { DataStatusEnum } from '../../../types/enum';
export declare class BlobUpload {
    id: number;
    createDate: Date;
    updateDate: Date;
    status: DataStatusEnum;
    deleteDate: Date;
    fileName: string;
    url: string;
    downloadUrl: string;
    pathname: string;
    contentType: string;
    contentDisposition: string;
    size: number;
}
