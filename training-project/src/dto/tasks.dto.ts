import { Tasks } from '@prisma/client';

export class CreateTaskDto {
  title: string;
  description: string;
  creatorId: number;
  assigneeId?: number;
}

export class TaskFileType {
  items_per_page?: string;
  page?: string;
  search?: string;
}

export class TaskPaginationResponseType {
  data: Tasks[];
  total: number;
  currentPage: number;
  itemsPerPage: number;
}

export class UpdateTaskDto {
  title?: string;
  description?: string;
  isCompleted?: boolean;
  isActive?: boolean;
}

export class TakeTaskDto {
  assigneeId: number;
  isAssigned: boolean;
}
