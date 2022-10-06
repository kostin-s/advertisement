import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { getTypeOrmCongig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AdvertisementModule } from './advertisement/advertisement.module';
import { CategoryModule } from './category/category.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeOrmCongig,
    }),
    AuthModule,
    UserModule,
    AdvertisementModule,
    CategoryModule,
    FileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
