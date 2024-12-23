import { UserRepository } from './user.repository';
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
  constructor(private userRepository: UserRepository) {}

  async getAllUser(
    filters: UserFilerType,
  ): Promise<UserPaginationResponseType> {
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';

    const skip = page > 1 ? (page - 1) * items_per_page : 0;

    const points = await this.userRepository.findByAllUser(search, skip, page);

    const total = await this.userRepository.countUser(search);

    return {
      data: points,
      total,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }

  async getDetailsUser(id: number): Promise<User> {
    return await this.userRepository.findUserById(id);
  }

  async updateAccountUser(
    id: number,
    data: updateProfileUserDto,
  ): Promise<User> {
    return this.userRepository.updateUserAccount(id, data);
  }

  async deleteUserAccount(id: number): Promise<User> {
    return await this.userRepository.deleteUserAccountById(id);
  }
}
