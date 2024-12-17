import { RegisterDto } from 'src/dto/auth.dto';
import { PrismaService } from './../prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private authRepository: AuthRepository,
  ) {}

  register = async (useData: RegisterDto): Promise<User> => {
    const user = await this.authRepository.findUserByEmail(useData.email);
    if (user) {
      throw new HttpException(
        { message: 'This Email has been used' },
        HttpStatus.BAD_REQUEST,
      );
    }
    //Step2: Hash Password and store to db
    return await this.authRepository.createUser(useData);
  };

  // Logic Login
  login = async (data: { email: string; password: string }): Promise<any> => {
    const user = await this.authRepository.findUserByEmail(data.email);

    if (!user) {
      throw new HttpException(
        { message: 'Account Is Not Exit' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isPasswordValid = await this.authRepository.verifyPassword(data.email, data.password);
    if (!isPasswordValid) {
      throw new HttpException(
        { message: 'Invalid password' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    //Step 3:
    const payload = {
      id: user.id,
      email: user.email,
      password: user.password,
      role: user.role,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_KEY,
      expiresIn: '1d',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_KEY,
      expiresIn: '7d',
    });

    return {
      // user,
      accessToken,
      refreshToken,
    };
  };
}
