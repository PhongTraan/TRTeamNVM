import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { CreateCategoryDto } from 'src/dto/category.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}

  async createPost(data: CreateCategoryDto): Promise<Category> {
    return this.prismaService.category.create({ data });
  }
}
