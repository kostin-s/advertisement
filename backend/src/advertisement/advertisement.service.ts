import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AdvertisementEntity } from './advertisement.entity';

@Injectable()
export class AdvertisementService {
  constructor(
    @InjectRepository(AdvertisementEntity)
    private readonly userRepository: Repository<AdvertisementEntity>,
  ) {}

  async deleteMany(ids: number[]) {
    await this.userRepository.delete(ids);
  }
}
