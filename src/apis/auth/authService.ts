import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  getAccessToken({ email, name, id }) {
    return this.jwtService.sign(
      { email, sub: name, id },
      { secret: 'myAccessKey', expiresIn: '1h' },
    );
  }
  setRefreshToken({ id, email, name, res }) {
    const refreshToken = this.jwtService.sign(
      { id, email, sub: name },
      { secret: 'myRefreshKey', expiresIn: '2w' },
    );
    // 개발환경
    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}`);

    // 배포환경
    // res.setHeader('Set-Cookie', `refreshToken=${refreshToken}`; path=/; domain=.mybacksite.com; SameSite=None; Secure; httpOnly;);
  }
}
