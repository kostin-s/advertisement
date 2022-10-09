import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { Auth } from 'src/auth/decoratos/auth.decorator';
import { CurrentUser } from './decorators/user.decorator';
import { UserDto } from './dto/user.dto';
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
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.getUserById(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put('update/:id')
  @Auth()
  async updateUser(
    @CurrentUser('id') currentUserId: number,
    @Param('id', ParseIntPipe) updateId: number,
    @Body() dto: UserDto,
  ) {
    return this.userService.updateProfile(currentUserId, dto, updateId);
  }

  @UsePipes(new ValidationPipe())
  @Delete('delete/:id')
  @HttpCode(200)
  @Auth()
  async deleteUser(
    @CurrentUser('id') currentUserId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.delete(currentUserId, id);
  }

  @Get('all')
  @Auth('admin', 'moderator')
  async getUsers() {
    return this.userService.getAllUsers();
  }
}
