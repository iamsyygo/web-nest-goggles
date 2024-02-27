import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
export declare const getNetworkInterfaceName: () => any;
export declare const parseErrorMessage: (errorMessage: string) => {
    type: string;
    message: string;
    location: {
        method: string;
        filePath: string;
        position: string;
        column: string;
    };
};
type SelectFields<T extends EntityClassOrSchema> = `!${keyof T & string}`[] | (keyof T)[];
export declare function getSelect<T extends EntityClassOrSchema>(entity: T, fields: SelectFields<T>): void;
export {};
