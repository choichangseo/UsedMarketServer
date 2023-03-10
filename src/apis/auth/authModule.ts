import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../users/userService';
import { AuthController } from './authController';
import { AuthService } from './authService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { JwtRefreshStrategy } from 'src/commons/auth/jwt-refresh.strategy';
import { JwtGoogleStrategy } from 'src/commons/auth/jwt-google.stratgy';
import { JwtNaverStrategy } from 'src/commons/auth/jwt-naver.stratgy';
import { JwtKakaoStrategy } from 'src/commons/auth/jwt-kakao.stratgy';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    JwtRefreshStrategy,
    JwtGoogleStrategy,
    JwtNaverStrategy,
    JwtKakaoStrategy,
  ],
})
export class AuthModule {}
