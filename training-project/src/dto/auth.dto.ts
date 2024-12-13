import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  name: string;

  phone: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  role: number;
}

export class LoginDto {
  @IsNotEmpty()
  email: string;

  @MinLength(6)
  password: string;
}
