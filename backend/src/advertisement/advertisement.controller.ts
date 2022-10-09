import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { Auth } from 'src/auth/decoratos/auth.decorator';
import { CurrentUser } from 'src/user/decorators/user.decorator';

import { AdvertisementService } from './advertisement.service';
import {
  advertisementSearchDto,
  advertisementUpdateDto,
} from './dto/advertisement.dto';

@Controller('advertisement')
export class AdvertisementController {
  constructor(private readonly advertisementService: AdvertisementService) {}

  @UsePipes(new ValidationPipe())
  @Get('get-private/:id')
  @Auth()
  async getAdvertisementPrivate(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.advertisementService.byId(id, false, userId);
  }

  @UsePipes(new ValidationPipe())
  @Get('get-one/:id')
  async getAdvertisementPublic(@Param('id', ParseIntPipe) id: number) {
    return this.advertisementService.byId(id, true);
  }

  @UsePipes(new ValidationPipe())
  @Get('get-all')
  async getAllPublic(@Query() query: advertisementSearchDto) {
    return this.advertisementService.getAll(query);
  }

  @UsePipes(new ValidationPipe())
  @Get('get-all/private')
  @Auth('admin', 'moderator')
  async getAllPrivate(@Query() query: advertisementSearchDto) {
    return this.advertisementService.getAll(query, false);
  }

  @UsePipes(new ValidationPipe())
  @Post('create')
  @HttpCode(200)
  @Auth()
  async createAdvertisement(@CurrentUser('id') id: number) {
    return this.advertisementService.create(id);
  }

  @UsePipes(new ValidationPipe())
  @Put('update/:id')
  @HttpCode(200)
  @Auth()
  async updateAdvertisement(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
    @Body() dto: advertisementUpdateDto,
  ) {
    return this.advertisementService.update(id, dto, userId);
  }

  @UsePipes(new ValidationPipe())
  @Delete('delete/:id')
  @HttpCode(200)
  @Auth()
  async deleteAdvertisement(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.advertisementService.delete(id, userId);
  }
}
