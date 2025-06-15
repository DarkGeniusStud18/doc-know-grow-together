
/**
 * Gestionnaire d'authentification Supabase pour les comptes utilisateur réels
 * 
 * Ce service orchestre l'authentification des utilisateurs réels via Supabase,
 * avec gestion avancée des erreurs, retry automatique et messages localisés.
 */

import { supabase } from "@/integrations/supabase/client";
import { User } from "../../types";
import { getCurrentUser } from "../../user-service";
import { toast } from "@/components/ui/sonner";

/**
 * Configuration pour les tentatives de récupération du profil utilisateur
 */
const PROFILE_RETRY_CONFIG = {
  /** Nombre maximum de tentatives de récupération du profil */
  maxRetries: 3,
  /** Délai de base entre les tentatives (en ms) */
  baseDelay: 1000
} as const;

/**
 * Mapping des erreurs Supabase vers des messages utilisateur localisés
 * Améliore l'expérience utilisateur avec des messages clairs et en français
 */
const SUPABASE_ERROR_MESSAGES = {
  'Invalid login credentials': {
    title: 'Identifiants incorrects',
    description: 'Vérifiez votre adresse email et votre mot de passe',
    duration: 5000
  },
  'Email not confirmed': {
    title: 'Email non confirmé',
    description: 'Vérifiez votre boîte mail et cliquez sur le lien de confirmation',
    duration: 8000
  },
  'Too many requests': {
    title: 'Trop de tentatives',
    description: 'Veuillez patienter quelques minutes avant de réessayer',
    duration: 10000
  },
  'Network error': {
    title: 'Erreur de connexion',
    description: 'Vérifiez votre connexion Internet et réessayez',
    duration: 5000
  }
} as const;

/**
 * Gère l'authentification via Supabase pour les comptes utilisateur réels
 * 
 * Cette fonction orchestre le processus complet d'authentification :
 * - Normalisation et validation des identifiants
 * - Tentative d'authentification via Supabase
 * - Gestion spécialisée des erreurs avec messages localisés
 * - Récupération du profil utilisateur avec système de retry
 * - Notifications utilisateur contextuelles
 * 
 * @param email - Adresse email de l'utilisateur (sera normalisée)
 * @param password - Mot de passe de l'utilisateur
 * @returns Promise<User | null> - Utilisateur connecté ou null en cas d'échec
 * 
 * @example
 * ```typescript
 * const user = await handleSupabaseLogin('user@example.com', 'motdepasse');
 * if (user) {
 *   console.log('Connexion réussie:', user.displayName);
 * }
 * ```
 */
export const handleSupabaseLogin = async (email: string, password: string): Promise<User | null> => {
  const normalizedEmail = email.trim().toLowerCase();
  console.log('🔐 AuthSupabase: Début d\'authentification pour:', normalizedEmail);
  
  try {
    // Tentative d'authentification via Supabase avec identifiants normalisés
    console.log('📡 AuthSupabase: Envoi de la requête d\'authentification...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password
    });

    // Gestion spécialisée des erreurs Supabase avec messages localisés
    if (error) {
      console.error('❌ AuthSupabase: Erreur d\'authentification détectée:', {
        code: error.message,
        status: error.status,
        email: normalizedEmail,
        timestamp: new Date().toISOString()
      });
      
      // Affichage de messages d'erreur contextuels et localisés
      handleSupabaseError(error.message);
      return null;
    }

    // Vérification de la présence des données utilisateur
    if (!data.user) {
      console.error('⚠️ AuthSupabase: Authentification réussie mais données utilisateur manquantes');
      toast.error('Erreur de profil', {
        description: 'Impossible de récupérer les informations de votre compte',
        duration: 5000
      });
      return null;
    }

    console.log('✅ AuthSupabase: Authentification Supabase réussie, ID utilisateur:', data.user.id);
    
    // Récupération du profil utilisateur complet avec système de retry
    const user = await retrieveUserProfileWithRetry();
    
    if (!user) {
      console.error('💥 AuthSupabase: Échec de récupération du profil après toutes les tentatives');
      toast.error('Erreur de chargement du profil', {
        description: 'Impossible de charger votre profil. Veuillez réessayer ou contacter le support.',
        duration: 8000
      });
      return null;
    }
    
    // Notification de succès avec personnalisation
    console.log('🎉 AuthSupabase: Connexion complète réussie pour:', user.displayName);
    toast.success('Connexion réussie', { 
      id: 'login-success',
      description: `Bienvenue ${user.displayName} ! Bon retour sur MedCollab.`,
      duration: 4000
    });
    
    return user;
    
  } catch (error) {
    // Gestion des erreurs critiques non prévues
    console.error('💥 AuthSupabase: Erreur critique non gérée:', {
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      email: normalizedEmail,
      timestamp: new Date().toISOString()
    });
    
    toast.error('Erreur système', { 
      description: 'Une erreur technique critique est survenue. Veuillez réessayer plus tard ou contacter le support.',
      duration: 10000
    });
    return null;
  }
};

/**
 * Gère l'affichage des erreurs Supabase avec messages localisés
 * Fonction utilitaire pour améliorer l'expérience utilisateur
 * 
 * @param errorMessage - Message d'erreur original de Supabase
 */
const handleSupabaseError = (errorMessage: string): void => {
  // Recherche d'un message d'erreur correspondant dans notre mapping
  const errorConfig = Object.entries(SUPABASE_ERROR_MESSAGES).find(([key]) => 
    errorMessage.includes(key)
  )?.[1];
  
  if (errorConfig) {
    // Affichage du message d'erreur localisé et contextualisé
    toast.error(errorConfig.title, {
      description: errorConfig.description,
      duration: errorConfig.duration
    });
  } else {
    // Fallback pour les erreurs non mappées
    console.warn('⚠️ AuthSupabase: Erreur non mappée détectée:', errorMessage);
    toast.error('Erreur de connexion', {
      description: errorMessage || 'Une erreur inattendue s\'est produite lors de la connexion',
      duration: 6000
    });
  }
};

/**
 * Récupère le profil utilisateur avec système de retry automatique
 * Améliore la robustesse en cas de latence réseau ou problème temporaire
 * 
 * @returns Promise<User | null> - Profil utilisateur ou null après échec
 */
const retrieveUserProfileWithRetry = async (): Promise<User | null> => {
  let user: User | null = null;
  let retryCount = 0;
  
  console.log('🔄 AuthSupabase: Début de récupération du profil avec retry...');
  
  while (!user && retryCount < PROFILE_RETRY_CONFIG.maxRetries) {
    try {
      console.log(`🔄 AuthSupabase: Tentative ${retryCount + 1}/${PROFILE_RETRY_CONFIG.maxRetries} de récupération du profil`);
      
      user = await getCurrentUser();
      if (user) {
        console.log('✅ AuthSupabase: Profil récupéré avec succès:', {
          id: user.id,
          name: user.displayName,
          role: user.role
        });
        break;
      }
      
      retryCount++;
      console.warn(`⚠️ AuthSupabase: Tentative ${retryCount} échouée, profil non récupéré`);
      
      // Délai progressif entre les tentatives pour éviter la surcharge
      if (retryCount < PROFILE_RETRY_CONFIG.maxRetries) {
        const delay = PROFILE_RETRY_CONFIG.baseDelay * retryCount;
        console.log(`⏳ AuthSupabase: Attente de ${delay}ms avant la prochaine tentative...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
    } catch (profileError) {
      retryCount++;
      console.error(`❌ AuthSupabase: Erreur lors de la tentative ${retryCount}:`, {
        error: profileError instanceof Error ? profileError.message : 'Erreur inconnue',
        attempt: retryCount,
        maxAttempts: PROFILE_RETRY_CONFIG.maxRetries
      });
    }
  }
  
  return user;
};

/**
 * Vérifie l'état de la session Supabase actuelle
 * Fonction utilitaire pour diagnostiquer les problèmes de session
 * 
 * @returns Promise<boolean> - true si session valide, false sinon
 */
export const isSupabaseSessionValid = async (): Promise<boolean> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ AuthSupabase: Erreur de validation de session:', error);
      return false;
    }
    
    const isValid = !!session && !!session.user;
    console.log('🔍 AuthSupabase: Validation de session:', isValid ? 'Valide' : 'Invalide');
    return isValid;
    
  } catch (error) {
    console.error('💥 AuthSupabase: Erreur critique lors de la validation de session:', error);
    return false;
  }
};
