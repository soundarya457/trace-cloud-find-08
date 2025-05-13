
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { Session } from '@supabase/supabase-js';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
              // Determine the role - get from database or fallback to email check
              let userRole = profile.role as 'admin' | 'student';
              
              // Double-check the role based on email if needed
              const email = currentSession.user.email || '';
              const isAdminEmail = email.endsWith('@tracecloud.rit.edu') || email.endsWith('ritchennai.edu.in');
              
              if (isAdminEmail && userRole !== 'admin') {
                // This is a safety check in case the database wasn't updated correctly
                userRole = 'admin';
              }

              setUser({
                id: currentSession.user.id,
                name: profile.name,
                email: profile.email,
                role: userRole,
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
              // Determine the role - get from database or fallback to email check
              let userRole = profile.role as 'admin' | 'student';
              
              // Double-check the role based on email if needed
              const email = currentSession.user.email || '';
              const isAdminEmail = email.endsWith('@tracecloud.rit.edu') || email.endsWith('ritchennai.edu.in');
              
              if (isAdminEmail && userRole !== 'admin') {
                // This is a safety check in case the database wasn't updated correctly
                userRole = 'admin';
              }

              setUser({
                id: currentSession.user.id,
                name: profile.name,
                email: profile.email,
                role: userRole,
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

  return {
    user,
    session,
    isLoading,
  };
}
