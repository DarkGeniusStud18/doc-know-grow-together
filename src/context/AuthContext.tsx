
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
  const [initialized, setInitialized] = useState(false);

  const authOperations = useAuthOperations(setUser, setSession);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Check for demo user first
        const demoUser = localStorage.getItem('demoUser');
        if (demoUser && mounted) {
          console.log('Found demo user:', demoUser);
          if (demoUser === 'student') {
            setUser(getDemoUser('student'));
          } else if (demoUser === 'professional') {
            setUser(getDemoUser('professional'));
          }
          setLoading(false);
          setInitialized(true);
          return;
        }

        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setLoading(false);
            setInitialized(true);
          }
          return;
        }

        if (session?.user && mounted) {
          console.log('Found existing session, converting user...');
          setSession(session);
          
          try {
            const customUser = await convertToCustomUser(session.user);
            if (customUser && mounted) {
              setUser(customUser);
              console.log('User authenticated and profile loaded');
            } else if (mounted) {
              console.error('Failed to convert user');
              setUser(null);
              setSession(null);
            }
          } catch (conversionError) {
            console.error('Error converting user:', conversionError);
            if (mounted) {
              setUser(null);
              setSession(null);
            }
          }
        }

        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.id);
      
      if (!mounted || !initialized) return;

      if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        localStorage.removeItem('demoUser');
        return;
      }

      if (event === 'SIGNED_IN' && session?.user) {
        setSession(session);
        
        try {
          console.log('Converting user after auth state change...');
          const customUser = await convertToCustomUser(session.user);
          if (customUser && mounted) {
            setUser(customUser);
            console.log('User profile loaded successfully');
          } else if (mounted) {
            console.error('Failed to load user profile');
            setUser(null);
          }
        } catch (error) {
          console.error('Error converting user:', error);
          if (mounted) {
            setUser(null);
          }
        }
      }

      if (event === 'TOKEN_REFRESHED' && session) {
        console.log('Token refreshed successfully');
        setSession(session);
        if (session.user && !user && mounted) {
          try {
            const customUser = await convertToCustomUser(session.user);
            if (customUser) {
              setUser(customUser);
            }
          } catch (error) {
            console.error('Error refreshing user profile:', error);
          }
        }
      }
    });

    // Initialize auth state
    initializeAuth();

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
    updateCurrentUser,
    // Add legacy method aliases for backward compatibility
    signUp: authOperations.signUpWithEmail,
    signIn: authOperations.signInWithEmail,
    signOut: authOperations.signOut,
    register: async (email: string, password: string, role: any, displayName: string) => {
      const result = await authOperations.signUpWithEmail(email, password, { display_name: displayName, role });
      return !result.error;
    },
    login: async (email: string, password: string) => {
      const result = await authOperations.signInWithEmail(email, password);
      return !result.error;
    },
    logout: async (redirectPath?: string) => {
      await authOperations.signOut();
    }
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
