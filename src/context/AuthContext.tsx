
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/lib/auth/types';
import { toast } from '@/components/ui/sonner';

export interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  register: (email: string, password: string, role: UserRole, displayName: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
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
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return null;
      }

      if (!profileData) {
        console.log('Profile not found, creating new profile...');
        
        const displayName = supabaseUser.user_metadata?.display_name || 
                           supabaseUser.user_metadata?.name || 
                           supabaseUser.email?.split('@')[0] || 
                           'User';
        
        const role = supabaseUser.user_metadata?.role || 'student';
        
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: supabaseUser.id,
            display_name: displayName,
            role: role,
            kyc_status: 'not_submitted',
            email: supabaseUser.email,
            subscription_status: 'free'
          })
          .select()
          .single();
          
        if (createError) {
          console.error('Error creating profile:', createError);
          return null;
        }
        
        console.log('New profile created successfully');
        return {
          id: supabaseUser.id,
          email: supabaseUser.email || newProfile.email,
          displayName: newProfile.display_name,
          role: newProfile.role,
          kycStatus: newProfile.kyc_status,
          profileImage: newProfile.profile_image,
          university: newProfile.university,
          specialty: newProfile.specialty,
          subscriptionStatus: newProfile.subscription_status,
          subscriptionExpiry: newProfile.subscription_expiry ? new Date(newProfile.subscription_expiry) : null,
          createdAt: new Date(newProfile.created_at),
          updatedAt: newProfile.updated_at ? new Date(newProfile.updated_at) : undefined,
        };
      }

      return {
        id: supabaseUser.id,
        email: supabaseUser.email || profileData.email,
        displayName: profileData.display_name,
        role: profileData.role,
        kycStatus: profileData.kyc_status,
        profileImage: profileData.profile_image,
        university: profileData.university,
        specialty: profileData.specialty,
        subscriptionStatus: profileData.subscription_status,
        subscriptionExpiry: profileData.subscription_expiry ? new Date(profileData.subscription_expiry) : null,
        createdAt: new Date(profileData.created_at),
        updatedAt: profileData.updated_at ? new Date(profileData.updated_at) : undefined,
      };
    } catch (error) {
      console.error('Error converting user:', error);
      return null;
    }
  };

  useEffect(() => {
    // Check for demo user first
    const demoUser = localStorage.getItem('demoUser');
    if (demoUser) {
      if (demoUser === 'student') {
        setUser({
          id: "student-1",
          email: "student@example.com",
          displayName: "Alex Dupont",
          role: "student",
          kycStatus: "verified",
          university: "Université Paris Descartes",
          subscriptionStatus: "free",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } else if (demoUser === 'professional') {
        setUser({
          id: "professional-1",
          email: "doctor@example.com",
          displayName: "Dr. Marie Lambert",
          role: "professional",
          kycStatus: "verified",
          specialty: "Cardiologie",
          subscriptionStatus: "free",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      setLoading(false);
      return;
    }

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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.id);
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
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        toast.error('Erreur lors de l\'inscription', { description: error.message });
        return { error };
      }

      if (data.user && !data.session) {
        toast.success('Vérifiez votre email', { 
          description: 'Un lien de confirmation a été envoyé à votre adresse email.' 
        });
      }

      return { error: null };
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error('Erreur lors de l\'inscription');
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Handle demo accounts
      if ((email === 'student@example.com' || email === 'doctor@example.com') && password === 'password') {
        localStorage.setItem('demoUser', email === 'student@example.com' ? 'student' : 'professional');
        
        const demoUser = email === 'student@example.com' ? {
          id: "student-1",
          email: "student@example.com",
          displayName: "Alex Dupont",
          role: "student" as UserRole,
          kycStatus: "verified" as any,
          university: "Université Paris Descartes",
          subscriptionStatus: "free" as any,
          createdAt: new Date(),
          updatedAt: new Date(),
        } : {
          id: "professional-1",
          email: "doctor@example.com",
          displayName: "Dr. Marie Lambert",
          role: "professional" as UserRole,
          kycStatus: "verified" as any,
          specialty: "Cardiologie",
          subscriptionStatus: "free" as any,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        setUser(demoUser);
        toast.success('Connexion réussie');
        return { error: null };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Identifiants incorrects', { 
            description: 'Vérifiez votre email et mot de passe' 
          });
        } else {
          toast.error('Erreur de connexion', { description: error.message });
        }
        return { error };
      }

      if (data.user) {
        toast.success('Connexion réussie');
      }

      return { error: null };
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Erreur de connexion');
      return { error };
    }
  };

  const signOut = async () => {
    try {
      // Handle demo users
      const demoUser = localStorage.getItem('demoUser');
      if (demoUser) {
        localStorage.removeItem('demoUser');
        setUser(null);
        setSession(null);
        toast.success('Déconnexion réussie');
        window.location.href = '/';
        return { error: null };
      }

      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        toast.error('Erreur lors de la déconnexion');
        return { error };
      }

      setUser(null);
      setSession(null);
      toast.success('Déconnexion réussie');
      window.location.href = '/';
      return { error: null };
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Erreur lors de la déconnexion');
      return { error };
    }
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
        toast.error('Erreur lors de l\'inscription', { description: error.message });
        return false;
      }
      
      toast.success('Inscription réussie', { 
        description: 'Vérifiez votre email pour confirmer votre compte.' 
      });
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error('Erreur lors de l\'inscription');
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const result = await signIn(email, password);
    return !result.error;
  };

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
