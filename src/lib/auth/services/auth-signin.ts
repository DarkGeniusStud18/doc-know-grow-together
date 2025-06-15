
/**
 * Service principal optimisé pour la gestion de l'authentification utilisateur
 * 
 * Ce service orchestre l'ensemble du processus d'authentification de l'application MedCollab,
 * supportant à la fois les comptes de démonstration et les comptes utilisateur réels.
 * Il intègre une validation robuste, une gestion d'erreurs avancée et un logging détaillé
 * pour faciliter le débogage et assurer une expérience utilisateur optimale.
 */

import { toast } from "@/components/ui/sonner";
import { User } from "../types";
import { validateCredentials } from "./signin/validation";
import { handleDemoLogin, isDemoAccount } from "./signin/demo-handler";
import { handleSupabaseLogin } from "./signin/supabase-handler";

/**
 * Interface pour les statistiques de tentatives de connexion
 * Utilisée pour le monitoring et l'analyse des performances
 */
interface LoginAttemptStats {
  /** Timestamp de début de la tentative */
  startTime: number;
  /** Email normalisé (sans informations sensibles) */
  email: string;
  /** Type de compte (demo/real) */
  accountType: 'demo' | 'real';
  /** Durée totale de la tentative en ms */
  duration?: number;
  /** Statut final de la tentative */
  success: boolean;
}

/**
 * Fonction principale d'authentification utilisateur optimisée
 * 
 * Cette fonction coordonne l'ensemble du processus d'authentification :
 * 
 * 1. **Validation préliminaire** : Vérification des formats et contraintes
 * 2. **Détection du type de compte** : Différenciation demo/réel
 * 3. **Routage intelligent** : Redirection vers le gestionnaire approprié
 * 4. **Monitoring des performances** : Tracking des temps de réponse
 * 5. **Gestion d'erreurs robuste** : Récupération des échecs et logging
 * 
 * @param email - Adresse email de l'utilisateur (sera normalisée automatiquement)
 * @param password - Mot de passe de l'utilisateur (validation de longueur minimale)
 * @returns Promise<User | null> - Utilisateur authentifié ou null en cas d'échec
 * 
 * @example
 * ```typescript
 * // Connexion avec compte réel
 * const user = await signIn('user@hospital.fr', 'motDePasseSecurise');
 * 
 * // Connexion avec compte de démonstration
 * const demoUser = await signIn('student@example.com', 'password');
 * 
 * if (user) {
 *   console.log(`Bienvenue ${user.displayName} !`);
 * }
 * ```
 */
export const signIn = async (email: string, password: string): Promise<User | null> => {
  // Initialisation du monitoring des performances
  const attemptStats: LoginAttemptStats = {
    startTime: performance.now(),
    email: email.trim().toLowerCase().replace(/./g, '*'), // Anonymisation pour les logs
    accountType: isDemoAccount(email) ? 'demo' : 'real',
    success: false
  };
  
  console.log('🚀 AuthSignin: Début de la tentative d\'authentification', {
    accountType: attemptStats.accountType,
    timestamp: new Date().toISOString()
  });
  
  try {
    // Phase 1: Validation préliminaire des identifiants
    console.log('🔍 AuthSignin: Phase de validation des identifiants...');
    const validation = validateCredentials(email, password);
    
    if (!validation.isValid) {
      console.warn('⚠️ AuthSignin: Échec de validation des identifiants:', {
        errors: validation.errors,
        accountType: attemptStats.accountType
      });
      
      // Affichage des erreurs de validation avec détails
      toast.error('Identifiants invalides', {
        description: validation.errors.join(' • '),
        duration: 5000
      });
      
      return null;
    }
    
    // Phase 2: Normalisation de l'email et détection du type de compte
    const normalizedEmail = email.trim().toLowerCase();
    const isDemo = isDemoAccount(normalizedEmail);
    
    console.log('🎯 AuthSignin: Type de compte détecté:', {
      type: isDemo ? 'Démonstration' : 'Utilisateur réel',
      email: normalizedEmail.replace(/./g, '*') // Anonymisation
    });
    
    let authenticatedUser: User | null = null;
    
    // Phase 3: Routage vers le gestionnaire d'authentification approprié
    if (isDemo && password === 'password') {
      console.log('🎭 AuthSignin: Redirection vers l\'authentification de démonstration...');
      authenticatedUser = await handleDemoLogin(normalizedEmail);
    } else {
      console.log('🔐 AuthSignin: Redirection vers l\'authentification Supabase...');
      authenticatedUser = await handleSupabaseLogin(normalizedEmail, password);
    }
    
    // Phase 4: Finalisation et monitoring des résultats
    attemptStats.duration = performance.now() - attemptStats.startTime;
    attemptStats.success = !!authenticatedUser;
    
    if (authenticatedUser) {
      console.log('✅ AuthSignin: Authentification réussie', {
        userId: authenticatedUser.id,
        userName: authenticatedUser.displayName,
        userRole: authenticatedUser.role,
        duration: `${attemptStats.duration.toFixed(2)}ms`,
        accountType: attemptStats.accountType
      });
    } else {
      console.warn('❌ AuthSignin: Échec d\'authentification', {
        duration: `${attemptStats.duration.toFixed(2)}ms`,
        accountType: attemptStats.accountType
      });
    }
    
    return authenticatedUser;
    
  } catch (error) {
    // Gestion des erreurs critiques avec logging détaillé
    attemptStats.duration = performance.now() - attemptStats.startTime;
    
    console.error('💥 AuthSignin: Erreur critique lors de l\'authentification:', {
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined,
      duration: `${attemptStats.duration.toFixed(2)}ms`,
      accountType: attemptStats.accountType,
      timestamp: new Date().toISOString()
    });
    
    // Notification d'erreur critique pour l'utilisateur
    toast.error('Erreur système critique', { 
      description: 'Une erreur technique majeure est survenue. Veuillez contacter le support technique si le problème persiste.',
      duration: 10000
    });
    
    return null;
  }
};

/**
 * Valide les identifiants sans tentative de connexion
 * Fonction utilitaire pour la validation en temps réel dans les formulaires
 * 
 * @param email - Email à valider
 * @param password - Mot de passe à valider
 * @returns true si les identifiants sont valides, false sinon
 */
export const validateCredentialsQuick = (email: string, password: string): boolean => {
  const validation = validateCredentials(email, password);
  return validation.isValid;
};

/**
 * Obtient des statistiques sur les tentatives de connexion
 * Fonction utilitaire pour le monitoring et l'analyse
 * 
 * @param email - Email pour lequel obtenir les stats
 * @returns Informations sur le type de compte et recommandations
 */
export const getLoginAccountInfo = (email: string): {
  type: 'demo' | 'real';
  isValidFormat: boolean;
  recommendations: string[];
} => {
  const normalizedEmail = email.trim().toLowerCase();
  const isDemo = isDemoAccount(normalizedEmail);
  const validation = validateCredentials(email, 'dummyPassword');
  
  const recommendations: string[] = [];
  
  if (!validation.errors.some(error => error.includes('email'))) {
    if (isDemo) {
      recommendations.push('Utilisez le mot de passe "password" pour les comptes de démonstration');
    } else {
      recommendations.push('Assurez-vous d\'utiliser votre mot de passe personnel');
    }
  }
  
  return {
    type: isDemo ? 'demo' : 'real',
    isValidFormat: !validation.errors.some(error => error.includes('email')),
    recommendations
  };
};
