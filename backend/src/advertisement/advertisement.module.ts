import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdvertisementService } from './advertisement.service';
import { AdvertisementController } from './advertisement.controller';
import { AdvertisementEntity } from './advertisement.entity';
import { CategoryModule } from 'src/category/category.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [AdvertisementController],
  providers: [AdvertisementService],
  imports: [
    TypeOrmModule.forFeature([AdvertisementEntity]),
    CategoryModule,
    UserModule,
  ],
})
export class AdvertisementModule {}
