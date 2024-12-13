import { Post } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  summary: string;

  @IsNotEmpty()
  content: string;

  status: number;

  @IsNotEmpty()
  ownerId: number;

  @IsNotEmpty()
  categoryId: number;
}

export interface PostFileType {
  items_per_page?: string;
  page?: string;
  search?: string;
}

export interface PostPaginationResponseType {
  data: Post[];
  total: number;
  currentPage: number;
  itemsPerPage: number;
}

export class updatePostDto {
  type: string;
  summary: string;
  content: string;
}
