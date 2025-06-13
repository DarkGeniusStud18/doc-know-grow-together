
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface AuthUser extends User {
  displayName: string;
  profileImage?: string;
  role: 'student' | 'professional';
  kycStatus: 'not_submitted' | 'pending' | 'verified' | 'rejected';
  university?: string;
  specialty?: string;
  createdAt: Date;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  logout: (redirectPath?: string) => void;
  updateCurrentUser: (updates: Partial<AuthUser>) => void;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string; user?: AuthUser | null }>;
  signInAsDemo: (type: 'student' | 'professional') => Promise<{ error?: string; user?: AuthUser | null }>;
  register: (email: string, password: string, role: 'student' | 'professional', displayName: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (authUser: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        setLoading(false);
        return;
      }

      const authUserWithProfile: AuthUser = {
        ...authUser,
        displayName: profile?.display_name || authUser.email?.split('@')[0] || 'User',
        profileImage: profile?.profile_image,
        role: profile?.role || 'student',
        kycStatus: profile?.kyc_status || 'not_submitted',
        university: profile?.university,
        specialty: profile?.specialty,
        createdAt: profile?.created_at ? new Date(profile.created_at) : new Date()
      };

      setUser(authUserWithProfile);
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        await loadUserProfile(data.user);
        return { user };
      }

      return { error: 'Login failed' };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const signInAsDemo = async (type: 'student' | 'professional') => {
    try {
      // Demo login logic - you can implement this based on your needs
      const demoEmail = type === 'student' ? 'demo.student@example.com' : 'demo.professional@example.com';
      const demoPassword = 'demo123456';
      
      return await signInWithEmail(demoEmail, demoPassword);
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const register = async (email: string, password: string, role: 'student' | 'professional', displayName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
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
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const logout = (redirectPath?: string) => {
    signOut().then(() => {
      if (redirectPath) {
        window.location.href = redirectPath;
      }
    });
  };

  const updateCurrentUser = (updates: Partial<AuthUser>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signOut, 
      logout, 
      updateCurrentUser,
      signInWithEmail,
      signInAsDemo,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
