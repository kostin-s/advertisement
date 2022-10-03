import { IsNumber, IsString } from 'class-validator';

import { Base } from 'src/utils/base';

export class CategoryDto extends Base {
  @IsString()
  title: string;

  @IsNumber()
  parent: number;
}
