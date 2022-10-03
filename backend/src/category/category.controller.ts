import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { Auth } from 'src/auth/decoratos/auth.decorator';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';
import { CategoryDeleteDto } from './dto/categoryDelete.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('all')
  async getAllCategories() {
    return this.categoryService.getAll();
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('create')
  @Auth('admin')
  async createCategory(@Body() dto: CategoryDto) {
    return this.categoryService.create(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put('update')
  @Auth('admin')
  async updateCategory(@Body() dto: CategoryDto) {
    return this.categoryService.update(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Delete('delete')
  @Auth('admin')
  async deleteCategories(@Body() dto: CategoryDeleteDto) {
    return this.categoryService.delete(dto.id);
  }
}
