import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { updateProfileUserDto } from 'src/dto/user.dto';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';
import { getRolesGuard, mockAuthGuard } from './mocks/auth.mock';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUserService = {
    createAccountUser: jest.fn(),
    getAllUser: jest.fn(),
    getDetailsUser: jest.fn(),
    updateAccountUser: jest.fn(),
    deleteUserAccount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '60s' },
        }),
      ],
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: AuthGuard,
          useValue: mockAuthGuard(),
        },
        {
          provide: RoleGuard,
          useValue: getRolesGuard(),
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should call userService.getAllUser and return paginated users', async () => {
      const mockResult = {
        data: [{ id: 1, name: 'User1' }],
        total: 1,
      };

      mockUserService.getAllUser.mockResolvedValueOnce(mockResult);

      const result = await userController.getAllUser({});

      expect(userService.getAllUser).toHaveBeenCalledWith({});
      expect(result).toEqual(mockResult);
    });
  });

  describe('getUserDetails', () => {
    it('should call userService.getDetailsUser and return user details', async () => {
      const userId = 1;
      const mockResult = { id: userId, name: 'User1' };

      mockUserService.getDetailsUser.mockResolvedValueOnce(mockResult);

      const result = await userController.getDetailsId(userId);

      expect(userService.getDetailsUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockResult);
    });
  });

  describe('updateUser', () => {
    it('should call userService.updateAccountUser and return updated user', async () => {
      const mockId = 1;
      const dto: updateProfileUserDto = {
        name: 'Updated User',
        phone: '0987654321',
      };
      const mockResult = { id: mockId, name: 'Updated User' };

      mockUserService.updateAccountUser.mockResolvedValueOnce(mockResult);

      const result = await userController.updateProfileUser(mockId, dto);

      expect(result).toEqual(mockResult);
      expect(userService.updateAccountUser).toHaveBeenCalledWith(mockId, dto);
    });
  });

  describe('deleteUser', () => {
    it('should call userService.deleteUserAccount and return deleted user', async () => {
      const mockId = 1;
      const mockResult = { id: mockId, name: 'User1' };

      mockUserService.deleteUserAccount.mockResolvedValueOnce(mockResult);

      const result = await userController.deleteUserAccount(mockId);

      expect(result).toEqual(mockResult);
      expect(userService.deleteUserAccount).toHaveBeenCalledWith(mockId);
    });
  });
});
