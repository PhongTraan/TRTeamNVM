import { Test, TestingModule } from '@nestjs/testing';
import { TaskRepository } from 'src/tasks/tasks.repository';
import { TasksService } from 'src/tasks/tasks.service';
import { PrismaService } from 'src/prisma.service';
import { CreateTaskDto, TaskFileType, UpdateTaskDto } from 'src/dto/tasks.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('TasksService', () => {
  let tasksService: TasksService;
  let taskRepository: TaskRepository;

  const mockTaskRepository = {
    createTask: jest.fn(),
    findByAllTask: jest.fn(),
    countTask: jest.fn(),
    findUserById: jest.fn(),
    updateTask: jest.fn(),
    findByIdTask: jest.fn(),
    findTaskWithConditions: jest.fn(),
    deleteByIdTask: jest.fn(),
  };

  const mockPrismaService = {
    tasks: {
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TaskRepository,
          useValue: mockTaskRepository,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    taskRepository = module.get<TaskRepository>(TaskRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(tasksService).toBeDefined();
  });

  describe('createTask', () => {
    it('should create a task and return it', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Task Description',
        creatorId: 1,
        assigneeId: null,
      };

      const mockTask = {
        id: 1,
        title: 'Test Task',
        description: 'Task Description',
        creatorId: 1,
        assigneeId: null,
        isCompleted: false,
        isAssigned: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockTaskRepository.createTask.mockResolvedValue(mockTask);

      const result = await tasksService.createTask(createTaskDto);

      expect(result).toEqual(mockTask);
      expect(taskRepository.createTask).toHaveBeenCalledWith(createTaskDto);
    });
  });

  describe('getAllTasks', () => {
    it('should return paginated tasks', async () => {
      const filter: TaskFileType = {
        items_per_page: '10',
        page: 1,
        search: 'test',
      };

      const mockTasks = [
        {
          id: 1,
          title: 'Test Task',
          description: 'Task Description',
          creatorId: 1,
          assigneeId: null,
          isCompleted: false,
          isAssigned: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockTotal = 1;

      mockTaskRepository.findByAllTask.mockResolvedValue(mockTasks);
      mockTaskRepository.countTask.mockResolvedValue(mockTotal);

      const result = await tasksService.getAllTasks(filter);

      expect(result).toEqual({
        data: mockTasks,
        total: mockTotal,
        currentPage: 1,
        itemsPerPage: 10,
      });
      expect(taskRepository.findByAllTask).toHaveBeenCalledWith('test', 0, 1);
      expect(taskRepository.countTask).toHaveBeenCalledWith('test');
    });
  });

  describe('takeTask', () => {
    it('should assign a task successfully', async () => {
      const id = 1;
      const takeTaskDto = { assigneeId: 2 };

      mockTaskRepository.findByIdTask.mockResolvedValueOnce({
        id,
        isAssigned: false,
      });
      mockPrismaService.tasks.update.mockResolvedValueOnce({
        id,
        assigneeId: 2,
        isAssigned: true,
      });

      const result = await tasksService.takeTask(id, takeTaskDto);

      expect(mockTaskRepository.findByIdTask).toHaveBeenCalledWith(id);
      expect(mockPrismaService.tasks.update).toHaveBeenCalledWith({
        where: { id },
        data: { assigneeId: 2, isAssigned: true },
      });
      expect(result).toEqual({ id, assigneeId: 2, isAssigned: true });
    });

    it('should throw an error if task is already assigned', async () => {
      const id = 1;
      const takeTaskDto = { assigneeId: 2 };

      mockTaskRepository.findByIdTask.mockResolvedValueOnce(null);

      await expect(tasksService.takeTask(id, takeTaskDto)).rejects.toThrowError(
        'Task already assigned',
      );
    });
  });

  describe('cancelTask', () => {
    it('should cancel a task successfully', async () => {
      const id = 1;
      const assigneeId = 2;

      mockTaskRepository.findTaskWithConditions.mockResolvedValueOnce({
        id,
        assigneeId,
      });
      mockTaskRepository.updateTask.mockResolvedValueOnce({
        id,
        assigneeId: null,
        isAssigned: false,
      });

      const result = await tasksService.cancelTask(id, assigneeId);

      expect(mockTaskRepository.findTaskWithConditions).toHaveBeenCalledWith(
        id,
        { assigneeId: true },
      );
      expect(mockTaskRepository.updateTask).toHaveBeenCalledWith(id, {
        assigneeId: null,
        isAssigned: false,
      });
      expect(result).toEqual({ id, assigneeId: null, isAssigned: false });
    });

    it('should throw an error if task is not found', async () => {
      const id = 1;
      const assigneeId = 2;

      mockTaskRepository.findTaskWithConditions.mockResolvedValueOnce(null);

      await expect(
        tasksService.cancelTask(id, assigneeId),
      ).rejects.toThrowError(
        new HttpException('Task not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an error if user is not the assignee', async () => {
      const id = 1;
      const assigneeId = 3;

      mockTaskRepository.findTaskWithConditions.mockResolvedValueOnce({
        id,
        assigneeId: 2,
      });

      await expect(
        tasksService.cancelTask(id, assigneeId),
      ).rejects.toThrowError(
        new HttpException(
          'Only the assignee can cancel this task',
          HttpStatus.FORBIDDEN,
        ),
      );
    });
  });

  describe('completeTask', () => {
    it('should complete a task successfully', async () => {
      const id = 1;
      const assigneeId = 2;

      mockTaskRepository.findByIdTask.mockResolvedValueOnce({ id, assigneeId });
      mockTaskRepository.updateTask.mockResolvedValueOnce({
        id,
        isCompleted: true,
      });

      const result = await tasksService.completeTask(id, assigneeId);

      expect(mockTaskRepository.findByIdTask).toHaveBeenCalledWith(id);
      expect(mockTaskRepository.updateTask).toHaveBeenCalledWith(id, {
        isCompleted: true,
      });
      expect(result).toEqual({ id, isCompleted: true });
    });

    it('should throw an error if task is not found', async () => {
      const id = 1;
      const assigneeId = 2;

      mockTaskRepository.findByIdTask.mockResolvedValueOnce(null);

      await expect(
        tasksService.completeTask(id, assigneeId),
      ).rejects.toThrowError(
        new HttpException('Task not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an error if user is not the assignee', async () => {
      const id = 1;
      const assigneeId = 3;

      mockTaskRepository.findByIdTask.mockResolvedValueOnce({
        id,
        assigneeId: 2,
      });

      await expect(
        tasksService.completeTask(id, assigneeId),
      ).rejects.toThrowError(
        new HttpException(
          'Only the assignee or an admin can mark this task as complete',
          HttpStatus.FORBIDDEN,
        ),
      );
    });
  });

  describe('updateTask', () => {
    it('should update a task and return it', async () => {
      const id = 1;
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Updated Description',
      };

      const updatedTask = {
        id: 1,
        title: 'Updated Task',
        description: 'Updated Description',
        creatorId: 1,
        assigneeId: null,
        isCompleted: false,
        isAssigned: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTaskRepository.updateTask.mockResolvedValue(updatedTask);

      const result = await tasksService.updateTask(id, updateTaskDto);

      expect(result).toEqual(updatedTask);
      expect(taskRepository.updateTask).toHaveBeenCalledWith(id, updateTaskDto);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task and return it', async () => {
      const id = 1;
      const deletedTask = {
        id: 1,
        title: 'Task to be deleted',
        description: 'Description',
        creatorId: 1,
        assigneeId: null,
        isCompleted: false,
        isAssigned: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTaskRepository.deleteByIdTask.mockResolvedValue(deletedTask);

      const result = await tasksService.deleteTask(id);

      expect(result).toEqual(deletedTask);
      expect(taskRepository.deleteByIdTask).toHaveBeenCalledWith(id);
    });
  });
});
