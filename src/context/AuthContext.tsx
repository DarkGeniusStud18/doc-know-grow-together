
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
  login: (email: string, password: string) => Promise<boolean>;
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

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Login attempt for:', email);
      
      // Check if it's a demo user
      if ((email === 'student@example.com' || email === 'doctor@example.com') && password === 'password') {
        console.log('Demo user detected');
        
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Set demo user in localStorage
        if (email === 'student@example.com') {
          localStorage.setItem('demoUser', 'student');
        } else {
          localStorage.setItem('demoUser', 'professional');
        }
        
        // Create demo user object
        const demoUser: User = email === 'student@example.com' ? {
          id: "student-1",
          email: "student@example.com",
          displayName: "Alex Dupont",
          role: "student",
          kycStatus: "verified",
          university: "Université Paris Descartes",
          subscriptionStatus: "free",
          createdAt: new Date(),
          updatedAt: new Date(),
        } : {
          id: "professional-1",
          email: "doctor@example.com",
          displayName: "Dr. Marie Lambert",
          role: "professional",
          kycStatus: "verified",
          specialty: "Cardiologie",
          subscriptionStatus: "free",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        setUser(demoUser);
        console.log('Demo login successful');
        return true;
      }

      // Regular Supabase login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        return false;
      }

      if (!data.user) {
        console.error('No user returned from login');
        return false;
      }

      console.log('Supabase login successful');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
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
      // Check if it's a demo user
      const demoUser = localStorage.getItem('demoUser');
      if (demoUser) {
        localStorage.removeItem('demoUser');
        setUser(null);
        setSession(null);
        window.location.href = redirectUrl;
        return;
      }
      
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
        .eq('id', userId as any)
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
    login,
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
