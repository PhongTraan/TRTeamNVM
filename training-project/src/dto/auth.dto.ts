import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@Exclude()
export class RegisterDto {
  @IsNotEmpty()
  @Expose()
  name: string;

  phone: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  role?: string;
}

export class LoginDto {
  @IsNotEmpty()
  email: string;

  @MinLength(6)
  password: string;
}
