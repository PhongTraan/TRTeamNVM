import { RegisterDto } from 'src/dto/auth.dto';
import { PrismaService } from './../prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  register = async (useData: RegisterDto): Promise<User> => {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: useData.email,
      },
    });
    if (user) {
      throw new HttpException(
        { message: 'This Email has been used' },
        HttpStatus.BAD_REQUEST,
      );
    }
    //Step2: Hash Password and store to db
    const hashPassword = await hash(useData.password, 10);

    const res = await this.prismaService.user.create({
      data: { ...useData, password: hashPassword },
    });

    return res;
  };

  // Logic Login
  login = async (data: { email: string; password: string }): Promise<any> => {
    //Step 1: Checking User is exist by email
    const user = await this.prismaService.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      throw new HttpException(
        { message: 'Account Is Not Exit' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    //Step 2: Check Password
    const verify = await compare(data.password, user.password);

    if (!verify) {
      throw new HttpException(
        { message: 'Password does not account.' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    //Step 3:
    const payload = { id: user.id, email: user.email, password: user.password };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_KEY,
      expiresIn: '1d',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_KEY,
      expiresIn: '7d',
    });

    return {
      // user,
      accessToken,
      refreshToken,
    };
  };
}
