import { Bind, Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserDTO } from './dto/create-user.dto';
import { UserService } from './userService';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/commons/auth/rest-user.param';
import { AuthUser } from 'src/commons/type/type';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('userGuard'))
  @Get()
  async getUser(@CurrentUser() currentUser: AuthUser) {
    const { email, sub } = currentUser;
    const user = await this.userService.findOne({ email });
    const { password, ...rest } = user;
    return rest;
  }

  @Post()
  async createUser(@Body() signUpData: UserDTO) {
    const { email, password, name, age } = signUpData;
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userService.createUser({
      email,
      hashedPassword,
      name,
      age,
    });
  }
}
