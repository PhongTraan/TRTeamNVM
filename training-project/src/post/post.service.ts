import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Post, Post as PostModel } from '@prisma/client';
import {
  CreatePostDto,
  PostFileType,
  PostPaginationResponseType,
  updatePostDto,
} from 'src/dto/post.dto';
import { PrismaService } from 'src/prisma.service';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  constructor(
    private prismaService: PrismaService,
    private postRepository: PostRepository,
  ) {}

  async createPost(data: CreatePostDto): Promise<PostModel> {
    return this.postRepository.createPost(data);
  }

  async getAllPost(filter: PostFileType): Promise<PostPaginationResponseType> {
    const items_per_page = Number(filter.items_per_page) || 20;
    const page = Number(filter.page) || 1;
    const search = filter.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;

    const points = await this.postRepository.findPost(
      search,
      skip,
      items_per_page,
    );

    const total = await this.postRepository.constPost(search);

    return {
      data: [points],
      total,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }

  async getDetailsUser(id: number): Promise<Post> {
    return await this.postRepository.findBuyIdPost(id);
  }

  async updatePost(id: number, data: updatePostDto): Promise<Post> {
    return await this.postRepository.updateFindBuyIdPost(id, data);
  }

  async deletePost(id: number): Promise<Post> {
    return this.postRepository.deleteBuyIdPost(id);
  }
}
