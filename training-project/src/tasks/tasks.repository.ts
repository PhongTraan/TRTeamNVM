import { Injectable } from '@nestjs/common';
import { Tasks } from '@prisma/client';
import { CreateTaskDto, TakeTaskDto, UpdateTaskDto } from 'src/dto/tasks.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TaskRepository {
  constructor(private prismaService: PrismaService) {}

  async createTask(data: CreateTaskDto): Promise<Tasks> {
    return await this.prismaService.tasks.create({ data });
  }

  async findByAllTask(search: string, skip: number, itemsPerPage: number) {
    return await this.prismaService.tasks.findMany({
      take: itemsPerPage,
      skip,
      where: {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async countTask(search: string) {
    return this.prismaService.tasks.count({
      where: {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findUserById(id: number): Promise<Tasks> {
    return await this.prismaService.tasks.findFirst({ where: { id } });
  }

  async updateTask(id: number, data: UpdateTaskDto): Promise<Tasks> {
    return await this.prismaService.tasks.update({ where: { id }, data });
  }

  async findByIdTask(id: number): Promise<Tasks> {
    return await this.prismaService.tasks.findFirst({ where: { id } });
  }

  async findTaskWithConditions( id: number,    selectFields?: object,): Promise<any> {
    return this.prismaService.tasks.findFirst({
      where: { id },
      select: selectFields || null,
    });
  }

  async deleteByIdTask (id: number) : Promise<Tasks> {
    return await this.prismaService.tasks.delete({where: {id}})
  }
}
