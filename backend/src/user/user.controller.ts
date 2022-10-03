import { Controller, Get, Param } from '@nestjs/common';

import { Auth } from 'src/auth/decoratos/auth.decorator';
import { CurrentUser } from './decorators/user.decorator';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Auth()
  async getProfile(@CurrentUser('id') id: number) {
    return await this.userService.getUserById(id);
  }

  @Get('by-id/:id')
  async getuser(@Param('id') id: string) {
    return await this.userService.getUserById(+id);
  }
}
