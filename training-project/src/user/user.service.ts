import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { hash } from 'bcrypt';
import {
  createUserDto,
  updateProfileUserDto,
  UserFilerType,
  UserPaginationResponseType,
} from 'src/dto/user.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async createAccountUser(body: createUserDto): Promise<User> {
    //Checking Email
    const useData = await this.prismaService.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (useData) {
      throw new HttpException(
        { message: 'This Email has been User' },
        HttpStatus.BAD_REQUEST,
      );
    }
    //Hash password
    const hashPassword = await hash(body.password, 10);
    const res = await this.prismaService.user.create({
      data: { ...body, password: hashPassword },
    });
    return res;
  }

  async getAllUser(
    filters: UserFilerType,
  ): Promise<UserPaginationResponseType> {
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';

    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const users = await this.prismaService.user.findMany({
      take: items_per_page,
      skip,
      where: {
        OR: [
          {
            name: {
              contains: search,
            },
            email: {
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

    const total = await this.prismaService.user.count({
      take: items_per_page,
      skip,
      where: {
        OR: [
          {
            name: {
              contains: search,
            },
            email: {
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
      data: users,
      total,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }

  async getDetailsUser(id: number): Promise<User> {
    return this.prismaService.user.findFirst({
      where: {
        id,
      },
    });
  }

  async updateAccountUser (id: number, data: updateProfileUserDto) : Promise<User> {
    return await this.prismaService.user.update({
        where : {
            id
        },
        data
    })
  }
}
