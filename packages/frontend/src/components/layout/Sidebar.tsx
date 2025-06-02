import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, User, Users, Bookmark, Settings, MessageCircle } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';

export default function Sidebar() {
  const router = useRouter();
  const { user } = useAuth();
  
  const navItems = [
    { icon: Home, label: 'Feed', href: '/feed' },
    { icon: User, label: 'Profile', href: `/profile/${user?.username}` },
    { icon: Users, label: 'Friends', href: '/friends' },
    { icon: MessageCircle, label: 'Messages', href: '/messages' },
    { icon: Bookmark, label: 'Saved', href: '/saved' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];
  
  return (
    <div className="h-full bg-white border-r border-gray-200 p-4">
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = router.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-primary-500' : 'text-gray-500'} />
              <span className="ml-3">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}