import { Injectable } from '@nestjs/common';
import {
  CreateTaskDto,
  TaskFileType,
  TaskPaginationResponseType,
  UpdateTaskDto,
} from 'src/dto/tasks.dto';
import { PrismaService } from 'src/prisma.service';
import { TasksModule } from './tasks.module';
import { Tasks } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prismaService: PrismaService) {}

  async createTask(data: CreateTaskDto): Promise<TasksModule> {
    return await this.prismaService.tasks.create({ data });
  }

  async getAllTasks(filter: TaskFileType): Promise<TaskPaginationResponseType> {
    const items_per_page = Number(filter.items_per_page) || 20;
    const page = Number(filter.page) || 1;
    const search = filter.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;

    const tasks = await this.prismaService.tasks.findMany({
      take: items_per_page,
      skip,
      where: {
        OR: [
          {
            title: {
              contains: search,
              mode: 'insensitive',
            },
            description: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = await this.prismaService.tasks.count({
      take: items_per_page,
      skip,
      where: {
        OR: [
          {
            title: {
              contains: search,
              mode: 'insensitive',
            },
            description: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      data: tasks,
      total,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }

  async getDetailsTask(id: number): Promise<Tasks> {
    return await this.prismaService.tasks.findFirst({
      where: {
        id,
      },
    });
  }

  async updateTask(id: number, data: UpdateTaskDto) {
    return await this.prismaService.tasks.update({
      where: {
        id,
      },
      data,
    });
  }

  // async takeTask()

  async deleteTask(id: number): Promise<Tasks> {
    return await this.prismaService.tasks.delete({
      where: {
        id,
      },
    });
  }
}
