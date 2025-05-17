
/**
 * Context pour la gestion de l'authentification
 * Adapté pour fonctionner avec la nouvelle structure Supabase
 */
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/lib/auth/types';
import { getCurrentUser, signIn } from '@/lib/auth';
import { signOut } from '@/lib/auth/services/auth-signout';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { checkPremiumStatus } from '@/lib/auth/services/subscription-service';

/**
 * Interface définissant les méthodes et propriétés du contexte d'authentification
 */
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

/**
 * Fournisseur du contexte d'authentification
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fonction pour récupérer l'utilisateur actuel avec gestion des erreurs
   */
  const fetchCurrentUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      console.log('Fetched current user:', currentUser);
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  };

  // Configuration du listener d'état d'authentification EN PREMIER
  useEffect(() => {
    console.log('Setting up auth state listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change event:', event, 'Session exists:', !!session);
        
        if (event === 'SIGNED_IN') {
          // Utiliser un timeout pour éviter les deadlocks d'auth
          setTimeout(fetchCurrentUser, 0);
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed, updating user data');
          setTimeout(fetchCurrentUser, 0);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('demoUser');
          console.log('User signed out');
        } else if (event === 'USER_UPDATED') {
          setTimeout(fetchCurrentUser, 0);
        } else if (event === 'PASSWORD_RECOVERY') {
          // Gestion du processus de récupération de mot de passe
          const url = new URL(window.location.href);
          const token = url.searchParams.get('token');
          const type = url.searchParams.get('type');
          
          if (token && type === 'recovery') {
            console.log('Password recovery flow detected');
            window.location.href = `/password-recovery?token=${token}&type=${type}`;
          }
        }
      }
    );

    // Vérification initiale de la session
    const checkSession = async () => {
      try {
        console.log('Initial session check...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
          setLoading(false);
          return;
        }
        
        console.log('Session check result:', data);
        
        if (data.session) {
          console.log('Valid session found, fetching user data');
          await fetchCurrentUser();
        } else {
          // Vérifier s'il s'agit d'un utilisateur de démonstration
          const demoUser = localStorage.getItem('demoUser');
          if (demoUser) {
            await fetchCurrentUser();
          } else {
            console.log('No valid session or demo user found');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error in session check:', error);
      } finally {
        setLoading(false);
      }
    };

    // Exécuter la vérification initiale après la configuration de l'abonnement
    checkSession();

    // Fonction de nettoyage
    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Connecte l'utilisateur avec email et mot de passe
   */
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Attempting login for:', email);
      
      // Gestion des comptes de démonstration
      if (email === "student@example.com" && password === "password") {
        localStorage.setItem('demoUser', 'student');
      } else if (email === "doctor@example.com" && password === "password") {
        localStorage.setItem('demoUser', 'professional');
      }
      
      const user = await signIn(email, password);
      
      if (user) {
        console.log('Login successful for:', user.email);
        setUser(user);
        return true;
      }
      
      console.log('Login failed');
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

  /**
   * Déconnecte l'utilisateur et redirige vers une URL spécifique
   */
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

  /**
   * Inscrit un nouvel utilisateur
   */
  const register = async (email: string, password: string, role: UserRole, displayName: string) => {
    try {
      setLoading(true);
      
      // Vérifier si l'utilisateur existe déjà
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();
        
      if (existingUser) {
        toast.error('Un compte avec cette adresse email existe déjà');
        return false;
      }
      
      // Définir l'URL de redirection en fonction de l'environnement
      const siteUrl = process.env.NODE_ENV === 'production' 
        ? 'https://doc-know-grow-together.netlify.app' 
        : window.location.origin;
      
      // Inscription du nouvel utilisateur
      const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            role,
          },
          emailRedirectTo: `${siteUrl}/email-confirmation`
        }
      });
      
      if (error) {
        console.error('Registration error:', error);
        throw error;
      }
      
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
  
  /**
   * Met à jour les données de l'utilisateur actuel dans le contexte
   */
  const updateCurrentUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  /**
   * Vérifie si l'utilisateur a accès aux fonctionnalités premium
   */
  const checkPremiumAccess = async (): Promise<boolean> => {
    if (!user) return false;
    return checkPremiumStatus(user.id);
  };

  const contextValue = {
    user, 
    loading, 
    login, 
    logout, 
    register, 
    updateCurrentUser,
    checkPremiumAccess
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook pour accéder au contexte d'authentification
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
