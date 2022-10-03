import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException('User not found!');

    return user;
  }

  async checkUserExist(email: string, id?: number) {
    const oldUser = await this.userRepository.findOneBy({ email });
    const isEqualsId = oldUser?.id !== id;

    if (oldUser && isEqualsId) {
      throw new BadRequestException(
        'User with this email already exists in the system',
      );
    }

    return oldUser;
  }

  async checkExistUserById(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (user) {
      return true;
    }

    return false;
  }
}
