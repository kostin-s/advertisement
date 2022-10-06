import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import { Auth } from 'src/auth/decoratos/auth.decorator';
import { CurrentUser } from 'src/user/decorators/user.decorator';

import { AdvertisementService } from './advertisement.service';
import {
  advertisementCreateDto,
  advertisementSearchDto,
} from './dto/advertisement.dto';

@Controller('advertisement')
export class AdvertisementController {
  constructor(private readonly advertisementService: AdvertisementService) {}

  @Get('get-private/:id')
  @Auth()
  async getAdvertisementPrivate(
    @Param('id') id: string,
    @CurrentUser('id') userId: number,
  ) {
    return this.advertisementService.byId(+id, false, userId);
  }

  @Get('get-one/:id')
  async getAdvertisementPublic(@Param('id') id: string) {
    return this.advertisementService.byId(+id, true);
  }

  @Get('get-all')
  async getAllPublic(@Query() query: advertisementSearchDto) {
    return this.advertisementService.getAll(query);
  }

  @Get('get-all/private')
  @Auth('admin', 'moderator')
  async getAllPrivate(@Query() query: advertisementSearchDto) {
    return this.advertisementService.getAll(query, false);
  }

  @HttpCode(200)
  @Post('create')
  @Auth()
  async createAdvertisement(
    @CurrentUser('id') id: number,
    @Body() dto: advertisementCreateDto,
  ) {
    return this.advertisementService.create(id, dto.categoryId);
  }
}
