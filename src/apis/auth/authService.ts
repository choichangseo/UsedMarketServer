import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  getAccessToken({ email, name }) {
    return this.jwtService.sign(
      { email, sub: name },
      { secret: 'myAccessKey', expiresIn: '10m' },
    );
  }
  setRefreshToken({ email, name, res }) {
    const refreshToken = this.jwtService.sign(
      { email, sub: name },
      { secret: 'myRefreshKey', expiresIn: '2w' },
    );
    // 개발환경
    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}`);

    // 배포환경
    // res.setHeader('Set-Cookie', `refreshToken=${refreshToken}`; path=/; domain=.mybacksite.com; SameSite=None; Secure; httpOnly;);
  }
}
