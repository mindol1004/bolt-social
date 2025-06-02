import { User } from './user';
import { Reaction } from './reaction';

export type Comment = {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  parentId?: string;
  isEdited: boolean;
  editedAt?: string;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  author: User;
  parent?: Comment;
  replies?: Comment[];
  reactions?: Reaction[];
  
  // Counts
  _count?: {
    replies: number;
    reactions: number;
  };
};