import { IsNumber } from 'class-validator';

export class CategoryDeleteDto {
  @IsNumber()
  id: number;
}
