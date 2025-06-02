import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Image as ImageIcon, Video, Link2, Users, X } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import Image from 'next/image';

type FormData = {
  content: string;
  visibility: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE';
};

type CreatePostFormProps = {
  onSubmit: (data: FormData, mediaFiles?: File[]) => Promise<void>;
};

export default function CreatePostForm({ onSubmit }: CreatePostFormProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { register, handleSubmit, reset, watch, setValue } = useForm<FormData>({
    defaultValues: {
      content: '',
      visibility: 'PUBLIC',
    },
  });
  
  const content = watch('content');
  const visibility = watch('visibility');
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles([...selectedFiles, ...newFiles]);
      
      // Generate previews
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };
  
  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };
  
  const triggerFileInput = (type: 'image' | 'video') => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'image' ? 'image/*' : 'video/*';
      fileInputRef.current.click();
    }
  };
  
  const handleFormSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data, selectedFiles);
      reset();
      setSelectedFiles([]);
      setPreviews([]);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="card mb-6">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="flex items-start mb-4">
          <div className="h-10 w-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
            {user?.profileImage ? (
              <Image
                src={user.profileImage}
                alt={user.displayName || user.username}
                width={40}
                height={40}
                className="object-cover h-full w-full"
              />
            ) : (
              <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                <span className="text-gray-500 font-medium">
                  {user ? (user.displayName || user.username).charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
            )}
          </div>
          
          <textarea
            className="flex-1 p-3 bg-gray-50 rounded-lg resize-none min-h-[100px] focus:outline-none focus:ring-1 focus:ring-primary-500 border border-gray-200"
            placeholder={`What's on your mind, ${user?.firstName || user?.username}?`}
            {...register('content', { required: true })}
          />
        </div>
        
        {/* Media previews */}
        {previews.length > 0 && (
          <div className="mb-4 grid grid-cols-2 gap-2">
            {previews.map((preview, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden">
                {selectedFiles[index].type.startsWith('image/') ? (
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <video 
                    src={preview} 
                    controls 
                    className="w-full h-40 object-cover"
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full p-1 text-white"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex flex-col md:flex-row md:items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex space-x-2 mb-3 md:mb-0">
            <button
              type="button"
              className="flex items-center text-gray-600 hover:bg-gray-100 rounded-md px-3 py-1.5 text-sm"
              onClick={() => triggerFileInput('image')}
            >
              <ImageIcon size={18} className="mr-1.5" />
              <span>Photo</span>
            </button>
            
            <button
              type="button"
              className="flex items-center text-gray-600 hover:bg-gray-100 rounded-md px-3 py-1.5 text-sm"
              onClick={() => triggerFileInput('video')}
            >
              <Video size={18} className="mr-1.5" />
              <span>Video</span>
            </button>
            
            <button
              type="button"
              className="flex items-center text-gray-600 hover:bg-gray-100 rounded-md px-3 py-1.5 text-sm"
            >
              <Link2 size={18} className="mr-1.5" />
              <span>Link</span>
            </button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
          
          <div className="flex items-center">
            <div className="relative mr-3">
              <button
                type="button"
                className="flex items-center text-gray-600 hover:bg-gray-100 rounded-md px-3 py-1.5 text-sm"
                onClick={() => {
                  // Toggle visibility menu
                }}
              >
                <Users size={18} className="mr-1.5" />
                <span>
                  {visibility === 'PUBLIC' ? 'Public' : 
                   visibility === 'FRIENDS_ONLY' ? 'Friends' : 'Only me'}
                </span>
              </button>
              
              {/* Visibility dropdown menu (hidden by default) */}
            </div>
            
            <button
              type="submit"
              className="btn btn-primary px-4"
              disabled={isLoading || !content.trim()}
            >
              {isLoading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}