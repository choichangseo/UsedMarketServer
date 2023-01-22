import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-naver-v2';

@Injectable()
export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: 'CL1u0tU8hFCG7jT3hQzi',
      clientSecret: 'K0mT1e8prS',
      callbackURL: 'http://localhost:3000/login/naver',
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
