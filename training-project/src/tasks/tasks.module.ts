import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { TaskRepository } from './tasks.repository';

@Module({
  controllers: [TasksController],
  providers: [TasksService, PrismaService, JwtService, TaskRepository],
})
export class TasksModule {}
