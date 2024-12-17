import { TaskRepository } from './tasks.repository';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  constructor(
    private prismaService: PrismaService,
    private taskRepository: TaskRepository,
  ) {}

  async createTask(data: CreateTaskDto): Promise<Tasks> {
    return await this.taskRepository.createTask(data);
  }

  async getAllTasks(filter: TaskFileType): Promise<TaskPaginationResponseType> {
    const items_per_page = Number(filter.items_per_page) || 20;
    const page = Number(filter.page) || 1;
    const search = filter.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const points = await this.taskRepository.findByAllTask(search, skip, page);
    const total = await this.taskRepository.countTask(search);
    return {
      data: points,
      total,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }

  async getDetailsTask(id: number): Promise<Tasks> {
    return await this.taskRepository.findUserById(id);
  }

  async updateTask(id: number, data: UpdateTaskDto): Promise<Tasks> {
    return await this.taskRepository.updateTask(id, data);
  }

  async takeTask(id: number, takeTaskDto: TakeTaskDto): Promise<Tasks> {
    const checkTask = await this.taskRepository.findByIdTask(id);
    if (!checkTask) throw new Error('Task already assigned');

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
    const task = await this.taskRepository.findTaskWithConditions(id, {
      assigneeId: true,
    });
    if (!task) throw new HttpException('Task not found', HttpStatus.NOT_FOUND);

    if (task.assigneeId !== assigneeId)
      throw new HttpException(
        'Only the assignee can cancel this task',
        HttpStatus.FORBIDDEN,
      );

    const updateTask = await this.taskRepository.updateTask(id, {
      assigneeId: null,
      isAssigned: false,
    });

    return updateTask;
  }

  async completeTask(id: number, assigneeId: number) {
    const task = await this.taskRepository.findByIdTask(id);
    if (!task) throw new HttpException('Task not found', HttpStatus.NOT_FOUND);

    console.log('task.assigneeId ', task.assigneeId);

    if (task.assigneeId !== assigneeId)
      throw new HttpException(
        'Only the assignee or an admin can mark this task as complete',
        HttpStatus.FORBIDDEN,
      );

    const updatedTask = await this.taskRepository.updateTask(id, {
      isCompleted: true,
    });

    return updatedTask;
  }

  async deleteTask(id: number): Promise<Tasks> {
    return await this.taskRepository.deleteByIdTask(id);
  }
}
