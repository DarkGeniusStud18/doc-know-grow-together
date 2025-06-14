
/**
 * Hook pour les actions PWA (installation, mise à jour)
 * 
 * Centralise la logique métier des actions PWA
 * avec gestion d'erreurs et notifications
 */

import { useCallback } from 'react';
import { toast } from '@/components/ui/sonner';

interface PWAActionsProps {
  installPromptEvent: any;
  setPwaState: (updater: (prev: any) => any) => void;
  onInstallSuccess?: () => void;
  onUpdateAvailable?: () => void;
}

/**
 * Hook pour les actions PWA avec gestion complète des interactions
 */
export const usePWAActions = ({
  installPromptEvent,
  setPwaState,
  onInstallSuccess,
  onUpdateAvailable
}: PWAActionsProps) => {

  /**
   * Gestionnaire d'installation PWA avec gestion d'état complète
   */
  const handleInstallApp = useCallback(async () => {
    if (!installPromptEvent) {
      console.warn('PWAStatus: Aucun événement d\'installation disponible');
      throw new Error('Installation non disponible');
    }

    try {
      console.log('PWAStatus: Déclenchement de l\'installation PWA');
      
      // Affichage du prompt d'installation natif
      await installPromptEvent.prompt();
      
      // Attendre la réponse de l'utilisateur
      const { outcome } = await installPromptEvent.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWAStatus: Installation acceptée par l\'utilisateur');
        
        setPwaState(prev => ({
          ...prev,
          isInstalled: true,
          showInstallPrompt: false,
          installPromptEvent: null
        }));
        
        // Supprimer les marqueurs de refus
        localStorage.removeItem('pwa-install-declined');
        localStorage.removeItem('pwa-install-decline-time');
        
        // Callback de succès
        onInstallSuccess?.();
        
        toast.success('Installation réussie !', {
          description: 'MedCollab est maintenant installé sur votre appareil',
          duration: 5000,
          action: {
            label: 'Ouvrir l\'app',
            onClick: () => window.location.href = '/'
          }
        });
      } else {
        console.log('PWAStatus: Installation refusée par l\'utilisateur');
        
        // Marquer le refus pour éviter de redemander trop souvent
        localStorage.setItem('pwa-install-declined', 'true');
        localStorage.setItem('pwa-install-decline-time', Date.now().toString());
        
        toast.info('Installation annulée', {
          description: 'Vous pouvez toujours installer l\'application plus tard',
          duration: 3000
        });
      }
      
      // Nettoyer l'état local
      setPwaState(prev => ({
        ...prev,
        showInstallPrompt: false,
        installPromptEvent: null
      }));
      
    } catch (error) {
      console.error('PWAStatus: Erreur lors de l\'installation:', error);
      toast.error('Erreur d\'installation', {
        description: 'Impossible d\'installer l\'application pour le moment',
        duration: 5000
      });
      throw error;
    }
  }, [installPromptEvent, onInstallSuccess, setPwaState]);

  /**
   * Gestionnaire de refus de l'installation
   */
  const handleDismissInstall = useCallback(() => {
    console.log('PWAStatus: Invite d\'installation fermée manuellement');
    setPwaState(prev => ({
      ...prev,
      showInstallPrompt: false,
      installPromptEvent: null
    }));
    
    // Marquer le refus temporaire (moins restrictif que le refus de l'installation)
    localStorage.setItem('pwa-install-decline-time', Date.now().toString());
  }, [setPwaState]);

  /**
   * Gestionnaire de mise à jour PWA avec vérification intelligente
   */
  const handleUpdateApp = useCallback(async () => {
    try {
      console.log('PWAStatus: Vérification des mises à jour PWA');
      
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        
        if (registration) {
          // Déclenchement de la vérification de mise à jour
          await registration.update();
          
          // Vérification si une mise à jour est en attente
          if (registration.waiting) {
            console.log('PWAStatus: Mise à jour trouvée, activation en cours');
            
            // Message au service worker pour passer à la nouvelle version
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            
            onUpdateAvailable?.();
            
            toast.success('Mise à jour installée', {
              description: 'L\'application va redémarrer automatiquement dans 3 secondes',
              duration: 3000
            });
            
            // Rechargement de la page après un délai pour permettre la lecture
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          } else {
            console.log('PWAStatus: Aucune mise à jour disponible');
            toast.info('Application à jour', {
              description: 'Vous utilisez déjà la dernière version de MedCollab',
              duration: 3000,
              action: {
                label: 'Parfait',
                onClick: () => console.log('Version confirmée')
              }
            });
          }
        } else {
          throw new Error('Service Worker non enregistré');
        }
      } else {
        throw new Error('Service Worker non supporté');
      }
    } catch (error) {
      console.error('PWAStatus: Erreur lors de la mise à jour:', error);
      toast.error('Erreur de mise à jour', {
        description: 'Impossible de vérifier les mises à jour pour le moment',
        duration: 5000
      });
      throw error;
    }
  }, [onUpdateAvailable]);

  return {
    handleInstallApp,
    handleDismissInstall,
    handleUpdateApp
  };
};
