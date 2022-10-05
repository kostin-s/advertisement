import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';

import { Base } from 'src/utils/base';
import { UserEntity } from 'src/user/user.entity';

@Entity('Advertisement')
export class AdvertisementEntity extends Base {
  @Column()
  title: string;

  @Column({ default: '', type: 'text' })
  description: string;

  @Column()
  price: number;

  @Column()
  videoPath: string;

  @ManyToOne(() => UserEntity, user => user.advertisements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  userId: UserEntity;
}
