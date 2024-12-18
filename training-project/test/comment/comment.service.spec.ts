import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from 'src/comment/comment.service';
import { CommentRepository } from 'src/comment/comment.repository';
import { PrismaService } from 'src/prisma.service';
import { CommentFileType, CreateCommentDto } from 'src/dto/comment.dto';

describe('CommentService', () => {
  let commentService: CommentService;
  let commentRepository: CommentRepository;

  const mockCommentRepository = {
    createComment: jest.fn(),
    findComment: jest.fn(),
    countComment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: CommentRepository,
          useValue: mockCommentRepository,
        },
        PrismaService,
      ],
    }).compile();

    commentService = module.get<CommentService>(CommentService);
    commentRepository = module.get<CommentRepository>(CommentRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(commentService).toBeDefined();
  });

  describe('createComment', () => {
    it('should call createComment from repository and return the result', async () => {
      // Arrange
      const createCommentDto: CreateCommentDto = {
        message: 'Test comment',
        userId: 1,
        taskId: 2,
      };
      const mockComment = {
        id: 1,
        message: 'Test comment',
        userId: 1,
        taskId: 2,
      };

      mockCommentRepository.createComment.mockResolvedValue(mockComment);

      // Act
      const result = await commentService.createComment(createCommentDto);

      // Assert
      expect(result).toEqual(mockComment);
      expect(mockCommentRepository.createComment).toHaveBeenCalledWith(
        createCommentDto,
      );
    });

    it('should throw an error if the repository fails', async () => {
      // Arrange
      const createCommentDto: CreateCommentDto = {
        message: 'Test comment',
        userId: 1,
        taskId: 2,
      };

      mockCommentRepository.createComment.mockRejectedValue(
        new Error('Database error'),
      );

      // Act & Assert
      await expect(
        commentService.createComment(createCommentDto),
      ).rejects.toThrow('Database error');
      expect(mockCommentRepository.createComment).toHaveBeenCalledWith(
        createCommentDto,
      );
    });
  });

  describe('getAllComment', () => {
    it('should return paginated comments', async () => {
      // Arrange
      const filter: CommentFileType = {
        items_per_page: '10',
        page: 1, // Assuming page is valid
        search: 'Test', // String type is correct
      };
      const mockComments = [
        { id: 1, message: 'Test 1', userId: 1, taskId: 1 },
        { id: 2, message: 'Test 2', userId: 2, taskId: 1 },
      ];
      const mockTotal = 2;

      mockCommentRepository.findComment.mockResolvedValue(mockComments);
      mockCommentRepository.countComment.mockResolvedValue(mockTotal);

      // Act
      const result = await commentService.getAllComment(filter);

      // Assert
      expect(result).toEqual({
        data: mockComments,
        total: mockTotal,
        currentPage: 1,
        itemsPerPage: 10,
      });
      expect(mockCommentRepository.findComment).toHaveBeenCalledWith(
        'Test',
        0,
        10,
      );
      expect(mockCommentRepository.countComment).toHaveBeenCalledWith('Test');
    });

    it('should handle default pagination values when filter is incomplete', async () => {
      // Arrange
      const filter = {};
      const mockComments = [
        { id: 1, message: 'Test 1', userId: 1, taskId: 1 },
        { id: 2, message: 'Test 2', userId: 2, taskId: 1 },
      ];
      const mockTotal = 2;

      mockCommentRepository.findComment.mockResolvedValue(mockComments);
      mockCommentRepository.countComment.mockResolvedValue(mockTotal);

      // Act
      const result = await commentService.getAllComment(filter);

      // Assert
      expect(result).toEqual({
        data: mockComments,
        total: mockTotal,
        currentPage: 1,
        itemsPerPage: 20,
      });
      expect(mockCommentRepository.findComment).toHaveBeenCalledWith('', 0, 20);
      expect(mockCommentRepository.countComment).toHaveBeenCalledWith('');
    });
  });
});
