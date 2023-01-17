import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  getAccessToken({ email, name }) {
    return this.jwtService.sign(
      { email, sub: name },
      { secret: 'myAccessKey', expiresIn: '1h' },
    );
  }
}
