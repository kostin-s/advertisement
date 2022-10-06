import { IsString } from 'class-validator';

export class FileDto {
  @IsString()
  fileName: string;

  @IsString()
  folder: string;
}
