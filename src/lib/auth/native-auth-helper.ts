
/**
 * Helper d'authentification spécifique aux environnements natifs Capacitor
 * Gère les fonctionnalités natives comme les biométriques, les notifications push, etc.
 */

import { supabase, isNativeEnvironment } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

/**
 * Configuration des redirections pour l'authentification native
 * Utilise des deep links pour une meilleure expérience utilisateur mobile
 */
export const getNativeAuthConfig = () => {
  const baseUrl = isNativeEnvironment() 
    ? 'com.medcollabmedoc.app://auth' // Deep link pour l'app native
    : window.location.origin; // URL web pour le navigateur
    
  return {
    redirectTo: `${baseUrl}/auth-callback`,
    emailRedirectTo: `${baseUrl}/email-confirmation`
  };
};

/**
 * Gestion native des erreurs d'authentification avec feedback haptique
 */
export const handleNativeAuthError = async (error: any, context: string) => {
  console.error(`❌ Erreur d'authentification native [${context}]:`, error);
  
  // Feedback haptique pour les erreurs sur mobile seulement
  if (isNativeEnvironment()) {
    try {
      const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (hapticsError) {
      console.log('🔇 Haptics non disponible:', hapticsError);
    }
  }
  
  // Messages d'erreur localisés et user-friendly
  const errorMessages: Record<string, string> = {
    'Email not confirmed': 'Veuillez confirmer votre email avant de vous connecter',
    'Invalid login credentials': 'Identifiants de connexion invalides',
    'User not found': 'Aucun compte trouvé avec cette adresse email',
    'Too many requests': 'Trop de tentatives de connexion. Veuillez patienter quelques minutes',
    'Network error': 'Erreur de connexion. Vérifiez votre connexion internet'
  };
  
  const friendlyMessage = errorMessages[error.message] || 
    'Une erreur est survenue lors de l\'authentification. Veuillez réessayer.';
  
  toast.error('Erreur d\'authentification', {
    description: friendlyMessage,
    duration: 5000
  });
};

/**
 * Gestion native du succès d'authentification avec feedback haptique
 */
export const handleNativeAuthSuccess = async (user: any) => {
  console.log('✅ Authentification native réussie pour:', user?.email);
  
  // Feedback haptique pour le succès sur mobile seulement
  if (isNativeEnvironment()) {
    try {
      const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (hapticsError) {
      console.log('🔇 Haptics non disponible:', hapticsError);
    }
  }
  
  toast.success('Connexion réussie', {
    description: `Bienvenue ${user?.user_metadata?.display_name || user?.email} !`,
    duration: 3000
  });
};

/**
 * Vérifie la connectivité réseau avant les opérations d'authentification
 */
export const checkNetworkConnectivity = async (): Promise<boolean> => {
  if (!isNativeEnvironment()) {
    return navigator.onLine;
  }
  
  try {
    const { Network } = await import('@capacitor/network');
    const status = await Network.getStatus();
    return status.connected;
  } catch (error) {
    console.log('🌐 Vérification réseau non disponible:', error);
    return true; // Assume connecté si impossible de vérifier
  }
};

/**
 * Configuration des notifications push pour l'authentification (optionnel)
 */
export const setupAuthNotifications = async () => {
  if (!isNativeEnvironment()) {
    console.log('📱 Notifications push non disponibles en environnement web');
    return;
  }
  
  try {
    const { PushNotifications } = await import('@capacitor/push-notifications');
    
    // Demande de permission pour les notifications
    const permission = await PushNotifications.requestPermissions();
    
    if (permission.receive === 'granted') {
      console.log('✅ Permissions de notifications accordées');
      // Ici vous pourriez configurer des notifications pour les événements d'auth
    }
  } catch (error) {
    console.log('🔔 Configuration des notifications échouée:', error);
  }
};

/**
 * Gestion sécurisée de la déconnexion native
 */
export const nativeSignOut = async (): Promise<void> => {
  try {
    // Vérification de la connectivité avant la déconnexion
    const isConnected = await checkNetworkConnectivity();
    
    if (!isConnected) {
      toast.error('Pas de connexion internet', {
        description: 'Veuillez vous connecter à internet pour vous déconnecter'
      });
      return;
    }
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
    
    // Nettoyage du stockage local/natif
    if (isNativeEnvironment()) {
      try {
        const { Preferences } = await import('@capacitor/preferences');
        await Preferences.clear(); // Nettoyage complet pour la sécurité
        console.log('🧹 Stockage natif nettoyé après déconnexion');
      } catch (storageError) {
        console.log('⚠️ Erreur de nettoyage du stockage:', storageError);
      }
    }
    
    // Feedback haptique de succès
    if (isNativeEnvironment()) {
      try {
        const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
        await Haptics.impact({ style: ImpactStyle.Light });
      } catch (hapticsError) {
        console.log('🔇 Haptics non disponible:', hapticsError);
      }
    }
    
    toast.success('Déconnexion réussie', {
      description: 'Vous avez été déconnecté en toute sécurité'
    });
    
  } catch (error: any) {
    console.error('❌ Erreur lors de la déconnexion native:', error);
    handleNativeAuthError(error, 'déconnexion');
  }
};

/**
 * Utilitaire pour obtenir les capacités de l'appareil
 */
export const getDeviceCapabilities = async () => {
  if (!isNativeEnvironment()) {
    return {
      platform: 'web',
      hasHaptics: false,
      hasNotifications: 'Notification' in window,
      hasNetwork: 'navigator' in window && 'onLine' in navigator
    };
  }
  
  const capabilities = {
    platform: 'native',
    hasHaptics: false,
    hasNotifications: false,
    hasNetwork: false
  };
  
  try {
    // Vérification des capacités disponibles
    await import('@capacitor/haptics');
    capabilities.hasHaptics = true;
  } catch (error) {
    console.log('🔇 Haptics non disponible');
  }
  
  try {
    await import('@capacitor/push-notifications');
    capabilities.hasNotifications = true;
  } catch (error) {
    console.log('🔔 Push notifications non disponibles');
  }
  
  try {
    await import('@capacitor/network');
    capabilities.hasNetwork = true;
  } catch (error) {
    console.log('🌐 Network API non disponible');
  }
  
  return capabilities;
};
