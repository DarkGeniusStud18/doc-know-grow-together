
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/lib/auth/types';
import { getCurrentUser, signIn, signOut } from '@/lib/auth';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string, role: UserRole, displayName: string) => Promise<boolean>;
  updateCurrentUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
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

  const logout = async () => {
    try {
      setLoading(true);
      await signOut();
      localStorage.removeItem('demoUser');
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
      const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email);
        
      if (data && data.length > 0) {
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
          }
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

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateCurrentUser }}>
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
