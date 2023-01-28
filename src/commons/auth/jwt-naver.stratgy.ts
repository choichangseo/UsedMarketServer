import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-naver-v2';

@Injectable()
export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: 'CL1u0tU8hFCG7jT3hQzi',
      clientSecret: process.env.NAVER_SECRET,
      callbackURL: process.env.NAVER_CALLBACK,
      scope: ['email', 'name', 'birthyear', 'name', 'age'],
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    return {
      email: profile.email,
      sub: profile.name,
    };
  }
}
