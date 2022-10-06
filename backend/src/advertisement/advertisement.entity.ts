import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';

import { Base } from 'src/utils/base';
import { UserEntity } from 'src/user/user.entity';
import { CategoryEntity } from 'src/category/category.entity';

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

  @Column({ default: true, name: 'is_private' })
  isPrivate: boolean;

  @Column({ default: false, name: 'is_approve' })
  isApprove: boolean;

  @ManyToOne(() => UserEntity, user => user.advertisements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => CategoryEntity, category => category.advertisements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;
}
