import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../users/userService';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from './dto/login-dto';
import { AuthService } from './authService';
import { CurrentUser } from 'src/commons/auth/rest-user.param';
import { AuthUser } from 'src/commons/type/type';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { UserDTO } from '../users/dto/create-user.dto';

@Controller('/')
export class AuthController {
  //   constructor(private readonly authService: AuthService) {}
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
  @Post('/login')
  async login(@Body() loginData: LoginDTO, @Res() res: Response) {
    const { email, password } = loginData;
    // 1. 로그인(이메일과 비밀번호 일치하는 유저 찾기)
    const user = await this.userService.findOne({ email });

    // 2. 일치하는 유저가 없으면 에러 던지기
    if (!user)
      throw new UnprocessableEntityException('존재하지 않는 이메일입니다.');

    // 3. 일치하는 유저가 있지만, 암호가 틀렸다면 에러 던지기
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) throw new UnprocessableEntityException('암호가 틀렸습니다.');

    // 4. refreshToken 발급받아서 프론트엔드 쿠키에 보내주기
    this.authService.setRefreshToken({ email, name: user.name, res });

    // 5. 일치하는 유저가 있으면 accessToken 만들어서 프론트 엔드에 던져주기
    return this.authService.getAccessToken({ email, name: user.name });
  }

  @Get('/login/google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(
    @CurrentUser() currentUser: AuthUser,
    @Res() res: Response,
  ) {
    let tempUser = await this.userService.findOne({ email: currentUser.email });
    if (!tempUser) {
      tempUser = await this.userService.createUser({
        email: currentUser.email,
        hashedPassword: '111111',
        name: currentUser.sub,
        age: 20,
      });
    }
    this.authService.setRefreshToken({
      email: tempUser.email,
      name: tempUser.name,
      res,
    });
    res.redirect('http://127.0.0.1:5500/front/index.html');
  }

  @Get('/login/naver')
  @UseGuards(AuthGuard('naver'))
  async naverLogin(@CurrentUser() currentUser: AuthUser, @Res() res: Response) {
    let tempUser = await this.userService.findOne({ email: currentUser.email });
    if (!tempUser) {
      tempUser = await this.userService.createUser({
        email: currentUser.email,
        hashedPassword: '111111',
        name: currentUser.sub,
        age: 20,
      });
    }
    this.authService.setRefreshToken({
      email: tempUser.email,
      name: tempUser.name,
      res,
    });
    res.redirect('http://127.0.0.1:5500/front/index.html');
  }

  @Get('/login/kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin(@CurrentUser() currentUser: AuthUser, @Res() res: Response) {
    let tempUser = await this.userService.findOne({ email: currentUser.email });
    if (!tempUser) {
      tempUser = await this.userService.createUser({
        email: currentUser.email,
        hashedPassword: '111111',
        name: currentUser.sub,
        age: 20,
      });
    }
    this.authService.setRefreshToken({
      email: tempUser.email,
      name: tempUser.name,
      res,
    });
    res.redirect('http://127.0.0.1:5500/front/index.html');
  }

  @UseGuards(AuthGuard('refresh'))
  @Get('/restore')
  restoreAccessToken(@CurrentUser() currentUser: AuthUser) {
    return this.authService.getAccessToken({
      email: currentUser.email,
      name: currentUser.sub,
    });
  }
}
