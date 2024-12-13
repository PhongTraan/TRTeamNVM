import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Post, Post as PostModel } from '@prisma/client';
import {
  CreatePostDto,
  PostFileType,
  PostPaginationResponseType,
} from 'src/dto/post.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PostService {
  constructor(private prismaService: PrismaService) {}

  async createPost(data: CreatePostDto): Promise<PostModel> {
    return this.prismaService.post.create({ data });
  }

  async getAllPost(filter: PostFileType): Promise<PostPaginationResponseType> {
    const items_per_page = Number(filter.items_per_page) || 20;
    const page = Number(filter.page) || 1;
    const search = filter.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const points = await this.prismaService.post.findFirst({
      take: items_per_page,
      skip,
      where: {
        OR: [
          {
            type: {
              contains: search,
            },
            summary: {
              contains: search,
            },
            content: {
              contains: search,
            },
          },
        ],
        AND: [{ status: 2 }],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = await this.prismaService.post.count({
      take: items_per_page,
      skip,
      where: {
        OR: [
          {
            type: {
              contains: search,
            },
            summary: {
              contains: search,
            },
            content: {
              contains: search,
            },
          },
        ],
        AND: [{ status: 2 }],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      data: [points],
      total,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }

  async getDetailsUser(id: number): Promise<Post> {
    return this.prismaService.post.findFirst({
      where: {
        id,
      },
    });
  }
}
