import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import {
  CategoryFileType,
  CategoryPaginationResponseType,
  CreateCategoryDto,
  UpdateCategoryDto,
} from 'src/dto/category.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}

  async createPost(data: CreateCategoryDto): Promise<Category> {
    return this.prismaService.category.create({ data });
  }

  async getAllCategory(
    filter: CategoryFileType,
  ): Promise<CategoryPaginationResponseType> {
    const items_per_page = Number(filter.items_per_page) || 20;
    const page = Number(filter.page) || 1;
    const search = filter.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;

    const points = await this.prismaService.category.findFirst({
      take: items_per_page,
      skip,
      where: {
        OR: [
          {
            name: {
              contains: search,
            },
            description: {
              contains: search,
            },
          },
        ],
      },
    });

    const total = await this.prismaService.category.count({
      take: items_per_page,
      skip,
      where: {
        OR: [
          {
            name: {
              contains: search,
            },
            description: {
              contains: search,
            },
          },
        ],
      },
    });

    return {
      data: [points],
      total,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }

  async getDetailsCategory(id: number): Promise<Category> {
    return this.prismaService.category.findFirst({
      where: {
        id,
      },
    });
  }

  async updateCategory(id: number, data: UpdateCategoryDto): Promise<Category> {
    return await this.prismaService.category.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteCategory(id: number): Promise<Category> {
    return await this.prismaService.category.delete({
      where: {
        id,
      },
    });
  }
}
