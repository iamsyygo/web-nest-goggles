import { ExecutionContext } from '@nestjs/common';
declare const AppJwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class AppJwtAuthGuard extends AppJwtAuthGuard_base {
    private readonly reflector;
    getRequest(context: ExecutionContext): any;
    handleRequest(err: any, user: any, info: any, context: ExecutionContext): any;
}
export {};
