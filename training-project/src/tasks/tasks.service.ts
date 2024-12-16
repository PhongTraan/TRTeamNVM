import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateTaskDto,
  TakeTaskDto,
  TaskFileType,
  TaskPaginationResponseType,
  UpdateTaskDto,
} from 'src/dto/tasks.dto';
import { PrismaService } from 'src/prisma.service';
import { TasksModule } from './tasks.module';
import { Tasks } from '@prisma/client';
// import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

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

  async updateTask(id: number, data: UpdateTaskDto): Promise<Tasks> {
    return await this.prismaService.tasks.update({
      where: {
        id,
      },
      data,
    });
  }

  async takeTask(id: number, takeTaskDto: TakeTaskDto): Promise<Tasks> {
    const checkTask = await this.prismaService.tasks.findFirst({
      where: { id },
    });
    if (!checkTask) throw new Error('Task already assigned');

    console.log('takeTaskDto.assigneeId', takeTaskDto.assigneeId);

    const updatedTask = await this.prismaService.tasks.update({
      where: { id },
      data: {
        assigneeId: takeTaskDto.assigneeId,
        isAssigned: true,
      },
    });
    return updatedTask;
  }

  async cancelTask(id: number, assigneeId: number): Promise<Tasks> {
    const task = await this.prismaService.tasks.findFirst({
      where: { id },
      select: { assigneeId: true },
    });

    if (!task) throw new Error('Task Not Found');

    if (task.assigneeId !== assigneeId) {
      throw new Error('Only the assignee can cancel this task');
    }
    const updateTask = await this.prismaService.tasks.update({
      where: { id },
      data: {
        assigneeId: null,
        isAssigned: false,
      },
    });

    return updateTask;
  }

  async completeTask(id: number, userId: number) {
    const task = await this.prismaService.tasks.findUnique({
      where: { id },
      select: { assigneeId: true },
    });
    if (!task) {
      throw new Error('Task not found');
    }

    if (task.assigneeId !== userId) {
      throw new Error(
        'Only the assignee or an admin can mark this task as complete',
      );
    }

    const updatedTask = await this.prismaService.tasks.update({
      where: { id },
      data: {
        isCompleted: true,
      },
    });

    return updatedTask;
  }

  async deleteTask(id: number): Promise<Tasks> {
    return await this.prismaService.tasks.delete({
      where: {
        id,
      },
    });
  }
}
