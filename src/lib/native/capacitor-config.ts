
/**
 * Configuration des fonctionnalités natives Capacitor pour MedCollab
 * Gère les deep links, les notifications, et l'intégration native
 */

import { isNativeEnvironment } from '@/integrations/supabase/client';

/**
 * Configuration des deep links pour l'authentification
 */
export const DEEP_LINK_CONFIG = {
  scheme: 'com.medcollabmedoc.app',
  authCallback: 'com.medcollabmedoc.app://auth-callback',
  emailConfirmation: 'com.medcollabmedoc.app://email-confirmation',
  passwordReset: 'com.medcollabmedoc.app://password-reset'
};

/**
 * Configuration des URLs pour différents environnements
 */
export const getEnvironmentConfig = () => {
  const isNative = isNativeEnvironment();
  
  return {
    baseUrl: isNative ? DEEP_LINK_CONFIG.scheme : window.location.origin,
    authCallback: isNative ? DEEP_LINK_CONFIG.authCallback : `${window.location.origin}/auth-callback`,
    emailConfirmation: isNative ? DEEP_LINK_CONFIG.emailConfirmation : `${window.location.origin}/email-confirmation`,
    passwordReset: isNative ? DEEP_LINK_CONFIG.passwordReset : `${window.location.origin}/password-recovery`
  };
};

/**
 * Initialisation des fonctionnalités natives au démarrage de l'application
 */
export const initializeNativeFeatures = async () => {
  if (!isNativeEnvironment()) {
    console.log('🌐 Environnement web détecté - Fonctionnalités natives désactivées');
    return;
  }

  console.log('📱 Initialisation des fonctionnalités natives Capacitor...');

  try {
    // Configuration de la barre de statut
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    await StatusBar.setStyle({ style: Style.Light });
    await StatusBar.setBackgroundColor({ color: '#1e40af' }); // Couleur medical-blue
    console.log('✅ Barre de statut configurée');
  } catch (error) {
    console.log('⚠️ Configuration de la barre de statut échouée:', error);
  }

  try {
    // Configuration du clavier virtuel
    const { Keyboard } = await import('@capacitor/keyboard');
    
    // Écouteur pour ajuster l'interface lors de l'apparition du clavier
    Keyboard.addListener('keyboardWillShow', (info) => {
      console.log('⌨️ Clavier affiché - Hauteur:', info.keyboardHeight);
      document.body.style.paddingBottom = `${info.keyboardHeight}px`;
    });

    Keyboard.addListener('keyboardWillHide', () => {
      console.log('⌨️ Clavier masqué');
      document.body.style.paddingBottom = '0px';
    });
    
    console.log('✅ Gestion du clavier configurée');
  } catch (error) {
    console.log('⚠️ Configuration du clavier échouée:', error);
  }

  try {
    // Configuration de la gestion de l'application
    const { App } = await import('@capacitor/app');
    
    // Gestion des liens entrants (deep links)
    App.addListener('appUrlOpen', (event) => {
      console.log('🔗 Deep link reçu:', event.url);
      
      // Routage des deep links d'authentification
      if (event.url.includes('auth-callback')) {
        window.location.href = '/auth-callback';
      } else if (event.url.includes('email-confirmation')) {
        window.location.href = '/email-confirmation';
      } else if (event.url.includes('password-reset')) {
        window.location.href = '/password-recovery';
      }
    });

    // Gestion de l'état de l'application (foreground/background)
    App.addListener('appStateChange', (state) => {
      console.log('📱 État de l\'application:', state.isActive ? 'active' : 'arrière-plan');
      
      if (state.isActive) {
        // Vérification de la session lors du retour en foreground
        console.log('🔄 Application redevenue active - Vérification de la session...');
        // Ici vous pourriez déclencher une vérification de session
      }
    });
    
    console.log('✅ Gestion de l\'application configurée');
  } catch (error) {
    console.log('⚠️ Configuration de l\'application échouée:', error);
  }

  console.log('🚀 Initialisation native terminée');
};

/**
 * Utilitaires pour les fonctionnalités natives spécifiques
 */
export const NativeUtils = {
  /**
   * Partage de contenu natif
   */
  share: async (title: string, text: string, url?: string) => {
    if (!isNativeEnvironment()) {
      // Fallback web avec l'API Web Share si disponible
      if (navigator.share) {
        return navigator.share({ title, text, url });
      }
      console.log('📤 Partage non disponible en environnement web');
      return;
    }

    try {
      const { Share } = await import('@capacitor/share');
      return Share.share({ title, text, url });
    } catch (error) {
      console.log('❌ Erreur de partage:', error);
    }
  },

  /**
   * Feedback haptique avec intensité variable
   */
  hapticFeedback: async (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!isNativeEnvironment()) return;

    try {
      const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
      const styles = {
        light: ImpactStyle.Light,
        medium: ImpactStyle.Medium,
        heavy: ImpactStyle.Heavy
      };
      return Haptics.impact({ style: styles[type] });
    } catch (error) {
      console.log('🔇 Feedback haptique non disponible:', error);
    }
  },

  /**
   * Vérification de la connectivité réseau
   */
  getNetworkStatus: async () => {
    if (!isNativeEnvironment()) {
      return { connected: navigator.onLine, connectionType: 'unknown' };
    }

    try {
      const { Network } = await import('@capacitor/network');
      return Network.getStatus();
    } catch (error) {
      console.log('🌐 Statut réseau non disponible:', error);
      return { connected: true, connectionType: 'unknown' };
    }
  }
};
