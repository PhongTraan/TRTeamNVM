import { User } from '@prisma/client';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class createUserDto {
  @IsNotEmpty()
  name: string;

  phone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  status: number;
}

export interface UserFilerType {
  items_per_page?: string;
  page?: number;
  search?: string;
}

export interface UserPaginationResponseType {
  data: User[];
  total: number;
  currentPage: number;
  itemsPerPage: number;
}

export class updateProfileUserDto {
  name: string;
  phone: string;
}
