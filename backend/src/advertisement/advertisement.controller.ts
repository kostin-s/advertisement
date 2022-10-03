import { Controller } from '@nestjs/common';

import { AdvertisementService } from './advertisement.service';

@Controller('advertisement')
export class AdvertisementController {
  constructor(private readonly advertisementService: AdvertisementService) {}
}
