export type MediaType = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT';

export type MediaFile = {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  type: MediaType;
  size: number;
  width?: number;
  height?: number;
  duration?: number;
  thumbnailUrl?: string;
  altText?: string;
  postId?: string;
  messageId?: string;
  uploadedAt: string;
};