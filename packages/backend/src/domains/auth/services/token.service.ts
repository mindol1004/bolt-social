import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { TokenPayload } from '../interfaces/token-payload.interface';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async generateTokens(userId: string) {
    const payload: TokenPayload = { sub: userId };

    // Generate access token
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION') || '15m',
    });

    // Generate refresh token
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async saveRefreshToken(token: string, userId: string) {
    // Hash the token for security
    const hashedToken = await this.hashToken(token);
    
    // Calculate expiration date
    const expiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d';
    const expiresAt = this.calculateExpiryDate(expiresIn);

    // Save token to database
    await this.prisma.refreshToken.create({
      data: {
        token: hashedToken,
        userId,
        expiresAt,
      },
    });

    return true;
  }

  async refreshTokens(refreshToken: string) {
    try {
      // Verify the token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const userId = payload.sub;

      // Check if token exists in database
      const hashedToken = await this.hashToken(refreshToken);
      const tokenRecord = await this.prisma.refreshToken.findFirst({
        where: {
          token: hashedToken,
          userId,
          isRevoked: false,
          expiresAt: {
            gt: new Date(),
          },
        },
      });

      if (!tokenRecord) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Revoke the current token
      await this.prisma.refreshToken.update({
        where: { id: tokenRecord.id },
        data: { isRevoked: true },
      });

      // Generate new tokens
      const tokens = await this.generateTokens(userId);
      
      // Save new refresh token
      await this.saveRefreshToken(tokens.refreshToken, userId);

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async revokeRefreshToken(token: string) {
    try {
      const hashedToken = await this.hashToken(token);
      
      await this.prisma.refreshToken.updateMany({
        where: {
          token: hashedToken,
          isRevoked: false,
        },
        data: {
          isRevoked: true,
        },
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  async validateToken(token: string): Promise<TokenPayload> {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async hashToken(token: string): Promise<string> {
    // Use a simple hash function as we don't need to verify it later
    return bcrypt.hashSync(token, 5);
  }

  private calculateExpiryDate(expiresIn: string): Date {
    const now = new Date();
    const units = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1), 10);

    switch (units) {
      case 'd':
        now.setDate(now.getDate() + value);
        break;
      case 'h':
        now.setHours(now.getHours() + value);
        break;
      case 'm':
        now.setMinutes(now.getMinutes() + value);
        break;
      case 's':
        now.setSeconds(now.getSeconds() + value);
        break;
      default:
        now.setDate(now.getDate() + 7); // Default: 7 days
    }

    return now;
  }
}