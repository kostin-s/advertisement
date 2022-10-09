import {
  IsEmail,
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
} from 'class-validator';

import { TypeRole, RoleTypesEnum } from 'src/auth/auth.interface';

export class UserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(RoleTypesEnum, { message: 'Role must be a valid value' })
  role: TypeRole;

  @IsOptional()
  @IsBoolean()
  isVerified: boolean;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  avatarPath: string;
}
