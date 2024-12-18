import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { updateProfileUserDto, UserFilerType } from 'src/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/user.repository';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let prismaService: PrismaService;

  const mockUserRepository = {
    findUserByEmail: jest.fn(),
    findByAllUser: jest.fn(),
    countUser: jest.fn(),
    findUserById: jest.fn(),
    updateUserAccount: jest.fn(),
    deleteUserAccountById: jest.fn(),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('getAllUser', () => {
    it('should return paginated users', async () => {
      const filter: UserFilerType = {
        items_per_page: '10',
        page: 1,
        search: 'test',
      };
      const mockUsers = [
        { id: 1, name: 'User1', phone: '0987654321' },
        { id: 2, name: 'User2', phone: '0987654321' },
      ];

      const mockTotal = 1;

      mockUserRepository.findByAllUser.mockResolvedValue(mockUsers);
      mockUserRepository.countUser.mockResolvedValue(mockTotal);

      const result = await userService.getAllUser(filter);

      expect(result).toEqual({
        data: mockUsers,
        total: mockTotal,
        currentPage: 1,
        itemsPerPage: 10,
      });
      expect(userRepository.findByAllUser).toHaveBeenCalledWith('test', 0, 1);
      expect(userRepository.countUser).toHaveBeenCalledWith('test');
    });
  });

  describe('getDetailsUser', () => {
    it('should return user details', async () => {
      const mockUser = { id: 1, name: 'User1' };

      mockUserRepository.findUserById.mockResolvedValue(mockUser);

      const result = await userService.getDetailsUser(1);

      expect(result).toEqual(mockUser);
      expect(userRepository.findUserById).toHaveBeenCalledWith(1);
    });
  });

  describe('updateAccountUser', () => {
    it('should update user details and return the updated user', async () => {
      const updateDto: updateProfileUserDto = {
        name: 'Updated Name',
        phone: '09876652',
      };
      const mockUser = { id: 1, name: 'Updated Name' };

      mockUserRepository.updateUserAccount.mockResolvedValue(mockUser);

      const result = await userService.updateAccountUser(1, updateDto);

      expect(result).toEqual(mockUser);
      expect(userRepository.updateUserAccount).toHaveBeenCalledWith(
        1,
        updateDto,
      );
    });
  });

  describe('deleteUserAccount', () => {
    it('should delete the user and return it', async () => {
      const mockUser = { id: 1, name: 'User1' };

      mockUserRepository.deleteUserAccountById.mockResolvedValue(mockUser);

      const result = await userService.deleteUserAccount(1);

      expect(result).toEqual(mockUser);
      expect(userRepository.deleteUserAccountById).toHaveBeenCalledWith(1);
    });
  });
});
