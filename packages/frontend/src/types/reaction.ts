import { User } from './user';

export type ReactionType = 'LIKE' | 'LOVE' | 'LAUGH' | 'ANGRY' | 'SAD' | 'WOW';

export type Reaction = {
  id: string;
  type: ReactionType;
  userId: string;
  postId?: string;
  commentId?: string;
  createdAt: string;
  
  // Relations
  user: User;
};