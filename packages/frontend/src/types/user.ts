export type User = {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  profileImage?: string;
  coverImage?: string;
  bio?: string;
  website?: string;
  location?: string;
  birthDate?: string;
  isVerified: boolean;
  isPrivate: boolean;
  isActive: boolean;
  lastActiveAt?: string;
  createdAt: string;
  updatedAt: string;
};