
/**
 * Service optimisé pour la gestion de la connexion des utilisateurs
 * 
 * Ce service gère l'authentification via Supabase avec support des comptes de démonstration,
 * validation robuste, gestion d'erreur avancée et logging détaillé pour le débogage
 */

import { supabase } from "@/integrations/supabase/client";
import { User } from "../types";
import { getCurrentUser } from "../user-service";
import { toast } from "@/components/ui/sonner";

/**
 * Interface pour les résultats de validation des identifiants
 */
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Valide les identifiants de connexion
 * @param email - Adresse email à valider
 * @param password - Mot de passe à valider
 * @returns Résultat de validation avec erreurs éventuelles
 */
const validateCredentials = (email: string, password: string): ValidationResult => {
  const errors: string[] = [];
  
  // Validation de l'email
  if (!email.trim()) {
    errors.push('L\'adresse email est obligatoire');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Format d\'adresse email invalide');
  }
  
  // Validation du mot de passe
  if (!password) {
    errors.push('Le mot de passe est obligatoire');
  } else if (password.length < 6) {
    errors.push('Le mot de passe doit contenir au moins 6 caractères');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Gère la connexion d'un compte de démonstration
 * @param email - Email du compte de démo
 * @returns Utilisateur de démonstration ou null en cas d'erreur
 */
const handleDemoLogin = async (email: string): Promise<User | null> => {
  console.log('AuthSignin: Traitement d\'un compte de démonstration pour:', email);
  
  try {
    // Simulation d'un délai réseau réaliste
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Détermination du type d'utilisateur de démo
    const demoUserType = email === 'student@example.com' ? 'student' : 'professional';
    
    // Stockage sécurisé du type d'utilisateur de démo
    localStorage.setItem('demoUser', demoUserType);
    console.log('AuthSignin: Type d\'utilisateur de démo défini:', demoUserType);
    
    // Récupération de l'utilisateur de démo via le service utilisateur
    const demoUser = await getCurrentUser();
    
    if (demoUser) {
      console.log('AuthSignin: Connexion de démonstration réussie pour:', demoUser.displayName);
      toast.success('Connexion de démonstration réussie', { 
        id: 'demo-login-success',
        description: `Bienvenue ${demoUser.displayName} !`
      });
      return demoUser;
    }
    
    console.error('AuthSignin: Impossible de créer l\'utilisateur de démonstration');
    toast.error('Erreur lors de la création du compte de démonstration');
    return null;
    
  } catch (error) {
    console.error('AuthSignin: Erreur lors de la connexion de démonstration:', error);
    toast.error('Erreur lors de la connexion de démonstration');
    return null;
  }
};

/**
 * Gère la connexion via Supabase pour les vrais comptes utilisateur
 * @param email - Adresse email de l'utilisateur
 * @param password - Mot de passe de l'utilisateur
 * @returns Utilisateur connecté ou null en cas d'erreur
 */
const handleSupabaseLogin = async (email: string, password: string): Promise<User | null> => {
  console.log('AuthSignin: Tentative de connexion Supabase pour:', email);
  
  try {
    // Tentative d'authentification via Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password
    });

    // Gestion des erreurs spécifiques de Supabase
    if (error) {
      console.error('AuthSignin: Erreur de connexion Supabase:', {
        code: error.message,
        status: error.status,
        details: error
      });
      
      // Messages d'erreur localisés et spécifiques
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

    // Vérification de la présence des données utilisateur
    if (!data.user) {
      console.error('AuthSignin: Connexion réussie mais aucun utilisateur retourné');
      toast.error('Erreur lors de la récupération du profil utilisateur');
      return null;
    }

    console.log('AuthSignin: Authentification Supabase réussie, récupération du profil...');
    
    // Récupération du profil utilisateur complet avec retry
    let user: User | null = null;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (!user && retryCount < maxRetries) {
      try {
        user = await getCurrentUser();
        if (user) break;
        
        retryCount++;
        console.warn(`AuthSignin: Tentative ${retryCount}/${maxRetries} de récupération du profil`);
        
        // Délai progressif entre les tentatives
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

/**
 * Fonction principale de connexion utilisateur optimisée
 * Gère les comptes de démonstration et les vrais comptes avec validation et logging
 * @param email - Adresse email de l'utilisateur
 * @param password - Mot de passe de l'utilisateur
 * @returns L'utilisateur connecté ou null si échec de la connexion
 */
export const signIn = async (email: string, password: string): Promise<User | null> => {
  console.log('AuthSignin: Début de la tentative de connexion');
  
  // Validation préliminaire des identifiants
  const validation = validateCredentials(email, password);
  if (!validation.isValid) {
    console.warn('AuthSignin: Validation des identifiants échouée:', validation.errors);
    toast.error('Identifiants invalides', {
      description: validation.errors.join(', ')
    });
    return null;
  }
  
  const normalizedEmail = email.trim().toLowerCase();
  console.log('AuthSignin: Tentative de connexion pour:', normalizedEmail);
  
  try {
    // Détection et traitement des comptes de démonstration
    const isDemoAccount = (normalizedEmail === 'student@example.com' || normalizedEmail === 'doctor@example.com') 
                         && password === 'password';
    
    if (isDemoAccount) {
      return await handleDemoLogin(normalizedEmail);
    }
    
    // Traitement des connexions Supabase pour les vrais comptes
    return await handleSupabaseLogin(normalizedEmail, password);
    
  } catch (error) {
    console.error('AuthSignin: Erreur critique lors de la connexion:', error);
    toast.error('Erreur critique de connexion', { 
      description: 'Une erreur système est survenue. Veuillez contacter le support technique.'
    });
    return null;
  }
};
