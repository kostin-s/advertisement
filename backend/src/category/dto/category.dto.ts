import { IsNumber, IsString } from 'class-validator';

export class CategoryDto {
  @IsString()
  title: string;

  @IsNumber()
  parent: number;
}

export class CategoryUpdateDto extends CategoryDto {
  @IsNumber()
  id: number;
}
