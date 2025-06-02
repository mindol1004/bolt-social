import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/features/auth/context/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

type LayoutProps = {
  children: ReactNode;
};

const authExemptRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  const isAuthRoute = authExemptRoutes.includes(router.pathname);
  const showNavigation = isAuthenticated && !isAuthRoute;

  return (
    <div className="min-h-screen flex flex-col">
      {showNavigation && <Header />}
      
      <div className="flex flex-1">
        {showNavigation && (
          <div className="hidden md:block w-64 flex-shrink-0">
            <Sidebar />
          </div>
        )}
        
        <main className={`flex-1 ${showNavigation ? 'pb-16 md:pb-0' : ''}`}>
          {children}
        </main>
      </div>
      
      {showNavigation && <MobileNav className="md:hidden" />}
    </div>
  );
}