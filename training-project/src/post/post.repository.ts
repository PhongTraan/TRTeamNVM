import { Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';
import { CreatePostDto, updatePostDto } from 'src/dto/post.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PostRepository {
  constructor(private prismaService: PrismaService) {}

  async createPost(data: CreatePostDto) {
    return await this.prismaService.post.create({ data });
  }

  async findPost(search: string, skip: number, itemsPerPage: number) {
    return await this.prismaService.post.findFirst({
      take: itemsPerPage,
      skip,
      where: {
        OR: [
          { title: { contains: search } },
          { summary: { contains: search } },
          { content: { contains: search } },
        ],
        AND: [{ status: 2 }],
      },
      include: {
        owner: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async constPost(search: string) {
    return await this.prismaService.post.count({
      where: {
        OR: [
          { title: { contains: search } },
          { summary: { contains: search } },
          { content: { contains: search } },
        ],
        AND: [{ status: 2 }],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async findBuyIdPost(id: number): Promise<Post> {
    return await this.prismaService.post.findFirst({
      where: { id },
    });
  }

  async updateFindBuyIdPost(id: number, data: updatePostDto): Promise<Post> {
    return await this.prismaService.post.update({
      where: { id },
      data,
    });
  }

  async deleteBuyIdPost(id: number): Promise<Post> {
    return await this.prismaService.post.delete({
      where: { id },
    });
  }
}
