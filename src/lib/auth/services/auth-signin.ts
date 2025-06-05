
/**
 * Service pour la gestion de la connexion des utilisateurs
 * 
 * Ce fichier contient la fonction de connexion utilisateur via Supabase
 * avec gestion des comptes de démonstration et des erreurs
 */

import { supabase } from "@/integrations/supabase/client";
import { User } from "../types";
import { getCurrentUser } from "../user-service";
import { toast } from "@/components/ui/sonner";

/**
 * Connecte un utilisateur à l'application via email et mot de passe
 * Gère à la fois les comptes de démonstration et les vrais comptes Supabase
 * @param email - Adresse email de l'utilisateur
 * @param password - Mot de passe de l'utilisateur
 * @returns L'utilisateur connecté ou null si échec de la connexion
 */
export const signIn = async (email: string, password: string): Promise<User | null> => {
  try {
    console.log('Tentative de connexion pour l\'utilisateur:', email);
    
    // Vérification si c'est un compte de démonstration
    if ((email === 'student@example.com' || email === 'doctor@example.com') && password === 'password') {
      console.log('Compte de démonstration détecté, traitement spécial');
      
      // Simulation d'un délai comme pour une vraie connexion
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Définition du type d'utilisateur de démo dans localStorage
      if (email === 'student@example.com') {
        localStorage.setItem('demoUser', 'student');
      } else {
        localStorage.setItem('demoUser', 'professional');
      }
      
      // Récupération de l'utilisateur de démo via getCurrentUser
      const user = await getCurrentUser();
      
      if (user) {
        console.log('Connexion de démonstration réussie');
        toast.success('Connexion réussie', { id: 'login-success' });
        return user;
      }
      
      console.error('Erreur lors de la connexion de démonstration');
      toast.error('Erreur lors de la connexion');
      return null;
    }

    // Connexion via Supabase pour les vrais comptes utilisateur
    console.log('Tentative de connexion Supabase');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Erreur de connexion Supabase:', error);
      
      // Messages d'erreur adaptés selon le type d'erreur
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

    console.log('Connexion Supabase réussie, récupération du profil utilisateur...');
    
    // Récupération des données complètes du profil utilisateur
    const user = await getCurrentUser();
    
    if (!user) {
      console.error('Impossible de récupérer les données du profil');
      toast.error('Erreur lors du chargement du profil');
      return null;
    }
    
    console.log('Connexion complète réussie');
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
