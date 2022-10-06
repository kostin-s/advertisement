import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { genSalt, hash } from 'bcryptjs';
import { TypeRole } from 'src/auth/auth.interface';
import { Repository } from 'typeorm';

import { UserDto } from './dto/user.dto';
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
      relations: {
        advertisements: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    if (!user) throw new NotFoundException('User not found!');

    return user;
  }

  async getAllUsers() {
    return await this.userRepository.find();
  }

  async updateProfile(id: number, dto: UserDto, updateId: string | number) {
    const availableRoles: TypeRole[] = ['admin', 'moderator', 'user'];
    const roles: TypeRole[] = ['admin', 'moderator'];
    const updateIdNumber = Number(updateId) || null;
    const user = await this.getUserById(id);
    const userUpdate = await this.getUserById(updateIdNumber);

    await this.checkUserExist(dto.email, updateIdNumber);

    if (!roles.includes(user.role) && id !== updateIdNumber) {
      throw new BadRequestException("You can't edit someone else's profile!");
    }

    if (dto.role) {
      if (user.role === 'admin' && availableRoles.includes(dto.role))
        userUpdate.role = dto.role;
      else throw new BadRequestException("You can't edit role");
    }

    if (typeof dto.isVerified === 'boolean') {
      if (roles.includes(user.role)) userUpdate.isVerified = dto.isVerified;
      else throw new BadRequestException("You can't change the verification.");
    }

    if (dto.password) {
      const salt = await genSalt(10);
      userUpdate.password = await hash(dto.password, salt);
    }

    userUpdate.email = dto.email;
    userUpdate.name = dto.name;
    userUpdate.description = dto.description;

    if (dto.avatarPath) userUpdate.avatarPath = dto.avatarPath;
    if (dto.phone) userUpdate.phone = dto.phone;

    const newUser = await this.userRepository.save(userUpdate);

    delete newUser.password;

    return newUser;
  }

  async delete(currentUserId: number, id: string) {
    const deleteId = Number(id) || null;
    const user = await this.getUserById(currentUserId);
    const userDelete = await this.getUserById(deleteId);

    if (!userDelete) {
      throw new BadRequestException('User not found!');
    }

    if (user.role !== 'admin' && user.id !== deleteId) {
      throw new BadRequestException("You can't delete someone else's profile!");
    }

    return this.userRepository.delete({ id: deleteId });
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
}
