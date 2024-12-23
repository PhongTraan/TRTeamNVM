import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { RegisterDto } from 'src/dto/auth.dto';
import { PrismaService } from 'src/prisma.service';
import { hash, compare } from 'bcrypt';

@Injectable()
export class AuthRepository {
  constructor(private prismaService: PrismaService) {}

  async findUserByEmail(email: string): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: { email },
    });
  }

  async createUser(data: RegisterDto): Promise<User> {
    const hashPassword = await hash(data.password, 10);
    return this.prismaService.user.create({
      data: {
        email: data.email,
        password: hashPassword,
        name: data.name,
        phone: data.phone,
        role: 'USER',
        status: 2,
        // role: 'ADMIN',
      },
    });
  }

  async verifyPassword(email: string, password: string): Promise<boolean> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      return false;
    }
    const isMatch = await compare(password, user.password);
    return isMatch;
  }
}
