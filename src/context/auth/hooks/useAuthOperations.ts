
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { UserRole } from '@/lib/auth/types';
import { isDemoAccount, getDemoUserType, getDemoUser } from '../utils/demoUsers';

export const useAuthOperations = (setUser: (user: any) => void, setSession: (session: any) => void) => {
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
      if (isDemoAccount(email, password)) {
        const demoUserType = getDemoUserType(email);
        if (demoUserType) {
          localStorage.setItem('demoUser', demoUserType);
          const demoUser = getDemoUser(demoUserType);
          setUser(demoUser);
          toast.success('Connexion réussie');
          return { error: null };
        }
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
  };

  return {
    signUp,
    signIn,
    signOut,
    register,
    login,
    logout
  };
};
