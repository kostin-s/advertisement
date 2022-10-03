import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare, genSalt, hash } from 'bcryptjs';

import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';
import { refreshTokenDto } from './dto/refreshToken.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async register(dto: AuthDto) {
    await this.userService.checkUserExist(dto.email);

    const salt = await genSalt(10);
    const password = await hash(dto.password, salt);

    const newUser = await this.userRepository.create({
      email: dto.email,
      password,
    });

    const user = await this.userRepository.save(newUser);
    const tokens = await this.issueTokenPair(user.id);

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);

    const tokens = await this.issueTokenPair(user.id);

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async validateUser(dto: AuthDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: dto.email,
      },
      select: ['id', 'email', 'password'],
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const isValidPassword = await compare(dto.password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid username or password!');
    }

    return user;
  }

  async issueTokenPair(userId: number) {
    const data = { id: userId };

    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn: '15d',
    });

    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: '1h',
    });

    return {
      refreshToken,
      accessToken,
    };
  }

  async getNewTokens({ refreshToken }: refreshTokenDto) {
    let result: { id: number };

    if (!refreshToken) {
      throw new UnauthorizedException('Please sign in!');
    }

    try {
      result = await this.jwtService.verifyAsync(refreshToken);
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }

    if (!result) {
      throw new UnauthorizedException('Invalid token or expired');
    }

    const user = await this.userRepository.findOneBy({ id: result.id });

    const tokens = await this.issueTokenPair(user.id);

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  returnUserFields(user: UserEntity) {
    return {
      id: user.id,
      email: user.email,
    };
  }
}
