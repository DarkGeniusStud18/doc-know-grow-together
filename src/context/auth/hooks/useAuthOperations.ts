
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { UserRole } from '@/lib/auth/types';
import { isDemoAccount, getDemoUserType, getDemoUser } from '../utils/demoUsers';

export const useAuthOperations = (setUser: any, setSession: any) => {
  const signInWithEmail = async (email: string, password: string) => {
    try {
      // Check if it's a demo account first
      if (isDemoAccount(email, password)) {
        const demoUserType = getDemoUserType(email);
        if (demoUserType) {
          localStorage.setItem('demoUser', demoUserType);
          const demoUser = getDemoUser(demoUserType);
          setUser(demoUser);
          setSession(null);
          toast.success(`Connexion en tant que ${demoUserType === 'student' ? 'étudiant' : 'professionnel'} démo`);
          return { data: { user: demoUser, session: null }, error: null };
        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        toast.error('Erreur de connexion: ' + error.message);
        return { error };
      }

      if (data.session) {
        console.log('Sign in successful');
        toast.success('Connexion réussie !');
      }

      return { data, error: null };
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      toast.error('Erreur inattendue lors de la connexion');
      return { error };
    }
  };

  const signUpWithEmail = async (email: string, password: string, metadata?: any) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: metadata
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        toast.error('Erreur d\'inscription: ' + error.message);
        return { error };
      }

      if (data.user && !data.session) {
        toast.info('Vérifiez votre email pour confirmer votre compte');
      } else if (data.session) {
        toast.success('Inscription réussie !');
      }

      return { data, error: null };
    } catch (error) {
      console.error('Unexpected sign up error:', error);
      toast.error('Erreur inattendue lors de l\'inscription');
      return { error };
    }
  };

  const signOut = async () => {
    try {
      // Clear demo user if exists
      const demoUser = localStorage.getItem('demoUser');
      if (demoUser) {
        localStorage.removeItem('demoUser');
        setUser(null);
        setSession(null);
        toast.success('Déconnexion réussie');
        return { error: null };
      }

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        toast.error('Erreur lors de la déconnexion');
        return { error };
      }

      toast.success('Déconnexion réussie');
      return { error: null };
    } catch (error) {
      console.error('Unexpected sign out error:', error);
      toast.error('Erreur inattendue lors de la déconnexion');
      return { error };
    }
  };

  const signInAsDemo = (userType: 'student' | 'professional') => {
    try {
      localStorage.setItem('demoUser', userType);
      const demoUser = getDemoUser(userType);
      setUser(demoUser);
      setSession(null);
      toast.success(`Connexion en tant que ${userType === 'student' ? 'étudiant' : 'professionnel'} démo`);
      return { error: null };
    } catch (error) {
      console.error('Demo sign in error:', error);
      toast.error('Erreur lors de la connexion démo');
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        console.error('Reset password error:', error);
        toast.error('Erreur lors de la réinitialisation: ' + error.message);
        return { error };
      }

      toast.success('Email de réinitialisation envoyé !');
      return { error: null };
    } catch (error) {
      console.error('Unexpected reset password error:', error);
      toast.error('Erreur inattendue lors de la réinitialisation');
      return { error };
    }
  };

  return {
    signInWithEmail,
    signUpWithEmail,
    signOut,
    signInAsDemo,
    resetPassword,
  };
};
