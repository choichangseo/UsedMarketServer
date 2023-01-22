import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';

@Injectable()
export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: 'd0033c910beac566d51c882eadf1f9bc',
      callbackURL: 'http://localhost:3000/login/kakao',
      clientSecret: 'HshiqR1YgsisgikpMEGIQALteRR8t7Cj',
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    return {
      email: profile._json.kakao_account.email,
      sub: profile.username,
    };
  }
}
