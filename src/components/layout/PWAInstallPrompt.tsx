
/**
 * 📱 Composant d'invite d'installation PWA - Version améliorée
 * 
 * Fonctionnalités :
 * - Détection automatique de la possibilité d'installation
 * - Affichage intelligent selon les préférences utilisateur
 * - Gestion des états de connexion réseau
 * - Interface moderne et accessible
 * - Support multi-navigateur
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, X, Smartphone, Wifi, WifiOff, Monitor } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

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
 * 📱 Composant pour l'invite d'installation PWA
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
  // État pour détecter si déjà installé
  const [isAlreadyInstalled, setIsAlreadyInstalled] = useState(false);

  useEffect(() => {
    console.log('🔍 PWAInstallPrompt: Initialisation du composant');

    // Vérifier si l'application est déjà installée
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          window.matchMedia('(display-mode: fullscreen)').matches ||
                          (window.navigator as any).standalone === true;
      
      if (isStandalone) {
        console.log('📱 PWA déjà installée en mode standalone');
        setIsAlreadyInstalled(true);
        return true;
      }
      return false;
    };

    // Gestionnaire pour l'événement d'installation PWA
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('📥 PWA: Invite d\'installation déclenchée');
      e.preventDefault(); // Empêche l'affichage automatique de l'invite
      
      if (checkIfInstalled()) {
        return; // Déjà installé, ne pas afficher l'invite
      }

      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Vérifier les préférences de l'utilisateur
      const hasDeclined = localStorage.getItem('pwa-install-declined');
      const declineTimestamp = localStorage.getItem('pwa-install-decline-time');
      
      // Afficher l'invite si jamais refusée ou si plus de 1 jour s'est écoulé
      if (!hasDeclined || (declineTimestamp && Date.now() - parseInt(declineTimestamp) > 24 * 60 * 60 * 1000)) {
        console.log('📱 Affichage de l\'invite d\'installation PWA');
        setShowPrompt(true);
        
        // Toast d'information pour attirer l'attention
        toast.info('📱 Installation disponible', {
          description: 'MedCollab peut être installé sur votre appareil !',
          duration: 5000,
          action: {
            label: 'Installer',
            onClick: () => setShowPrompt(true)
          }
        });
      }
    };

    // Gestionnaires pour the statut de connexion
    const handleOnline = () => {
      console.log('🌐 PWA: Connexion réseau restaurée');
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.log('📴 PWA: Connexion réseau perdue');
      setIsOnline(false);
    };

    // Gestionnaire pour l'installation réussie
    const handleAppInstalled = () => {
      console.log('✅ PWA: Application installée avec succès');
      setShowPrompt(false);
      setDeferredPrompt(null);
      setIsAlreadyInstalled(true);
      
      // Supprimer les marqueurs de refus car l'app est maintenant installée
      localStorage.removeItem('pwa-install-declined');
      localStorage.removeItem('pwa-install-decline-time');
      
      // Toast de confirmation
      toast.success('🎉 Installation réussie !', {
        description: 'MedCollab est maintenant disponible sur votre écran d\'accueil',
        duration: 5000
      });
    };

    // Vérification initiale de l'installation
    checkIfInstalled();

    // Enregistrement des event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Affichage d'une invite personnalisée pour iOS Safari (qui ne supporte pas beforeinstallprompt)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isIOSSafari = isIOS && !window.matchMedia('(display-mode: standalone)').matches;
    
    if (isIOSSafari && !checkIfInstalled()) {
      console.log('🍎 Détection iOS Safari - Affichage invite personnalisée');
      setTimeout(() => {
        setShowPrompt(true);
        toast.info('📱 Installation iOS', {
          description: 'Sur iOS, utilisez "Ajouter à l\'écran d\'accueil" dans le menu Safari',
          duration: 8000
        });
      }, 3000); // Délai pour laisser le temps à l'utilisateur de voir la page
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
   * 🚀 Gère le processus d'installation de la PWA
   */
  const handleInstall = async () => {
    if (!deferredPrompt) {
      console.log('⚠️ PWA: Aucune invite d\'installation disponible');
      
      // Instructions pour installation manuelle
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      
      let instructions = 'Utilisez le menu de votre navigateur pour "Ajouter à l\'écran d\'accueil"';
      
      if (isIOS) {
        instructions = 'Sur iOS: Appuyez sur le bouton de partage dans Safari, puis "Ajouter à l\'écran d\'accueil"';
      } else if (isAndroid) {
        instructions = 'Sur Android: Utilisez le menu Chrome "Ajouter à l\'écran d\'accueil"';
      }
      
      toast.info('📱 Installation manuelle', {
        description: instructions,
        duration: 8000
      });
      return;
    }

    try {
      setIsInstalling(true);
      console.log('🚀 PWA: Démarrage du processus d\'installation');
      
      // Déclencher l'invite d'installation native
      await deferredPrompt.prompt();
      
      // Attendre la réponse de l'utilisateur
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('✅ PWA: Installation acceptée par l\'utilisateur');
        // L'événement 'appinstalled' se chargera de nettoyer l'état
      } else {
        console.log('❌ PWA: Installation refusée par l\'utilisateur');
        // Marquer le refus pour éviter de redemander trop souvent
        localStorage.setItem('pwa-install-declined', 'true');
        localStorage.setItem('pwa-install-decline-time', Date.now().toString());
        
        toast.info('❌ Installation annulée', {
          description: 'Vous pouvez toujours installer l\'application plus tard depuis les paramètres',
          duration: 5000
        });
      }
      
      // Nettoyer l'état local
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('❌ PWA: Erreur lors de l\'installation:', error);
      toast.error('Erreur d\'installation', {
        description: 'Impossible d\'installer l\'application pour le moment',
        duration: 5000
      });
    } finally {
      setIsInstalling(false);
    }
  };

  /**
   * ❌ Gère le refus de l'installation
   */
  const handleDismiss = () => {
    console.log('👋 PWA: Invite d\'installation fermée manuellement');
    setShowPrompt(false);
    setDeferredPrompt(null);
    
    // Marquer le refus temporaire (réapparaîtra dans 24h)
    localStorage.setItem('pwa-install-decline-time', Date.now().toString());
    
    toast.info('⏰ Installation reportée', {
      description: 'L\'invite réapparaîtra dans 24 heures',
      duration: 3000
    });
  };

  // Ne pas afficher l'invite si les conditions ne sont pas remplies
  if (!showPrompt || isAlreadyInstalled) {
    return null;
  }

  return (
    <Card className="fixed bottom-20 right-4 w-80 z-50 shadow-2xl border-2 border-medical-teal/30 bg-white/98 backdrop-blur-md animate-slide-in-right">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-medical-teal to-medical-blue rounded-lg">
              <Smartphone className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg text-medical-navy">
                Installer MedCollab
              </CardTitle>
              <CardDescription className="text-xs text-gray-500">
                Application PWA disponible
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
            disabled={isInstalling}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        {/* Indicateur de statut de connexion */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <>
                <Wifi className="h-3 w-3 text-green-500" />
                <span className="text-green-600 font-medium">En ligne</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3 text-orange-500" />
                <span className="text-orange-600 font-medium">Hors ligne</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <Monitor className="h-3 w-3" />
            <span>PWA prête</span>
          </div>
        </div>

        {/* Avantages de l'installation */}
        <div className="bg-gradient-to-r from-medical-light/30 to-medical-teal/10 rounded-lg p-3 text-xs space-y-2">
          <p className="font-semibold text-medical-navy flex items-center gap-2">
            <span>🚀</span>
            Avantages de l'installation :
          </p>
          <ul className="list-none text-gray-700 space-y-1">
            <li className="flex items-center gap-2">
              <span className="text-medical-teal">•</span>
              Accès instantané depuis l'écran d'accueil
            </li>
            <li className="flex items-center gap-2">
              <span className="text-medical-teal">•</span>
              Fonctionnement hors ligne complet
            </li>
            <li className="flex items-center gap-2">
              <span className="text-medical-teal">•</span>
              Notifications push importantes
            </li>
            <li className="flex items-center gap-2">
              <span className="text-medical-teal">•</span>
              Interface native plein écran
            </li>
          </ul>
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-2">
          <Button 
            onClick={handleInstall} 
            className="flex-1 bg-gradient-to-r from-medical-teal to-medical-blue hover:from-medical-teal/90 hover:to-medical-blue/90 text-white font-medium transition-all duration-200"
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
                Installer maintenant
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleDismiss}
            className="px-3 hover:bg-gray-50"
            disabled={isInstalling}
          >
            Plus tard
          </Button>
        </div>

        {/* Note de compatibilité */}
        <p className="text-xs text-center text-gray-400 border-t pt-2">
          Compatible avec tous les navigateurs modernes
        </p>
      </CardContent>
    </Card>
  );
};
