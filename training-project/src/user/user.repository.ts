import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { createUserDto, updateProfileUserDto } from 'src/dto/user.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {}

  async findUserByEmail(email: string): Promise<User> {
    return await this.prismaService.user.findFirst({ where: { email } });
  }

  async findByAllUser(search: string, skip: number, itemsPerPage: number) {
    return await this.prismaService.user.findMany({
      take: itemsPerPage,
      skip,
      where: {
        OR: [{ name: { contains: search } }, { email: { contains: search } }],
        AND: [{ status: 2 }],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async countUser(search: string) {
    return this.prismaService.user.count({
      where: {
        OR: [{ name: { contains: search } }, { email: { contains: search } }],
        AND: [{ status: 2 }],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findUserById(id: number) {
    return await this.prismaService.user.findFirst({
      where: { id },
    });
  }

  async updateUserAccount(
    id: number,
    data: updateProfileUserDto,
  ): Promise<User> {
    return await this.prismaService.user.update({
      where: { id },
      data,
    });
  }

  async deleteUserAccountById(id: number) {
    return await this.prismaService.user.delete({ where: { id } });
  }
}
