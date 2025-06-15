
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/lib/auth/types';
import { getCurrentUser } from '@/lib/auth/user-service';

export type { User as AuthUser }; // Re-export for compatibility

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkUserSession = async () => {
      setLoading(true);
      const currentUser = await getCurrentUser();
      if (isMounted) {
        setUser(currentUser);
        setLoading(false);
      }
    };

    checkUserSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      console.log(`Supabase auth event: ${event}`);

      if (event === 'SIGNED_OUT') {
        // Also clear demo user from local storage
        if(localStorage.getItem('demoUser')) {
          localStorage.removeItem('demoUser');
        }
        setUser(null);
      } else if (session) {
        // SIGNED_IN, TOKEN_REFRESHED, USER_UPDATED, etc. will have a session.
        const currentUser = await getCurrentUser();
        if (isMounted) {
          setUser(currentUser);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return {
    user,
    loading,
  };
};
