import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthRepository } from 'src/auth/auth.repository';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma.service';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let authRepo: AuthRepository;

  const userData = {
    name: 'user',
    phone: '0868489008',
    email: 'user@gamil.com',
    password: '123456',
    status: 2,
    role: 'USER',
  };

  const loginData = {
    email: 'user@gamil.com',
    password: '123456',
  };

  const mockPrismaService = {
    user: {
      create: jest.fn().mockResolvedValue(userData),
      findUnique: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockAuthRepository = {
    findUserByEmail: jest.fn(),
    createUser: jest.fn(),
    verifyPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: AuthRepository,
          useValue: mockAuthRepository,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(PrismaService);
    authRepo = module.get<AuthRepository>(AuthRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('Register Api', () => {
    it('Show Register Successfully And Return User Data', async () => {
      mockAuthRepository.findUserByEmail.mockResolvedValue(null);
      mockAuthRepository.createUser.mockResolvedValue(userData);

      const result = await authService.register(userData);

      expect(result).toEqual(userData);
      expect(mockAuthRepository.createUser).toHaveBeenCalledWith(userData);
    });

    it('should throw an exception when email is already in use', async () => {
      mockAuthRepository.findUserByEmail.mockResolvedValue(userData);

      await expect(authService.register(userData)).rejects.toThrow(
        new HttpException(
          { message: 'This Email has been used' },
          HttpStatus.BAD_REQUEST,
        ),
      );
      expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledWith(
        userData.email,
      );
    });
  });

  //

  describe('Login Api', () => {
    //Check Email
    it('should throw an exception if the account does not exist', async () => {
      mockAuthRepository.findUserByEmail.mockResolvedValue(null);

      await expect(authService.login(loginData)).rejects.toThrow(
        new HttpException(
          { message: 'Account Is Not Exit' },
          HttpStatus.UNAUTHORIZED,
        ),
      );
    });

    it('should throw an exception if the password is invalid', async () => {
      mockAuthRepository.findUserByEmail.mockResolvedValue(userData);
      mockAuthRepository.verifyPassword.mockResolvedValue(false);

      await expect(authService.login(loginData)).rejects.toThrow(
        new HttpException(
          { message: 'Invalid password' },
          HttpStatus.UNAUTHORIZED,
        ),
      );
    });

    it('should return access and refresh tokens if login is successful', async () => {
      mockAuthRepository.findUserByEmail.mockResolvedValue(userData);
      mockAuthRepository.verifyPassword.mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('fake_token'); // Mock JWT sign method

      const result = await authService.login(loginData);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2); // Ensure signAsync is called twice (once for access and once for refresh token)
    });
  });
});
