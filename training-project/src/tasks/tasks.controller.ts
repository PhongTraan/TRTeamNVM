import {
  Body,
  Controller,
  Delete,
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

  @Delete(':id')
  deleteTask(@Param('id', ParseIntPipe) id: number): Promise<TasksModule> {
    return this.taskService.deleteTask(id);
  }
}
