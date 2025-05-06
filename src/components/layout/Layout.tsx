
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showSidebar = true }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        {user && showSidebar && (
          <Sidebar role={user.role} />
        )}
        <main className={`flex-1 p-6 ${user && showSidebar ? '' : 'container mx-auto'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
