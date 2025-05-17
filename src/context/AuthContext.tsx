
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/lib/auth/types';
import { getCurrentUser, signIn } from '@/lib/auth';
import { signOut } from '@/lib/auth/services/auth-signout';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { checkPremiumStatus } from '@/lib/auth/services/subscription-service';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: (redirectUrl?: string) => Promise<void>;
  register: (email: string, password: string, role: UserRole, displayName: string) => Promise<boolean>;
  updateCurrentUser: (updatedUser: User) => void;
  checkPremiumAccess: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Set up auth state listener FIRST
  useEffect(() => {
    console.log('Setting up auth state listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change event:', event, 'Session:', !!session);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // When signed in or token refreshed, update user
          // We use setTimeout to prevent auth deadlocks
          setTimeout(async () => {
            try {
              const currentUser = await getCurrentUser();
              setUser(currentUser);
              console.log('User signed in:', currentUser);
            } catch (error) {
              console.error('Error getting current user:', error);
            }
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('demoUser');
          console.log('User signed out');
        } else if (event === 'USER_UPDATED') {
          // We use setTimeout to prevent auth deadlocks
          setTimeout(async () => {
            try {
              const currentUser = await getCurrentUser();
              setUser(currentUser);
              console.log('User updated:', currentUser);
            } catch (error) {
              console.error('Error getting updated user:', error);
            }
          }, 0);
        } else if (event === 'PASSWORD_RECOVERY') {
          // Pass the token to the password recovery page
          window.location.href = `/password-recovery${window.location.search}`;
        }
      }
    );

    // Check for existing session
    const checkUser = async () => {
      try {
        console.log('Initial session check...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
          setLoading(false);
          return;
        }
        
        if (data.session) {
          console.log('Session found, fetching user data');
          const currentUser = await getCurrentUser();
          setUser(currentUser);
          console.log('Initial user check:', currentUser);
        } else {
          // Check if we have a demo user in localStorage
          const demoUser = localStorage.getItem('demoUser');
          if (demoUser) {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
            console.log('Demo user found:', currentUser);
          } else {
            console.log('No valid session found');
          }
        }
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Handle demo accounts
      if (email === "student@example.com" && password === "password") {
        localStorage.setItem('demoUser', 'student');
      } else if (email === "doctor@example.com" && password === "password") {
        localStorage.setItem('demoUser', 'professional');
      }
      
      const user = await signIn(email, password);
      if (user) {
        setUser(user);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Erreur de connexion', {
        description: error.message || 'Veuillez vérifier vos identifiants et réessayer.'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (redirectUrl?: string) => {
    try {
      setLoading(true);
      await signOut(redirectUrl || '/login');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, role: UserRole, displayName: string) => {
    try {
      setLoading(true);
      
      // Check if user exists
      const userExists = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();
        
      if (userExists.data) {
        toast.error('Un compte avec cette adresse email existe déjà');
        return false;
      }
      
      // Register the new user
      const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            role,
          },
          emailRedirectTo: `${window.location.origin}/email-confirmation`
        }
      });
      
      if (error) throw error;
      
      toast.success('Inscription réussie! Vérifiez votre email pour confirmer votre compte.');
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error('Erreur d\'inscription', {
        description: error.message || 'Veuillez réessayer plus tard.'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const updateCurrentUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  // Check if the user has premium access
  const checkPremiumAccess = async (): Promise<boolean> => {
    if (!user) return false;
    return checkPremiumStatus(user.id);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      register, 
      updateCurrentUser,
      checkPremiumAccess 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
