import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Post, Post as PostModel } from '@prisma/client';
import {
  CreatePostDto,
  PostFileType,
  PostPaginationResponseType,
  updatePostDto,
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
            title: {
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
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
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
            title: {
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

  async updatePost(id: number, data: updatePostDto): Promise<Post> {
    return await this.prismaService.post.update({
      where: {
        id,
      },
      data,
    });
  }

  async deletePost(id: number): Promise<Post> {
    return await this.prismaService.post.delete({
      where: {
        id,
      },
    });
  }
}
