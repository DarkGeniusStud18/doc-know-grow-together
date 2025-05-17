
/**
 * Service pour la gestion de la connexion des utilisateurs
 * 
 * Ce fichier contient la fonction de connexion utilisateur via Supabase
 */

import { supabase } from "@/integrations/supabase/client";
import { User } from "../types";
import { getCurrentUser } from "../user-service";
import { toast } from "@/components/ui/sonner";

/**
 * Connecte un utilisateur à l'application via email et mot de passe
 * @param email - Email de l'utilisateur
 * @param password - Mot de passe de l'utilisateur
 * @returns L'utilisateur connecté ou null si échec
 */
export const signIn = async (email: string, password: string): Promise<User | null> => {
  try {
    console.log('Tentative de connexion pour:', email);
    
    // Vérifier si c'est un compte de démo
    if ((email === 'student@example.com' || email === 'doctor@example.com') && password === 'password') {
      console.log('Compte de démo détecté, redirection vers le tableau de bord');
      
      // Simuler un délai comme pour une vraie connexion
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Récupérer l'utilisateur avec getCurrentUser qui gère les comptes de démo
      const user = await getCurrentUser();
      
      if (user) {
        toast.success('Connexion réussie', { id: 'login-success' });
        
        // Rediriger vers le tableau de bord après une courte pause
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 300);
        
        return user;
      }
      
      toast.error('Erreur lors de la connexion');
      return null;
    }

    // Connexion via Supabase pour les vrais comptes
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Erreur de connexion:', error);
      
      // Message d'erreur adapté selon le type d'erreur
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Identifiants incorrects', { 
          description: 'Vérifiez votre email et mot de passe'
        });
      } else if (error.message.includes('Email not confirmed')) {
        toast.error('Email non confirmé', { 
          description: 'Veuillez vérifier votre boîte mail pour confirmer votre compte'
        });
      } else {
        toast.error('Erreur de connexion', { description: error.message });
      }
      
      return null;
    }

    if (!data.user) {
      console.error('Connexion réussie mais aucun utilisateur retourné');
      toast.error('Erreur lors de la récupération du profil');
      return null;
    }

    console.log('Récupération du profil utilisateur...');
    const user = await getCurrentUser();
    
    if (!user) {
      console.error('Impossible de récupérer les données du profil');
      toast.error('Erreur lors du chargement du profil');
      return null;
    }
    
    toast.success('Connexion réussie', { id: 'login-success' });
    
    return user;
  } catch (error) {
    console.error('Erreur inattendue lors de la connexion:', error);
    toast.error('Erreur inattendue', { 
      description: 'Une erreur est survenue. Veuillez réessayer plus tard.'
    });
    return null;
  }
};
