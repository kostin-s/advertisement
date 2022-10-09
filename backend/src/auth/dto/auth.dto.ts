import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsEmail()
  email: string;

  @MinLength(3, {
    message: "Password can't be less than 3 characters!",
  })
  @IsString()
  password: string;
}

export class AuthRegisterDto extends AuthDto {
  @IsString()
  name: string;
}
