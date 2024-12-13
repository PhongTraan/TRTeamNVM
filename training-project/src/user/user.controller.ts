import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { User } from '@prisma/client';
import {
  createUserDto,
  updateProfileUserDto,
  UserFilerType,
  UserPaginationResponseType,
} from 'src/dto/user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Post('register')
  createUser(@Body() body: createUserDto): Promise<User> {
    return this.userService.createAccountUser(body);
  }

  @Get('getAllUser')
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
    return this, this.userService.updateAccountUser(id, data);
  }
}
