import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';
import { AuthService } from './auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private authService: AuthService,
    @Inject() configService: ConfigService,
  ) {
    const githubConfig = configService.get('github') as AppYamlConfig['github'];
    super({
      clientID: githubConfig.client_id,
      clientSecret: githubConfig.client_secret,
      callbackURL: '/api/auth/callback',
      scope: [githubConfig.scope],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    // validate user exists in db

    return profile;
  }
}
