import { IsNumber, IsString } from 'class-validator';

export class advertisementCreateDto {
  @IsNumber()
  categoryId: number;
}

export class advertisementSearchDto {
  searchTerm: string;

  categoryId: string;
}
