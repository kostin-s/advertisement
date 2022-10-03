import { Column, Entity } from 'typeorm';

import { Base } from 'src/utils/base';

@Entity('Advertisement')
export class AdvertisementEntity extends Base {
  @Column()
  title: string;

  @Column({ default: '', type: 'text' })
  description: string;

  @Column()
  price: number;

  @Column()
  images: string[];

  @Column()
  categoties: string[];
}
