import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { CategoryModule } from './category/category.module';
import { CommentModule } from './comment/comment.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TasksModule } from './tasks/tasks.module';
import { UserRepository } from './user/user.repository';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PostModule,
    CategoryModule,
    CommentModule,
    JwtModule,
    TasksModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService, PrismaService, UserService, UserRepository],
})
export class AppModule {}
