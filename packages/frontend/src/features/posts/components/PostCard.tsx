import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark } from 'lucide-react';
import { Post } from '@/types/post';
import { useAuth } from '@/features/auth/context/AuthContext';

type PostCardProps = {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
};

export default function PostCard({ post, onLike, onComment, onShare }: PostCardProps) {
  const { user } = useAuth();
  const [showActions, setShowActions] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    if (onLike) onLike(post.id);
  };
  
  const handleSave = () => {
    setIsSaved(!isSaved);
  };
  
  const handleComment = () => {
    if (onComment) onComment(post.id);
  };
  
  const handleShare = () => {
    if (onShare) onShare(post.id);
  };
  
  const toggleActions = () => {
    setShowActions(!showActions);
  };
  
  return (
    <div className="card mb-4 overflow-hidden">
      {/* Post Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <Link href={`/profile/${post.author.username}`} className="flex items-center">
            <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
              {post.author.profileImage ? (
                <Image
                  src={post.author.profileImage}
                  alt={post.author.displayName || post.author.username}
                  width={40}
                  height={40}
                  className="object-cover h-full w-full"
                />
              ) : (
                <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                  <span className="text-gray-500 font-medium">
                    {(post.author.displayName || post.author.username).charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div>
              <div className="font-medium">
                {post.author.displayName || post.author.username}
                {post.author.isVerified && (
                  <span className="inline-block ml-1 text-primary-500">✓</span>
                )}
              </div>
              <div className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </div>
            </div>
          </Link>
        </div>
        
        <div className="relative">
          <button
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={toggleActions}
            aria-label="More options"
          >
            <MoreHorizontal size={20} className="text-gray-500" />
          </button>
          
          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Report post
              </button>
              {user && post.author.id === user.id && (
                <>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Edit post
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                    Delete post
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Post Content */}
      <div className="mb-4">
        <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
      </div>
      
      {/* Post Media */}
      {post.mediaFiles && post.mediaFiles.length > 0 && (
        <div className="mb-4 -mx-4">
          {post.mediaFiles[0].type === 'IMAGE' ? (
            <div className="relative aspect-video">
              <Image
                src={post.mediaFiles[0].url}
                alt={post.mediaFiles[0].altText || ''}
                layout="fill"
                objectFit="cover"
              />
            </div>
          ) : post.mediaFiles[0].type === 'VIDEO' ? (
            <video
              src={post.mediaFiles[0].url}
              controls
              className="w-full rounded-none"
              poster={post.mediaFiles[0].thumbnailUrl}
            />
          ) : null}
        </div>
      )}
      
      {/* Post Stats */}
      <div className="flex justify-between items-center py-2 text-sm text-gray-500 border-t border-b border-gray-100">
        <div>{post._count?.reactions || 0} likes</div>
        <div className="flex space-x-4">
          <span>{post._count?.comments || 0} comments</span>
          <span>{post._count?.shares || 0} shares</span>
        </div>
      </div>
      
      {/* Post Actions */}
      <div className="flex justify-between mt-3">
        <button
          className={`flex items-center justify-center py-2 px-4 rounded-md transition ${
            isLiked
              ? 'text-primary-500'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={handleLike}
        >
          <Heart size={20} className={isLiked ? 'fill-current' : ''} />
          <span className="ml-2">Like</span>
        </button>
        
        <button
          className="flex items-center justify-center py-2 px-4 rounded-md text-gray-600 hover:bg-gray-100 transition"
          onClick={handleComment}
        >
          <MessageCircle size={20} />
          <span className="ml-2">Comment</span>
        </button>
        
        <button
          className="flex items-center justify-center py-2 px-4 rounded-md text-gray-600 hover:bg-gray-100 transition"
          onClick={handleShare}
        >
          <Share2 size={20} />
          <span className="ml-2">Share</span>
        </button>
        
        <button
          className={`flex items-center justify-center py-2 px-4 rounded-md transition ${
            isSaved
              ? 'text-primary-500'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={handleSave}
        >
          <Bookmark size={20} className={isSaved ? 'fill-current' : ''} />
          <span className="ml-2">Save</span>
        </button>
      </div>
    </div>
  );
}