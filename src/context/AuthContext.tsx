
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/lib/auth/types';
import { AuthContextProps } from './auth/types';
import { convertToCustomUser } from './auth/utils/userConverter';
import { getDemoUser } from './auth/utils/demoUsers';
import { useAuthOperations } from './auth/hooks/useAuthOperations';

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const authOperations = useAuthOperations(setUser, setSession);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Check for demo user first
        const demoUser = localStorage.getItem('demoUser');
        if (demoUser && mounted) {
          if (demoUser === 'student') {
            setUser(getDemoUser('student'));
          } else if (demoUser === 'professional') {
            setUser(getDemoUser('professional'));
          }
          setLoading(false);
          return;
        }

        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        if (session?.user && mounted) {
          console.log('Found existing session, converting user...');
          const customUser = await convertToCustomUser(session.user);
          if (customUser) {
            setSession(session);
            setUser(customUser);
            console.log('User authenticated and profile loaded');
          } else {
            console.error('Failed to convert user, signing out...');
            await supabase.auth.signOut();
          }
        }

        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Initialize auth state
    initializeAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.id);
      
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        return;
      }

      setSession(session);
      
      if (session?.user) {
        try {
          console.log('Converting user after auth state change...');
          const customUser = await convertToCustomUser(session.user);
          if (customUser) {
            setUser(customUser);
            console.log('User profile loaded successfully');
          } else {
            console.error('Failed to load user profile');
            setUser(null);
          }
        } catch (error) {
          console.error('Error converting user:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const updateCurrentUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    session,
    loading,
    ...authOperations,
    updateCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
