
import { supabase } from "@/integrations/supabase/client";
import { User } from "../../types";
import { getCurrentUser } from "../../user-service";
import { toast } from "@/components/ui/sonner";

/**
 * Handles login via Supabase for real user accounts
 * @param email - User's email address
 * @param password - User's password
 * @returns Logged-in user or null on error
 */
export const handleSupabaseLogin = async (email: string, password: string): Promise<User | null> => {
  console.log('AuthSignin: Tentative de connexion Supabase pour:', email);
  
  try {
    // Attempt authentication via Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password
    });

    // Handle specific Supabase errors
    if (error) {
      console.error('AuthSignin: Erreur de connexion Supabase:', {
        code: error.message,
        status: error.status,
        details: error
      });
      
      // Localized and specific error messages
      switch (true) {
        case error.message.includes('Invalid login credentials'):
          toast.error('Identifiants incorrects', { 
            description: 'Vérifiez votre adresse email et votre mot de passe',
            duration: 5000
          });
          break;
          
        case error.message.includes('Email not confirmed'):
          toast.error('Email non confirmé', { 
            description: 'Vérifiez votre boîte mail et cliquez sur le lien de confirmation',
            duration: 8000
          });
          break;
          
        case error.message.includes('Too many requests'):
          toast.error('Trop de tentatives', { 
            description: 'Veuillez patienter quelques minutes avant de réessayer',
            duration: 10000
          });
          break;
          
        case error.message.includes('Network error'):
          toast.error('Erreur de connexion', { 
            description: 'Vérifiez votre connexion Internet et réessayez',
            duration: 5000
          });
          break;
          
        default:
          toast.error('Erreur de connexion', { 
            description: error.message || 'Une erreur inattendue s\'est produite',
            duration: 5000
          });
      }
      
      return null;
    }

    // Check for user data presence
    if (!data.user) {
      console.error('AuthSignin: Connexion réussie mais aucun utilisateur retourné');
      toast.error('Erreur lors de la récupération du profil utilisateur');
      return null;
    }

    console.log('AuthSignin: Authentification Supabase réussie, récupération du profil...');
    
    // Retrieve full user profile with retry
    let user: User | null = null;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (!user && retryCount < maxRetries) {
      try {
        user = await getCurrentUser();
        if (user) break;
        
        retryCount++;
        console.warn(`AuthSignin: Tentative ${retryCount}/${maxRetries} de récupération du profil`);
        
        // Progressive delay between attempts
        if (retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      } catch (profileError) {
        console.error(`AuthSignin: Erreur tentative ${retryCount}:`, profileError);
        retryCount++;
      }
    }
    
    if (!user) {
      console.error('AuthSignin: Impossible de récupérer le profil après plusieurs tentatives');
      toast.error('Erreur lors du chargement du profil utilisateur', {
        description: 'Veuillez réessayer ou contacter le support'
      });
      return null;
    }
    
    console.log('AuthSignin: Connexion complète réussie pour:', user.displayName);
    toast.success('Connexion réussie', { 
      id: 'login-success',
      description: `Bienvenue ${user.displayName} !`
    });
    
    return user;
    
  } catch (error) {
    console.error('AuthSignin: Erreur inattendue lors de la connexion Supabase:', error);
    toast.error('Erreur inattendue de connexion', { 
      description: 'Une erreur technique est survenue. Veuillez réessayer plus tard.'
    });
    return null;
  }
};
