import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

@Injectable()
export class JwtGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID:
        '340731694545-81kbor85epoataljvku33l9q3h3rnbds.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/login/google',
      scope: ['email', 'profile'],
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    return {
      email: profile.emails[0].value,
      sub: profile.displayName,
    };
  }
}
