import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { TokenService } from './token.service';
import { UsersService } from '../../users/services/users.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
    private usersService: UsersService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if user with email already exists
    const existingUserByEmail = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUserByEmail) {
      throw new ConflictException('Email already in use');
    }

    // Check if user with username already exists
    const existingUserByUsername = await this.prisma.user.findUnique({
      where: { username: registerDto.username },
    });

    if (existingUserByUsername) {
      throw new ConflictException('Username already in use');
    }

    // Hash password
    const passwordHash = await this.hashPassword(registerDto.password);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        username: registerDto.username,
        passwordHash,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        displayName: registerDto.displayName || registerDto.username,
      },
    });

    // Generate tokens
    const { accessToken, refreshToken } = await this.tokenService.generateTokens(user.id);

    // Store refresh token
    await this.tokenService.saveRefreshToken(refreshToken, user.id);

    // Return user and tokens
    return {
      user: this.usersService.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  async login(loginDto: LoginDto) {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Validate password
    const isPasswordValid = await this.validatePassword(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate tokens
    const { accessToken, refreshToken } = await this.tokenService.generateTokens(user.id);

    // Store refresh token
    await this.tokenService.saveRefreshToken(refreshToken, user.id);

    // Update last active time
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() },
    });

    // Return user and tokens
    return {
      user: this.usersService.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string, refreshToken: string) {
    // Revoke refresh token
    return this.tokenService.revokeRefreshToken(refreshToken);
  }

  async refreshToken(refreshToken: string) {
    // Validate refresh token and get new tokens
    return this.tokenService.refreshTokens(refreshToken);
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  private async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}