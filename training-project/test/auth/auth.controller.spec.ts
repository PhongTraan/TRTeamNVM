import { Test, TestingModule } from '@nestjs/testing';
import { RegisterDto, LoginDto } from 'src/dto/auth.dto';
import { User } from '@prisma/client';
import { HttpStatus } from '@nestjs/common';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  const userData = {
    id: 1,
    name: 'user',
    email: 'user@gamil.com',
    phone: '0868489008',
    password: 'hashedPassword',
    status: 2,
    role: 'USER',
  };

  const registerDto  = {
    name: 'user',
    phone: '0868489008',
    email: 'user@gamil.com',
    password: '123456',
    status: 2,
    role: 'USER',
  };

  const loginDto: LoginDto = {
    email: 'user@gamil.com',
    password: 'password',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should return user data when registration is successful', async () => {
      // Arrange: Mock the register method to return userData
      mockAuthService.register.mockResolvedValue(userData);

      // Act: Call the register endpoint
      const result = await authController.register(registerDto);

      // Assert: Verify that the result matches the expected user data
      expect(result).toEqual(userData);
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should throw an exception when registration fails', async () => {
      // Arrange: Mock the register method to throw an exception
      mockAuthService.register.mockRejectedValue(
        new Error('Registration failed'),
      );

      // Act & Assert: Expect the register method to throw an error
      await expect(authController.register(registerDto)).rejects.toThrowError(
        new Error('Registration failed'),
      );
    });
  });

  describe('login', () => {
    it('should return tokens when login is successful', async () => {
      // Arrange: Mock the login method to return an access token and refresh token
      const mockTokens = {
        accessToken: 'fakeAccessToken',
        refreshToken: 'fakeRefreshToken',
      };
      mockAuthService.login.mockResolvedValue(mockTokens);

      // Act: Call the login endpoint
      const result = await authController.login(loginDto);

      // Assert: Verify that the result contains both accessToken and refreshToken
      expect(result).toEqual(mockTokens);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw an exception when login fails', async () => {
      // Arrange: Mock the login method to throw an exception
      mockAuthService.login.mockRejectedValue(new Error('Login failed'));

      // Act & Assert: Expect the login method to throw an error
      await expect(authController.login(loginDto)).rejects.toThrowError(
        new Error('Login failed'),
      );
    });
  });
});
