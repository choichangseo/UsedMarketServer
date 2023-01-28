import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthUser } from '../type/type';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'userGuard') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'myAccessKey',
    });
  }
  async validate(payload: AuthUser) {
    return {
      id: payload.id,
      email: payload.email,
      sub: payload.sub,
    };
  }
}
