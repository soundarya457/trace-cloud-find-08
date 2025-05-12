
import React, { createContext, useContext } from 'react';
import { User } from '@/types';
import { Session } from '@supabase/supabase-js';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthActions } from '@/hooks/useAuthActions';

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  session: Session | null;
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
  const { user, session, isLoading: stateLoading } = useAuthState();
  const { login, signup, logout, isLoading: actionLoading } = useAuthActions();
  
  // Combine loading states - if either state loading or action loading is true, then we're loading
  const isLoading = stateLoading || actionLoading;

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, session }}>
      {children}
    </AuthContext.Provider>
  );
};
