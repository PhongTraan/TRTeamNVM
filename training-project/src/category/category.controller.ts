import { Body, Controller, Get, Post } from '@nestjs/common';
import { Category } from '@prisma/client';
import { CreateCategoryDto } from 'src/dto/category.dto';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  createCategory(@Body() data: CreateCategoryDto): Promise<Category> {
    return this.categoryService.createPost(data);
  }

 
}
