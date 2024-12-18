import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';
import { ForbiddenException } from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto } from 'src/dto/tasks.dto';
import { TasksController } from 'src/tasks/tasks.controller';
import { TasksService } from 'src/tasks/tasks.service';

describe('TasksController', () => {
  let tasksController: TasksController;
  let tasksService: TasksService;

  const mockTasksService = {
    createTask: jest.fn(),
    getAllTasks: jest.fn(),
    getDetailsTask: jest.fn(),
    updateTask: jest.fn(),
    takeTask: jest.fn(),
    cancelTask: jest.fn(),
    completeTask: jest.fn(),
    deleteTask: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .overrideGuard(RoleGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    tasksController = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(TasksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a new task successfully', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Task 1',
        description: 'Test task',
        creatorId: 1,
        assigneeId: null,
      };

      const req = { user: { id: 1 } };
      const mockTask = { id: 1, ...createTaskDto };

      mockTasksService.createTask.mockResolvedValueOnce(mockTask);

      const result = await tasksController.createTask(createTaskDto, req);

      expect(tasksService.createTask).toHaveBeenCalledWith({
        ...createTaskDto,
        creatorId: 1,
      });
      expect(result).toEqual(mockTask);
    });
  });

  describe('getAllTasks', () => {
    it('should return a list of tasks', async () => {
      const mockTasks = { data: [{ id: 1, title: 'Task 1' }], total: 1 };

      mockTasksService.getAllTasks.mockResolvedValueOnce(mockTasks);

      const result = await tasksController.getAllTasks({});

      expect(tasksService.getAllTasks).toHaveBeenCalledWith({});
      expect(result).toEqual(mockTasks);
    });
  });

  describe('getDetailTask', () => {
    it('should return task details', async () => {
      const mockTask = { id: 1, title: 'Task 1' };

      mockTasksService.getDetailsTask.mockResolvedValueOnce(mockTask);

      const result = await tasksController.getDetailTask(1);

      expect(tasksService.getDetailsTask).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTask);
    });
  });

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      const updateTaskDto: UpdateTaskDto = { title: 'Updated Task' };
      const mockTask = { id: 1, ...updateTaskDto };

      mockTasksService.updateTask.mockResolvedValueOnce(mockTask);

      const result = await tasksController.updateTask(1, updateTaskDto);

      expect(tasksService.updateTask).toHaveBeenCalledWith(1, updateTaskDto);
      expect(result).toEqual(mockTask);
    });
  });

  describe('takeTask', () => {
    it('should assign a task to the user', async () => {
      const req = { user: { id: 2 } };
      const mockTask = { id: 1, assigneeId: 2 };

      mockTasksService.takeTask.mockResolvedValueOnce(mockTask);

      const result = await tasksController.takeTask(1, req);

      expect(tasksService.takeTask).toHaveBeenCalledWith(1, { assigneeId: 2 });
      expect(result).toEqual(mockTask);
    });
  });

  describe('cancelTask', () => {
    it('should cancel a task successfully', async () => {
      const req = { user: { id: 2 } };
      const mockTask = { id: 1, assigneeId: null };

      mockTasksService.cancelTask.mockResolvedValueOnce(mockTask);

      const result = await tasksController.cancelTask(1, req);

      expect(tasksService.cancelTask).toHaveBeenCalledWith(1, 2);
      expect(result).toEqual(mockTask);
    });
  });

  describe('completeTask', () => {
    it('should complete a task successfully', async () => {
      const req = { user: { id: 2 } };
      const mockTask = { id: 1, isCompleted: true };

      mockTasksService.completeTask.mockResolvedValueOnce(mockTask);

      const result = await tasksController.completeTask(1, req);

      expect(tasksService.completeTask).toHaveBeenCalledWith(1, 2);
      expect(result).toEqual(mockTask);
    });

    it('should throw a forbidden exception if an error occurs', async () => {
      const req = { user: { id: 2 } };

      mockTasksService.completeTask.mockRejectedValueOnce(
        new Error('Forbidden'),
      );

      await expect(tasksController.completeTask(1, req)).rejects.toThrowError(
        ForbiddenException,
      );
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      const mockTask = { id: 1, title: 'Task 1' };

      mockTasksService.deleteTask.mockResolvedValueOnce(mockTask);

      const result = await tasksController.deleteTask(1);

      expect(tasksService.deleteTask).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTask);
    });
  });
});
