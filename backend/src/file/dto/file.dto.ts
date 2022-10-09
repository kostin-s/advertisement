import { IsOptional, IsString } from 'class-validator';

export class FileDto {
  @IsString()
  folder: string;
}

export class FileDeleteDto {
  @IsString()
  fileName: string;

  @IsOptional()
  @IsString()
  folder: string;
}
