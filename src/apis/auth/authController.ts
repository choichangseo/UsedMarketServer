import {
  Body,
  Controller,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserService } from '../users/userService';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from './dto/login-dto';
import { AuthService } from './authService';

@Controller('login')
export class AuthController {
  //   constructor(private readonly authService: AuthService) {}
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
  @Post()
  async login(@Body() loginData: LoginDTO) {
    const { email, password } = loginData;
    // 1. 로그인(이메일과 비밀번호 일치하는 유저 찾기)
    const user = await this.userService.findOne({ email });

    // 2. 일치하는 유저가 없으면 에러 던지기
    if (!user)
      throw new UnprocessableEntityException('존재하지 않는 이메일입니다.');

    // 3. 일치하는 유저가 있지만, 암호가 틀렸다면 에러 던지기
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) throw new UnprocessableEntityException('암호가 틀렸습니다.');

    // 4. 일치하는 유저가 있으면 accessToken 만들어서 프론트 엔드에 던져주기
    return this.authService.getAccessToken({ email, name: user.name });
  }
}
