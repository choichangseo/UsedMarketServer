import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AuthUser } from '../type/type';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        const refreshToken = req.headers.cookie.replace('refreshToken=', '');
        // req.headers.cookie에 있는 refreshToken 골라내기
        return refreshToken;
      },
      secretOrKey: 'myRefreshKey',
    });
  }
  async validate(payload: AuthUser) {
    return {
      email: payload.email,
      sub: payload.sub,
    };
  }
}
