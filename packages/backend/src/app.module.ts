import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './domains/auth/auth.module';
import { UsersModule } from './domains/users/users.module';
import { PostsModule } from './domains/posts/posts.module';
import { CommentsModule } from './domains/comments/comments.module';
import { MediaModule } from './domains/media/media.module';
import { FollowsModule } from './domains/follows/follows.module';
import { NotificationsModule } from './domains/notifications/notifications.module';
import { MessagesModule } from './domains/messages/messages.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    MediaModule,
    FollowsModule,
    NotificationsModule,
    MessagesModule,
  ],
})
export class AppModule {}