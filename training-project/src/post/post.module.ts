import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PrismaService } from 'src/prisma.service';
import { PostRepository } from './post.repository';

@Module({
  controllers: [PostController],
  providers: [PostService, PrismaService, PostRepository],
})
export class PostModule {}
