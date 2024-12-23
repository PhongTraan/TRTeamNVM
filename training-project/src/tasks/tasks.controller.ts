import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksModule } from './tasks.module';
import {
  CreateTaskDto,
  TaskFileType,
  TaskPaginationResponseType,
  UpdateTaskDto,
} from 'src/dto/tasks.dto';
import { TasksService } from './tasks.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('tasks')

export class TasksController {
  constructor(private taskService: TasksService) {}

  @Post()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN')
  async createTask(
    @Body() data: CreateTaskDto,
    @Req() req: any,
  ): Promise<TasksModule> {
    const userId = req.user.id;
    const taskData = {
      ...data,
      creatorId: userId,
    };
    return this.taskService.createTask(taskData);
  }

  @Get()
  getAllTasks(
    @Query() params: TaskFileType,
  ): Promise<TaskPaginationResponseType> {
    return this.taskService.getAllTasks(params);
  }

  @Get(':id')
  getDetailTask(@Param(':id', ParseIntPipe) id: number): Promise<TasksModule> {
    return this.taskService.getDetailsTask(id);
  }

  @Put(':id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateTaskDto,
  ): Promise<TasksModule> {
    return this.taskService.updateTask(id, data);
  }

  @Put('/task/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('USER')
  takeTask(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const assigneeId = req.user.id;
    return this.taskService.takeTask(id, { assigneeId });
  }

  @Put('/cancelTask/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('USER', 'ADMIN')
  cancelTask(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const assigneeId = req.user.id;
    return this.taskService.cancelTask(id, assigneeId);
  }

  @Put('/completeTask/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('USER', 'ADMIN')
  async completeTask(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const userId = req.user.id;

    try {
      return await this.taskService.completeTask(id, userId);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN')
  deleteTask(@Param('id', ParseIntPipe) id: number): Promise<TasksModule> {
    return this.taskService.deleteTask(id);
  }
}
