
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';

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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Initialize auth state
  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        if (currentSession?.user) {
          // Get the user profile data
          setTimeout(async () => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentSession.user.id)
              .single();

            if (profile) {
              setUser({
                id: currentSession.user.id,
                name: profile.name,
                email: profile.email,
                role: profile.role as 'admin' | 'student',
              });
            }
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      if (currentSession?.user) {
        // Get the user profile data
        supabase
          .from('profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              setUser({
                id: currentSession.user.id,
                name: profile.name,
                email: profile.email,
                role: profile.role as 'admin' | 'student',
              });
            }
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login failed:', error.message);
        
        // Special handling for email not confirmed error
        if (error.message.includes('Email not confirmed')) {
          // Send another confirmation email
          const { error: resendError } = await supabase.auth.resend({
            type: 'signup',
            email: email,
          });
          
          if (resendError) {
            toast({
              title: "Login Failed",
              description: `Email not confirmed. We couldn't resend the confirmation email: ${resendError.message}`,
              variant: "destructive",
            });
          } else {
            toast({
              title: "Email Not Verified",
              description: "We've sent another verification email. Please check your inbox and verify your email before logging in.",
              variant: "default", // Changed from "warning" to "default" to match allowed variants
            });
          }
        } else {
          toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive",
          });
        }
        return false;
      }

      toast({
        title: "Login Successful",
        description: "Welcome to TRACE CLOUD",
      });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        console.error('Signup failed:', error.message);
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      // Check if email confirmation is required
      if (data?.user && !data?.session) {
        toast({
          title: "Signup Successful",
          description: "Please check your email for a confirmation link to complete your registration.",
        });
      } else {
        toast({
          title: "Signup Successful",
          description: "Your account has been created. You can now sign in.",
        });
      }
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, session }}>
      {children}
    </AuthContext.Provider>
  );
};
