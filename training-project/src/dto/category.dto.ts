import { Category } from '@prisma/client';

export class CreateCategoryDto {
  name: string;
  description: string;
}

export interface CategoryFileType {
  items_per_page?: string;
  page?: string;
  search?: string;
}

export interface CategoryPaginationResponseType {
  data: Category[];
  total: number;
  currentPage: number;
  itemsPerPage: number;
}

export class UpdateCategoryDto {
  name: string;
  description: string;
}
