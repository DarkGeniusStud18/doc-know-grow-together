
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/lib/auth/types';

export interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  register: (email: string, password: string, role: UserRole, displayName: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<{ error: any }>;
  logout: (redirectPath?: string) => Promise<void>;
  updateCurrentUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to convert Supabase user to our custom User type
  const convertToCustomUser = async (supabaseUser: any): Promise<User | null> => {
    if (!supabaseUser) return null;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error || !profile) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return {
        id: supabaseUser.id,
        email: supabaseUser.email || profile.email,
        displayName: profile.display_name,
        role: profile.role,
        kycStatus: profile.kyc_status,
        profileImage: profile.profile_image,
        university: profile.university,
        specialty: profile.specialty,
        subscriptionStatus: profile.subscription_status,
        subscriptionExpiry: profile.subscription_expiry ? new Date(profile.subscription_expiry) : null,
        createdAt: new Date(profile.created_at),
        updatedAt: profile.updated_at ? new Date(profile.updated_at) : undefined,
      };
    } catch (error) {
      console.error('Error converting user:', error);
      return null;
    }
  };

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session?.user) {
        const customUser = await convertToCustomUser(session.user);
        setUser(customUser);
      }
      
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      
      if (session?.user) {
        const customUser = await convertToCustomUser(session.user);
        setUser(customUser);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName
        }
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const register = async (email: string, password: string, role: UserRole, displayName: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            role: role
          }
        }
      });
      
      if (error) {
        console.error('Registration error:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const login = signIn; // Alias for compatibility

  const logout = async (redirectPath?: string) => {
    await signOut();
    if (redirectPath && typeof window !== 'undefined') {
      window.location.href = redirectPath;
    }
  };

  const updateCurrentUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    register,
    login,
    logout,
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
