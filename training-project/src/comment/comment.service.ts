import { createUserDto } from 'src/dto/user.dto';
import { Injectable } from '@nestjs/common';
import { Comment } from '@prisma/client';
import {
  CommentFileType,
  CommentPaginationResponseType,
  CreateCommentDto,
} from 'src/dto/comment.dto';
import { PrismaService } from 'src/prisma.service';
import { CommentRepository } from './comment.repository';

@Injectable()
export class CommentService {
  constructor(
    private prismaService: PrismaService,
    private commentRepository: CommentRepository,
  ) {}

  async createComment(data: CreateCommentDto): Promise<Comment> {
    return await this.commentRepository.createComment(data);
  }

  async getAllComment(
    filter: CommentFileType,
  ): Promise<CommentPaginationResponseType> {
    const items_per_page = Number(filter.items_per_page) || 20;
    const page = Number(filter.page) || 1;
    const search = filter.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;

    const point = await this.commentRepository.findComment(
      search,
      skip,
      items_per_page,
    );

    const total = await this.commentRepository.countComment(search);

    return {
      data: point,
      total,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }
}
