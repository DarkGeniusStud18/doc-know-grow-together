
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/lib/auth/types';
import { hasData, hasError } from '@/lib/utils/type-guards';

interface AuthContextProps {
  user: User | null;
  session: any | null;
  loading: boolean;
  signUp: (data: any) => Promise<any>;
  signIn: (data: any) => Promise<any>;
  signOut: () => Promise<void>;
  logout: (redirectUrl?: string) => Promise<void>;
  updateCurrentUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

      setSession(session);

      if (session) {
        const userProfile = await getUserProfile(session.user.id);
        setUser(userProfile);
      }
      setLoading(false);
    };

    loadSession();

    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session) {
        getUserProfile(session.user.id).then(userProfile => {
          setUser(userProfile);
        });
      } else {
        setUser(null);
      }
    });
  }, []);

  const signUp = async (data: any) => {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            display_name: data.displayName,
            role: data.role,
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        return { error: error.message };
      }

      return authData;
    } catch (err) {
      console.error('Signup error:', err);
      return { error: 'Failed to signup' };
    }
  };

  const signIn = async (data: any) => {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        console.error('Signin error:', error);
        return { error: error.message };
      }

      return authData;
    } catch (err) {
      console.error('Signin error:', err);
      return { error: 'Failed to signin' };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Signout error:', error);
    }
  };

  const logout = async (redirectUrl: string = '/login') => {
    try {
      await signOut();
      window.location.href = redirectUrl;
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getUserProfile = async (userId: string): Promise<User | null> => {
    try {
      const response = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (hasError(response)) {
        console.error('Error fetching user profile:', response.error);
        return null;
      }

      if (!hasData(response)) {
        console.error('No profile data found');
        return null;
      }

      const profile = response.data;
      
      // Validate that we have the required profile data
      if (!profile || typeof profile.id !== 'string' || typeof profile.display_name !== 'string') {
        console.error('Invalid profile data structure');
        return null;
      }

      return {
        id: profile.id,
        email: profile.email || '',
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
      console.error('Error in getUserProfile:', error);
      return null;
    }
  };

  const updateCurrentUser = (updates: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      return { ...prevUser, ...updates };
    });
  };

  const value: AuthContextProps = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    logout,
    updateCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
