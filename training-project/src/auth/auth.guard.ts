import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new HttpException(
        { message: 'Authorization header missing' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new HttpException(
        { message: 'Token missing in Authorization header' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_TOKEN_KEY,
      });

      request.user = decoded;
      return true;
    } catch (error) {
      throw new HttpException(
        { message: 'Invalid or expired token' },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
