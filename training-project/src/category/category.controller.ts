import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Category } from '@prisma/client';
import {
  CategoryFileType,
  CategoryPaginationResponseType,
  CreateCategoryDto,
  UpdateCategoryDto,
} from 'src/dto/category.dto';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  createCategory(@Body() data: CreateCategoryDto): Promise<Category> {
    return this.categoryService.createPost(data);
  }

  @Get()
  getAllCategory(
    @Query() param: CategoryFileType,
  ): Promise<CategoryPaginationResponseType> {
    return this.categoryService.getAllCategory(param);
  }

  @Get(':id')
  getDetailsCategory(@Query('id', ParseIntPipe) id: number): Promise<Category> {
    return this.categoryService.getDetailsCategory(id);
  }

  @Put(':id')
  updateCategory(
    @Query(':id', ParseIntPipe) id: number,
    @Body() data: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.updateCategory(id, data);
  }

  @Delete(':id')
  deleteCategory(@Query('id', ParseIntPipe) id: number) {
    return this.categoryService.deleteCategory(id);
  }
}
