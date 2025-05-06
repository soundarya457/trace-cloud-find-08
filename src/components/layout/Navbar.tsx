
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { UserRound, MessageSquare, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="bg-purple-dark shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to={user ? '/dashboard' : '/'} className="flex items-center">
            <span className="text-white text-xl font-bold">TRACE CLOUD</span>
          </Link>

          <div className="hidden md:flex space-x-4">
            {user && (
              <>
                <Link to="/dashboard" className="text-white hover:text-purple-light">
                  Dashboard
                </Link>
                <Link to="/lost-found" className="text-white hover:text-purple-light">
                  Lost and Found
                </Link>
                <Link to="/post-item" className="text-white hover:text-purple-light">
                  Post an Item
                </Link>
                <Link to="/about" className="text-white hover:text-purple-light">
                  About
                </Link>
                <Link to="/contact" className="text-white hover:text-purple-light">
                  Contact Us
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-white hover:text-purple-light">
                    Admin Panel
                  </Link>
                )}
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/feedback" className="text-white hover:text-purple-light flex items-center">
                  <MessageSquare className="h-5 w-5 mr-1" />
                  <span className="hidden sm:inline">Feedback</span>
                </Link>
                <div className="hidden md:flex items-center text-white">
                  <UserRound className="h-5 w-5 mr-1" />
                  <span>{user.name}</span>
                </div>
                <Button variant="ghost" className="text-white" onClick={logout}>
                  <LogOut className="h-5 w-5 mr-1" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <Link to="/">
                <Button variant="secondary">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
