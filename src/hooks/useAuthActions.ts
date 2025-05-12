
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { Session } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';

export function useAuthActions() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

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
              variant: "default",
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
  };

  return {
    login,
    signup,
    logout,
    isLoading,
  };
}
