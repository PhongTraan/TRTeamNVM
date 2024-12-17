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
import { Role, User } from '@prisma/client';
import {
  createUserDto,
  updateProfileUserDto,
  UserFilerType,
  UserPaginationResponseType,
} from 'src/dto/user.dto';
import { UserService } from './user.service';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  // @Post('register')
  // createUser(@Body() body: createUserDto): Promise<User> {
  //   return this.userService.createAccountUser(body);
  // }

  @Get('getAllUser')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN')
  getAllUser(
    @Query() param: UserFilerType,
  ): Promise<UserPaginationResponseType> {
    return this.userService.getAllUser(param);
  }

  @Get(':id')
  getDetailsId(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.getDetailsUser(id);
  }

  @Put(':id')
  updateProfileUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: updateProfileUserDto,
  ): Promise<User> {
    return this.userService.updateAccountUser(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN')
  deleteUserAccount(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.deleteUserAccount(id);
  }
}
