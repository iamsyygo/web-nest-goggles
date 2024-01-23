// export const jwtUseFactory
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

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
