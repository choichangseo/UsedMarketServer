import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findOne({ email }) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async createUser({ email, hashedPassword: password, name, age }) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (user) throw new ConflictException('이미 등록된 이메일 입니다.');
    const result = await this.userRepository.save({
      email,
      password,
      name,
      age,
    });
    return result.email;
  }
}
