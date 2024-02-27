import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { Strategy } from 'passport-jwt';
export declare const JwtUseFactory: (configService: ConfigService) => JwtModuleOptions;
declare const JwtAuthStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtAuthStrategy extends JwtAuthStrategy_base {
    private readonly configService;
    constructor(configService: ConfigService);
    validate(payload: any): Promise<any>;
}
export {};
