
/**
 * Service optimisé pour la gestion de la déconnexion des utilisateurs
 * 
 * Gère la déconnexion sécurisée avec nettoyage des données locales,
 * support des comptes de démonstration et gestion d'erreur robuste
 */
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

/**
 * Types de comptes utilisateur pour la déconnexion
 */
type AccountType = 'demo' | 'supabase' | 'unknown';

/**
 * Interface pour les options de déconnexion
 */
interface SignOutOptions {
  redirectUrl?: string;
  clearLocalStorage?: boolean;
  showSuccessMessage?: boolean;
}

/**
 * Détermine le type de compte utilisateur actuel
 * @returns Type de compte pour optimiser la déconnexion
 */
const detectAccountType = (): AccountType => {
  // Vérification de la présence d'un utilisateur de démonstration
  const demoUser = localStorage.getItem('demoUser');
  if (demoUser) {
    console.log('SignOut: Compte de démonstration détecté');
    return 'demo';
  }
  
  // Vérification de la session Supabase active
  const supabaseSession = localStorage.getItem('medcollab-auth-token');
  if (supabaseSession) {
    console.log('SignOut: Session Supabase détectée');
    return 'supabase';
  }
  
  console.log('SignOut: Type de compte indéterminé');
  return 'unknown';
};

/**
 * Nettoie les données locales de l'application
 * @param clearAll - Si true, nettoie toutes les données, sinon seulement l'authentification
 */
const cleanupLocalData = (clearAll: boolean = false): void => {
  console.log('SignOut: Nettoyage des données locales');
  
  // Données d'authentification à nettoyer
  const authKeys = [
    'demoUser',
    'medcollab-auth-token',
    'sb-yblwafdsidkuzgzfazpf-auth-token',
    'premium_status_',
    'user_preferences_'
  ];
  
  if (clearAll) {
    // Nettoyage complet pour une déconnexion sécurisée
    console.log('SignOut: Nettoyage complet du localStorage');
    localStorage.clear();
  } else {
    // Nettoyage sélectif des données d'authentification
    authKeys.forEach(key => {
      // Gestion des clés avec préfixes dynamiques
      if (key.endsWith('_')) {
        Object.keys(localStorage).forEach(storageKey => {
          if (storageKey.startsWith(key)) {
            localStorage.removeItem(storageKey);
            console.log(`SignOut: Suppression de la clé: ${storageKey}`);
          }
        });
      } else {
        localStorage.removeItem(key);
        console.log(`SignOut: Suppression de la clé: ${key}`);
      }
    });
  }
  
  // Nettoyage du sessionStorage si nécessaire
  sessionStorage.removeItem('temp_auth_data');
  console.log('SignOut: Nettoyage du sessionStorage terminé');
};

/**
 * Gère la déconnexion d'un compte de démonstration
 * @param options - Options de déconnexion
 */
const handleDemoSignOut = async (options: SignOutOptions): Promise<void> => {
  console.log('SignOut: Traitement de la déconnexion de démonstration');
  
  try {
    // Nettoyage spécifique aux comptes de démonstration
    localStorage.removeItem('demoUser');
    
    // Nettoyage additionnel si demandé
    if (options.clearLocalStorage) {
      cleanupLocalData(true);
    }
    
    if (options.showSuccessMessage !== false) {
      toast.success("Déconnexion de démonstration réussie", {
        description: "Merci d'avoir testé MedCollab !"
      });
    }
    
    console.log('SignOut: Déconnexion de démonstration terminée');
    
  } catch (error) {
    console.error('SignOut: Erreur lors de la déconnexion de démonstration:', error);
    toast.error("Erreur lors de la déconnexion", {
      description: "La déconnexion a partiellement échoué"
    });
  }
};

/**
 * Gère la déconnexion d'un compte Supabase
 * @param options - Options de déconnexion
 */
const handleSupabaseSignOut = async (options: SignOutOptions): Promise<void> => {
  console.log('SignOut: Traitement de la déconnexion Supabase');
  
  try {
    // Déconnexion via l'API Supabase avec timeout
    const signOutPromise = supabase.auth.signOut();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout de déconnexion')), 10000);
    });
    
    await Promise.race([signOutPromise, timeoutPromise]);
    
    console.log('SignOut: Déconnexion Supabase réussie');
    
    // Nettoyage des données locales
    if (options.clearLocalStorage) {
      cleanupLocalData(true);
    } else {
      cleanupLocalData(false);
    }
    
    if (options.showSuccessMessage !== false) {
      toast.success("Déconnexion réussie", {
        description: "Vous avez été déconnecté en toute sécurité"
      });
    }
    
  } catch (error: any) {
    console.error('SignOut: Erreur lors de la déconnexion Supabase:', error);
    
    // Nettoyage forcé même en cas d'erreur
    cleanupLocalData(true);
    
    // Messages d'erreur contextuels
    if (error.message?.includes('Timeout')) {
      toast.warning("Déconnexion avec timeout", {
        description: "Vous avez été déconnecté localement"
      });
    } else {
      toast.error("Erreur lors de la déconnexion", {
        description: error.message || "Veuillez vider le cache de votre navigateur"
      });
    }
  }
};

/**
 * Effectue la redirection après déconnexion
 * @param redirectUrl - URL de redirection
 */
const performRedirection = (redirectUrl: string): void => {
  console.log('SignOut: Redirection vers:', redirectUrl);
  
  try {
    // Vérification de la validité de l'URL
    if (!redirectUrl.startsWith('/') && !redirectUrl.startsWith('http')) {
      console.warn('SignOut: URL de redirection invalide, utilisation de la page d\'accueil');
      redirectUrl = '/';
    }
    
    // Redirection avec gestion d'erreur
    window.location.href = redirectUrl;
    
  } catch (error) {
    console.error('SignOut: Erreur lors de la redirection:', error);
    // Redirection de secours
    window.location.href = '/';
  }
};

/**
 * Fonction principale de déconnexion optimisée et sécurisée
 * @param redirectUrl - URL de redirection après déconnexion (défaut: '/')
 * @param options - Options de déconnexion avancées
 * @returns Promise<void>
 */
export const signOut = async (
  redirectUrl: string = '/', 
  options: Partial<SignOutOptions> = {}
): Promise<void> => {
  console.log('SignOut: Début de la procédure de déconnexion');
  
  // Configuration des options avec valeurs par défaut
  const signOutOptions: SignOutOptions = {
    redirectUrl,
    clearLocalStorage: false,
    showSuccessMessage: true,
    ...options
  };
  
  try {
    // Détection du type de compte pour optimiser la déconnexion
    const accountType = detectAccountType();
    
    // Traitement selon le type de compte
    switch (accountType) {
      case 'demo':
        await handleDemoSignOut(signOutOptions);
        break;
        
      case 'supabase':
        await handleSupabaseSignOut(signOutOptions);
        break;
        
      case 'unknown':
        console.warn('SignOut: Type de compte indéterminé, nettoyage complet');
        cleanupLocalData(true);
        if (signOutOptions.showSuccessMessage) {
          toast.success("Déconnexion effectuée");
        }
        break;
    }
    
    // Délai court pour permettre l'affichage des messages
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Redirection finale
    performRedirection(signOutOptions.redirectUrl!);
    
  } catch (error) {
    console.error('SignOut: Erreur critique lors de la déconnexion:', error);
    
    // Nettoyage d'urgence en cas d'erreur critique
    try {
      cleanupLocalData(true);
      toast.error("Erreur critique de déconnexion", {
        description: "Nettoyage d'urgence effectué"
      });
    } catch (cleanupError) {
      console.error('SignOut: Impossible de nettoyer les données:', cleanupError);
    }
    
    // Redirection de secours
    performRedirection('/');
  }
};
