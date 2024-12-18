import { Test, TestingModule } from '@nestjs/testing';
import { Comment } from '@prisma/client';
import { CommentController } from 'src/comment/comment.controller';
import { CommentService } from 'src/comment/comment.service';
import {
  CommentFileType,
  CommentPaginationResponseType,
  CreateCommentDto,
} from 'src/dto/comment.dto';

describe('CommentController', () => {
  let commentController: CommentController;
  let commentService: CommentService;

  const mockCommentService = {
    createComment: jest.fn(),
    getAllComment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        {
          provide: CommentService,
          useValue: mockCommentService,
        },
      ],
    }).compile();

    commentController = module.get<CommentController>(CommentController);
    commentService = module.get<CommentService>(CommentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(commentController).toBeDefined();
  });

  describe('createComment', () => {
    it('should create a comment and return it', async () => {
      const createCommentDto: CreateCommentDto = {
        message: 'Test Comment',
        userId: 1,
        taskId: 1,
      };

      const mockComment: Comment = {
        id: 1,
        message: 'Test Comment',
        userId: 1,
        taskId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(commentService, 'createComment')
        .mockResolvedValue(mockComment);

      const result = await commentController.createComment(createCommentDto);

      expect(result).toEqual(mockComment);
      expect(commentService.createComment).toHaveBeenCalledWith(
        createCommentDto,
      );
    });
  });

  describe('getAllComment', () => {
    it('should return paginated comments', async () => {
      const filter: CommentFileType = {
        items_per_page: '10',
        page: 1,
        search: 'test',
      };

      const mockResponse: CommentPaginationResponseType = {
        data: [
          {
            id: 1,
            message: 'Test Comment',
            userId: 1,
            taskId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        total: 1,
        currentPage: 1,
        itemsPerPage: 10,
      };

      jest
        .spyOn(commentService, 'getAllComment')
        .mockResolvedValue(mockResponse);

      const result = await commentController.getAllComment(filter);

      expect(result).toEqual(mockResponse);
      expect(commentService.getAllComment).toHaveBeenCalledWith(filter);
    });
  });
});
