import { Column, Entity, OneToMany } from 'typeorm';

import { Base } from 'src/utils/base';
import { AdvertisementEntity } from 'src/advertisement/advertisement.entity';
import { TypeRole } from 'src/auth/auth.interface';

@Entity('User')
export class UserEntity extends Base {
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: 'user' })
  role: TypeRole;

  @Column({ default: '' })
  name: string;

  @Column({ default: false, name: 'is_verified' })
  isVerified: boolean;

  @Column({ default: '', type: 'text' })
  description: string;

  @Column({ default: '' })
  phone: string;

  @Column({ default: '', name: 'avatar_path' })
  avatarPath: string;

  @OneToMany(() => AdvertisementEntity, ads => ads.user)
  advertisements: AdvertisementEntity[];
}
