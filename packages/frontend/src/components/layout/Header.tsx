import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Bell, Mail, Search, User, Menu } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <button className="md:hidden mr-4" aria-label="Open menu">
            <Menu size={24} />
          </button>
          
          <Link href="/feed" className="text-2xl font-bold text-primary-500">
            SocialNet
          </Link>
        </div>
        
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              className="input pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="btn-ghost p-2 rounded-full relative" aria-label="Notifications">
            <Bell size={20} />
            <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
          </button>
          
          <button className="btn-ghost p-2 rounded-full relative" aria-label="Messages">
            <Mail size={20} />
            <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
          </button>
          
          <div className="relative">
            <button 
              className="flex items-center" 
              onClick={toggleProfileMenu}
              aria-expanded={isProfileMenuOpen}
            >
              <div className="h-8 w-8 rounded-full overflow-hidden">
                {user?.profileImage ? (
                  <Image
                    src={user.profileImage}
                    alt="Profile"
                    width={32}
                    height={32}
                  />
                ) : (
                  <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                    <User size={16} />
                  </div>
                )}
              </div>
            </button>
            
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 animate-fade-in">
                <Link href={`/profile/${user?.username}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Your Profile
                </Link>
                <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Settings
                </Link>
                <button 
                  onClick={() => logout()}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}