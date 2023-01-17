import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAccessStrategy } from 'src/commons/auth/jwt-access.strategy';
import { User } from './entities/user.entity';
import { UserController } from './userController';
import { UserService } from './userService';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [JwtAccessStrategy, UserService],
})
export class UserModule {}
