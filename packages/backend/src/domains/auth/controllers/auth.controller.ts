import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.register(registerDto);

    // Set refresh token in httpOnly cookie
    this.setRefreshTokenCookie(response, result.refreshToken);

    // Return user and access token
    return {
      user: result.user,
      accessToken: result.accessToken,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(loginDto);

    // Set refresh token in httpOnly cookie
    this.setRefreshTokenCookie(response, result.refreshToken);

    // Return user and access token
    return {
      user: result.user,
      accessToken: result.accessToken,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser() user: User,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh_token'];
    
    if (refreshToken) {
      await this.authService.logout(user.id, refreshToken);
    }
    
    // Clear refresh token cookie
    response.clearCookie('refresh_token');
    
    return { success: true };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh_token'];
    
    if (!refreshToken) {
      response.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Refresh token not found',
      });
      return;
    }
    
    try {
      const tokens = await this.authService.refreshToken(refreshToken);
      
      // Set new refresh token in httpOnly cookie
      this.setRefreshTokenCookie(response, tokens.refreshToken);
      
      // Return new access token
      return {
        accessToken: tokens.accessToken,
      };
    } catch (error) {
      // Clear cookie on error
      response.clearCookie('refresh_token');
      
      response.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Invalid refresh token',
      });
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: User) {
    // User is injected by the CurrentUser decorator
    return user;
  }

  private setRefreshTokenCookie(response: Response, token: string) {
    // Set refresh token as httpOnly cookie
    response.cookie('refresh_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only HTTPS in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/api/auth/refresh', // Only available to the refresh endpoint
    });
  }
}