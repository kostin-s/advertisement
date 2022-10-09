import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CategoryEntity } from './category.entity';
import { CategoryDto, CategoryUpdateDto } from './dto/category.dto';
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

    if (dto.parent !== 0) {
      await this.checkCategoryExist('id', dto.parent);
    }

    const categoryValues = {
      title: dto.title,
      parent: dto.parent,
    };

    const newCategory = this.categoryRepository.create(categoryValues);
    const category = await this.categoryRepository.save(newCategory);

    return category;
  }

  async update(dto: CategoryUpdateDto) {
    const category = await this.checkCategoryExist('id', dto.id);

    if (dto.parent !== 0) {
      await this.checkCategoryExist('id', dto.parent);
    }

    const oldCategory = await this.categoryRepository.findOne({
      where: {
        title: dto.title,
      },
    });

    if (oldCategory && oldCategory.id !== dto.id) {
      throw new BadRequestException('This category already exists.');
    }

    return this.categoryRepository.save({
      ...category,
      ...dto,
    });
  }

  async delete(id: number) {
    await this.checkCategoryExist('id', id);

    const deleteIds = await this.getSubcategories(id);
    deleteIds.unshift(id);

    return this.categoryRepository.delete(deleteIds);
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
