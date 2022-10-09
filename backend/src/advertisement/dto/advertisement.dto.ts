import {
  IsBoolean,
  IsNumber,
  IsArray,
  IsString,
  IsOptional,
} from 'class-validator';

export class advertisementSearchDto {
  searchTerm: string;
  categoryId: string;
}

export class advertisementUpdateDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNumber()
  category: number;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsArray()
  images: string[];

  @IsOptional()
  @IsBoolean()
  isPrivate: boolean;

  @IsOptional()
  @IsBoolean()
  isApprove: boolean;

  @IsOptional()
  @IsString()
  videoPath: string;
}
