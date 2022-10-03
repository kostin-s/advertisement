import { IsString } from 'class-validator';

export class refreshTokenDto {
  @IsString({
    message: 'not refresh token',
  })
  refreshToken: string;
}
