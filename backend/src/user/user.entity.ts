import { Column, Entity } from 'typeorm';

import { Base } from 'src/utils/base';

@Entity('User')
export class UserEntity extends Base {
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ default: '' })
  name: string;

  @Column({ default: false, name: 'is_verified' })
  isVerified: boolean;

  @Column({ default: '', type: 'text' })
  description: string;

  @Column({ default: '', name: 'avatar_path' })
  avatarPath: string;
}
