import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: User) {
    return user;
  }

  @Get(':id')
  async getUser(@Param('id') id: string, @CurrentUser() currentUser?: User) {
    try {
      return await this.usersService.getUserProfile(
        id,
        currentUser?.id,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      // Try getting by username instead
      return this.getUserByUsername(id, currentUser);
    }
  }

  @Get('username/:username')
  async getUserByUsername(
    @Param('username') username: string,
    @CurrentUser() currentUser?: User,
  ) {
    const user = await this.usersService.findByUsername(username);
    return this.usersService.getUserProfile(
      user.id,
      currentUser?.id,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: User,
  ) {
    // Only allow users to update their own profile
    if (id !== user.id) {
      throw new NotFoundException('User not found');
    }

    return this.usersService.update(id, updateUserDto);
  }
}