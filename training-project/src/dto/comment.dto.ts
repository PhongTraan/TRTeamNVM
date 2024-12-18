import { Comment } from '@prisma/client';

export class CreateCommentDto {
  message: string;
  userId: number;
  taskId: number;
}

export interface CommentFileType {
  items_per_page?: string;
  page?: number;
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
