import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CategoryEntity } from './category.entity';
import { CategoryDto } from './dto/category.dto';
import { idSubcategories, transformCategories } from 'src/utils/fn/categories';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(dto: CategoryDto) {
    const oldCategory = await this.categoryRepository.findOne({
      where: {
        title: dto.title,
      },
    });

    if (oldCategory) {
      throw new BadRequestException('This category already exists.');
    }

    const parentCategory = await this.categoryRepository.findOne({
      where: {
        id: dto.parent,
      },
    });

    if (!parentCategory && dto.parent !== 0) {
      throw new BadRequestException('This parent category not found.');
    }

    const categoryValues = {
      title: dto.title,
      parent: dto.parent,
    };

    const newCategory = this.categoryRepository.create(categoryValues);
    const category = await this.categoryRepository.save(newCategory);

    return category;
  }

  async update(dto: CategoryDto) {
    const category = await this.checkCategoryExist('id', dto.id);

    return this.categoryRepository.save({
      ...category,
      ...dto,
    });
  }

  async delete(id: number) {
    await this.checkCategoryExist('id', id);

    const deleteIds = await this.getSubcategories(id);

    return this.categoryRepository.delete(deleteIds.unshift(id));
  }

  async checkCategoryExist(check: string, trigger: string | number) {
    const category = await this.categoryRepository.findOne({
      where: {
        [check]: trigger,
      },
    });

    if (!category) {
      throw new BadRequestException('This category not found.');
    }

    return category;
  }

  async getAll() {
    const categories = await this.categoryRepository.find();

    return transformCategories(categories);
  }

  async getSubcategories(id: number) {
    const allCategories = await this.categoryRepository.find();

    return [...idSubcategories(allCategories, id)];
  }
}
