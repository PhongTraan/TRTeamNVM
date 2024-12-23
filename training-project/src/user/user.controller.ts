import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import {
  updateProfileUserDto,
  UserFilerType,
  UserPaginationResponseType,
} from 'src/dto/user.dto';
import { UserService } from './user.service';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';

@Controller('users')
@UseGuards(AuthGuard, RoleGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('getAllUser')
  @Roles('ADMIN')
  getAllUser(
    @Query() param: UserFilerType,
  ): Promise<UserPaginationResponseType> {
    return this.userService.getAllUser(param);
  }

  @Get(':id')
  @Roles('ADMIN', 'USER')
  getDetailsId(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.getDetailsUser(id);
  }

  @Put(':id')
  @Roles('USER')
  updateProfileUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: updateProfileUserDto,
  ): Promise<User> {
    return this.userService.updateAccountUser(id, data);
  }

  @Delete(':id')
  @Roles('ADMIN')
  deleteUserAccount(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.deleteUserAccount(id);
  }
}
