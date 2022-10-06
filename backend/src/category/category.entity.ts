import { Column, Entity, OneToMany } from 'typeorm';

import { Base } from 'src/utils/base';
import { AdvertisementEntity } from 'src/advertisement/advertisement.entity';

@Entity('Category')
export class CategoryEntity extends Base {
  @Column({ unique: true })
  title: string;

  @Column()
  parent: number;

  @OneToMany(() => AdvertisementEntity, ads => ads.category)
  advertisements: AdvertisementEntity[];
}
