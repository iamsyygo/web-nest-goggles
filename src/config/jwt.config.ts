// export const jwtUseFactory
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export const JwtUseFactory = (configService: ConfigService): JwtModuleOptions => {
  const jwtConfig = configService.get('jwt', {
    secret: '',
    signOptions: { expiresIn: '1d' },
  }) as AppYamlConfig['jwt'] as JwtModuleOptions;
  return {
    secret: jwtConfig.secret,
    signOptions: {
      expiresIn: jwtConfig.signOptions.expiresIn,
    },
  };
};

// 身份认证策列，配合passport guard使用
@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const jwtConfig = configService.get('jwt', {
      secret: '',
      signOptions: { expiresIn: '1d' },
    }) as AppYamlConfig['jwt'] as JwtModuleOptions;
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret,
    });
  }
  // 此方法在令牌验证后调用,passeport自动解码JWT并将其作为参数传递给此方法
  async validate(payload: any) {
    return payload;
  }
}
