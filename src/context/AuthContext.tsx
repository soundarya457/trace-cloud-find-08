
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for existing user in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('traceCloudUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Mock login functionality - in real app, this would be a backend call
      if (email === 'admin@tracecloud.rit.edu' && password === 'admin123') {
        const adminUser: User = {
          id: '1',
          name: 'Admin User',
          email: 'admin@tracecloud.rit.edu',
          role: 'admin',
        };
        setUser(adminUser);
        localStorage.setItem('traceCloudUser', JSON.stringify(adminUser));
        return true;
      } else if (email === 'student@rit.edu' && password === 'student123') {
        const studentUser: User = {
          id: '2',
          name: 'Student User',
          email: 'student@rit.edu',
          role: 'student',
        };
        setUser(studentUser);
        localStorage.setItem('traceCloudUser', JSON.stringify(studentUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('traceCloudUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
