import { Injectable } from '@nestjs/common';
import { Comment } from '@prisma/client';
import { CreateCommentDto } from 'src/dto/comment.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CommentRepository {
  constructor(private prismaService: PrismaService) {}

  async createComment(data: CreateCommentDto): Promise<Comment> {
    return await this.prismaService.comment.create({ data });
  }

  async findComment(search: string, skip: number, itemsPerPage: number) {
    return this.prismaService.comment.findMany({
      take: itemsPerPage,
      skip,
      where: {
        OR: [{ message: { contains: search } }],
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async countComment(search: string) {
    return await this.prismaService.comment.count({
      where: {
        OR: [{ message: { contains: search } }],
      },
    });
  }
}
