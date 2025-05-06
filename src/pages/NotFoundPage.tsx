
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-light via-purple to-purple-dark p-4">
      <div className="max-w-md text-center">
        <h1 className="text-white text-9xl font-bold mb-4">404</h1>
        <h2 className="text-white text-3xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-white/80 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            variant="outline" 
            className="bg-white hover:bg-white/90 text-purple"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Link to={user ? '/dashboard' : '/'}>
            <Button className="bg-white hover:bg-white/90 text-purple w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4" />
              {user ? 'Dashboard' : 'Home'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
