export type Id = number | string;

export interface RegisterDto {
  name: string;
  phone: string;
  email: string;
  password: string;
  role?: string;
  status?: number;
}

export interface LoginDto {
  email: string;
  password: string;
  accessToken?: string;
  refreshToken?: string;
  role?: string;
}
