
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, X, Smartphone, Wifi, WifiOff } from 'lucide-react';

// Interface pour l'événement d'installation PWA
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

/**
 * Composant pour l'invite d'installation PWA
 * Gère l'affichage de la notification d'installation de l'application
 * et fournit des informations sur le statut de connexion
 */
export const PWAInstallPrompt: React.FC = () => {
  // État pour l'événement d'installation différé
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  // État pour contrôler l'affichage de l'invite
  const [showPrompt, setShowPrompt] = useState(false);
  // État pour le statut de connexion réseau
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  // État pour le statut de l'installation
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Gestionnaire pour l'événement d'installation PWA
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA: Invite d\'installation déclenchée');
      e.preventDefault(); // Empêche l'affichage automatique de l'invite
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Vérifier si l'utilisateur a déjà refusé l'installation
      const hasDeclined = localStorage.getItem('pwa-install-declined');
      const declineTimestamp = localStorage.getItem('pwa-install-decline-time');
      
      // Afficher l'invite seulement si pas refusée ou si plus de 7 jours se sont écoulés
      if (!hasDeclined || (declineTimestamp && Date.now() - parseInt(declineTimestamp) > 7 * 24 * 60 * 60 * 1000)) {
        setShowPrompt(true);
      }
    };

    // Gestionnaires pour le statut de connexion
    const handleOnline = () => {
      console.log('PWA: Connexion réseau restaurée');
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.log('PWA: Connexion réseau perdue');
      setIsOnline(false);
    };

    // Gestionnaire pour l'installation réussie
    const handleAppInstalled = () => {
      console.log('PWA: Application installée avec succès');
      setShowPrompt(false);
      setDeferredPrompt(null);
      // Supprimer les marqueurs de refus car l'app est maintenant installée
      localStorage.removeItem('pwa-install-declined');
      localStorage.removeItem('pwa-install-decline-time');
    };

    // Enregistrement des event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Vérification si l'app est déjà en mode standalone (installée)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        window.matchMedia('(display-mode: fullscreen)').matches ||
                        (window.navigator as any).standalone === true;
                        
    if (isStandalone) {
      console.log('PWA: Application déjà installée en mode standalone');
      setShowPrompt(false);
    }

    // Nettoyage des event listeners
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  /**
   * Gère le processus d'installation de la PWA
   */
  const handleInstall = async () => {
    if (!deferredPrompt) {
      console.log('PWA: Aucune invite d\'installation disponible');
      return;
    }

    try {
      setIsInstalling(true);
      console.log('PWA: Démarrage du processus d\'installation');
      
      // Déclencher l'invite d'installation native
      await deferredPrompt.prompt();
      
      // Attendre la réponse de l'utilisateur
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA: Installation acceptée par l\'utilisateur');
        // L'événement 'appinstalled' se chargera de nettoyer l'état
      } else {
        console.log('PWA: Installation refusée par l\'utilisateur');
        // Marquer le refus pour éviter de redemander trop souvent
        localStorage.setItem('pwa-install-declined', 'true');
        localStorage.setItem('pwa-install-decline-time', Date.now().toString());
      }
      
      // Nettoyer l'état local
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('PWA: Erreur lors de l\'installation:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  /**
   * Gère le refus de l'installation
   */
  const handleDismiss = () => {
    console.log('PWA: Invite d\'installation fermée manuellement');
    setShowPrompt(false);
    setDeferredPrompt(null);
    
    // Marquer le refus temporaire (moins restrictif que le refus de l'installation)
    localStorage.setItem('pwa-install-decline-time', Date.now().toString());
  };

  // Ne pas afficher l'invite si les conditions ne sont pas remplies
  if (!showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-xl border-2 border-medical-teal/20 bg-white/95 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-medical-teal" />
            <CardTitle className="text-lg text-medical-navy">
              Installer MedCollab
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-6 w-6 p-0 hover:bg-gray-100"
            disabled={isInstalling}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription className="text-sm text-gray-600">
          Installez l'application pour un accès rapide, des notifications et 
          une utilisation hors ligne optimisée.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3">
        {/* Indicateur de statut de connexion */}
        <div className="flex items-center gap-2 text-xs">
          {isOnline ? (
            <>
              <Wifi className="h-3 w-3 text-green-500" />
              <span className="text-green-600">En ligne - Prêt pour l'installation</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3 text-orange-500" />
              <span className="text-orange-600">Hors ligne - Installation disponible</span>
            </>
          )}
        </div>

        {/* Avantages de l'installation */}
        <div className="bg-medical-light/50 rounded-lg p-3 text-xs space-y-1">
          <p className="font-medium text-medical-navy">Avantages :</p>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Accès instantané depuis l'écran d'accueil</li>
            <li>Fonctionnement hors ligne optimisé</li>
            <li>Notifications importantes</li>
            <li>Interface plein écran</li>
          </ul>
        </div>

        {/* Bouton d'installation */}
        <Button 
          onClick={handleInstall} 
          className="w-full bg-medical-teal hover:bg-medical-teal/90 text-white"
          disabled={isInstalling}
        >
          {isInstalling ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Installation...
            </div>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Installer l'application
            </>
          )}
        </Button>

        {/* Note sur la compatibilité */}
        <p className="text-xs text-gray-500 text-center">
          Compatible avec tous les navigateurs modernes
        </p>
      </CardContent>
    </Card>
  );
};
