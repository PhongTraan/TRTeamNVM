import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { CreateCategoryDto, UpdateCategoryDto } from 'src/dto/category.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CategoryRepository {
  constructor(private prismaService: PrismaService) {}

  async createCategory(data: CreateCategoryDto): Promise<Category> {
    return await this.prismaService.category.create({ data });
  }

  //"Find  Cate"
  async findCategories(search: string, skip: number, itemsPerPage: number) {
    return this.prismaService.category.findMany({
      take: itemsPerPage,
      skip,
      where: {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  //Count Cate
  async countCategories(search: string) {
    return this.prismaService.category.count({
      where: {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findBuyIdCategory(id: number): Promise<Category> {
    return await this.prismaService.category.findFirst({
      where: { id },
    });
  }

  async updateCategory(id: number, data: UpdateCategoryDto): Promise<Category> {
    return await this.prismaService.category.update({
      where: { id },
      data,
    });
  }

  async deleteBuyIdCategory(id: number): Promise<Category> {
    return await this.prismaService.category.delete({
      where: { id },
    });
  }
}
