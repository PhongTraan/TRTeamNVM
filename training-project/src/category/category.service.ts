import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import {
  CategoryFileType,
  CategoryPaginationResponseType,
  CreateCategoryDto,
  UpdateCategoryDto,
} from 'src/dto/category.dto';
import { PrismaService } from 'src/prisma.service';
import { CategoryRepository } from './category.repository';

@Injectable()
export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async createPost(data: CreateCategoryDto): Promise<Category> {
    return await this.categoryRepository.createCategory(data);
  }

  async getAllCategory(
    filter: CategoryFileType,
  ): Promise<CategoryPaginationResponseType> {
    const items_per_page = Number(filter.items_per_page) || 20;
    const page = Number(filter.page) || 1;
    const search = filter.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;

    const data = await this.categoryRepository.findCategories(
      search,
      skip,
      items_per_page,
    );

    const total = await this.categoryRepository.countCategories(search);

    return {
      data,
      total,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }

  async getDetailsCategory(id: number): Promise<Category> {
    return await this.categoryRepository.findBuyIdCategory(id);
  }

  async updateCategory(id: number, data: UpdateCategoryDto): Promise<Category> {
    return await this.categoryRepository.updateCategory(id, data);
  }

  async deleteCategory(id: number): Promise<Category> {
    return await this.categoryRepository.deleteBuyIdCategory(id);
  }
}
