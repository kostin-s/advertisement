import { IsEmail, IsString } from 'class-validator';

import { TypeRole } from 'src/auth/auth.interface';

export class UserDto {
  @IsEmail()
  email: string;

  password?: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  role?: TypeRole;
  isVerified?: boolean;
  phone?: string;
  avatarPath?: string;
}
