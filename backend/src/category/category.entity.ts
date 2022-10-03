import { Column, Entity } from 'typeorm';

import { Base } from 'src/utils/base';

@Entity('Category')
export class CategoryEntity extends Base {
  @Column({ unique: true })
  title: string;

  @Column()
  parent: number;
}
