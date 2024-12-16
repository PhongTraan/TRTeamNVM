import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Comment, PrismaClient } from '@prisma/client';
import { CreateCategoryDto } from 'src/dto/category.dto';
import {
  CommentFileType,
  CommentPaginationResponseType,
  CreateCommentDto,
} from 'src/dto/comment.dto';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post()
  createComment(@Body() data: CreateCommentDto): Promise<Comment> {
    return this.commentService.createComment(data);
  }

  @Get()
  getAllComment(
    @Query() param: CommentFileType,
  ): Promise<CommentPaginationResponseType> {
    return this.commentService.getAllComment(param);
  }

  //   @Get(':id')
  //   getDetailsComment(@Param(':id', ParseIntPipe) id: number): Promise<Comment> {
  //     return null;
  //   }
}
