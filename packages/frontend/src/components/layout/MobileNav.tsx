import { Home, User, Users, MessageCircle, Menu } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/features/auth/context/AuthContext';

type MobileNavProps = {
  className?: string;
};

export default function MobileNav({ className = '' }: MobileNavProps) {
  const router = useRouter();
  const { user } = useAuth();
  
  const navItems = [
    { icon: Home, label: 'Feed', href: '/feed' },
    { icon: Users, label: 'Friends', href: '/friends' },
    { icon: MessageCircle, label: 'Messages', href: '/messages' },
    { icon: User, label: 'Profile', href: `/profile/${user?.username}` },
    { icon: Menu, label: 'More', href: '/more' },
  ];
  
  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 ${className}`}>
      <nav className="flex justify-around">
        {navItems.map((item) => {
          const isActive = router.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center py-2 px-3"
            >
              <Icon 
                size={24} 
                className={isActive ? 'text-primary-500' : 'text-gray-500'} 
              />
              <span className={`text-xs mt-1 ${isActive ? 'text-primary-500 font-medium' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}