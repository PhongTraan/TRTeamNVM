import { createUserDto } from 'src/dto/user.dto';
import { Injectable } from '@nestjs/common';
import { Comment } from '@prisma/client';
import {
  CommentFileType,
  CommentPaginationResponseType,
  CreateCommentDto,
} from 'src/dto/comment.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prismaService: PrismaService) {}

  async createComment(data: CreateCommentDto): Promise<Comment> {
    return this.prismaService.comment.create({ data });
  }

  async getAllComment(
    filter: CommentFileType,
  ): Promise<CommentPaginationResponseType> {
    const items_per_page = Number(filter.items_per_page) || 20;
    const page = Number(filter.page) || 1;
    const search = filter.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;

    const point = await this.prismaService.comment.findFirst({
      take: items_per_page,
      skip,
      where: {
        OR: [
          {
            message: {
              contains: search,
            },
          },
        ],
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = await this.prismaService.comment.count({
      take: items_per_page,
      skip,
      where: {
        OR: [
          {
            message: {
              contains: search,
            },
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      data: [point],
      total,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }
}
