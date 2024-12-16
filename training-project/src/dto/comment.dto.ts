import { Comment } from '@prisma/client';

export class CreateCommentDto {
  message: string;
  userId: number;
}

export interface CommentFileType {
  items_per_page?: string;
  page?: string;
  search?: string;
}

export interface CommentPaginationResponseType {
  data: Comment[];
  total: number;
  currentPage: number;
  itemsPerPage: number;
}

export class UpdateComment {
  message: string;
  userId: number;
}
