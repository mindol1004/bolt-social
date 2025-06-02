import { User } from './user';
import { MediaFile } from './mediaFile';
import { Comment } from './comment';
import { Reaction } from './reaction';

export type PostVisibility = 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE';
export type PostType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'LINK' | 'POLL';

export type Post = {
  id: string;
  content?: string;
  type: PostType;
  visibility: PostVisibility;
  authorId: string;
  linkUrl?: string;
  linkTitle?: string;
  linkDescription?: string;
  tags?: string[];
  mentionedUsers?: string[];
  isEdited: boolean;
  editedAt?: string;
  isPinned: boolean;
  scheduledAt?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  author: User;
  mediaFiles?: MediaFile[];
  comments?: Comment[];
  reactions?: Reaction[];
  originalPost?: Post;
  
  // Counts
  _count?: {
    comments: number;
    reactions: number;
    shares: number;
  };
};