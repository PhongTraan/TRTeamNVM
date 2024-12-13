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
import { Post as PostModel } from '@prisma/client';
import {
  CreatePostDto,
  PostFileType,
  PostPaginationResponseType,
  updatePostDto,
} from 'src/dto/post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  createPost(@Body() data: CreatePostDto): Promise<PostModel> {
    return this.postService.createPost(data);
  }

  @Get()
  getAll(@Query() params: PostFileType): Promise<PostPaginationResponseType> {
    return this.postService.getAllPost(params);
  }

  @Get(':id')
  getDetails(@Param('id', ParseIntPipe) id: number): Promise<PostModel> {
    return this.postService.getDetailsUser(id);
  }

  @Put(':id')
  updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: updatePostDto,
  ): Promise<PostModel> {
    return null;
  }
}
