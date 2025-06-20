
/**
 * 📱 Composant PWA Status optimisé avec synchronisation native/web - Version améliorée
 * 
 * ✅ Améliorations apportées :
 * - Élimination complète des boucles infinies de re-render
 * - Synchronisation parfaite entre environnements natif et web
 * - Performance optimisée avec mémorisation intelligente
 * - Interface utilisateur responsive et accessible
 * - Commentaires français détaillés pour maintenance
 * - Gestion d'erreurs robuste et logging amélioré
 */

import React, { useMemo } from 'react';
import { usePWAStatus } from '@/hooks/usePWAStatus';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff, Download, Smartphone, Globe, RefreshCw } from 'lucide-react';

/**
 * 📊 Composant d'affichage du statut PWA intelligent
 * 
 * Fonctionnalités optimisées :
 * - Masquage automatique sur mobile/tablette (intégré dans MobileTopBar)
 * - Affichage desktop avec indicateurs complets
 * - Actions d'installation et mise à jour intégrées
 * - Design responsive et accessible
 * - Performance optimisée sans re-renders excessifs
 * - Support multi-plateforme (web/native)
 */
const PWAStatus: React.FC = () => {
  const { 
    isOnline, 
    isInstalled, 
    canInstall, 
    isNative, 
    platform, 
    updateAvailable,
    capabilities 
  } = usePWAStatus();

  console.log('📊 PWAStatus: Rendu avec état', { 
    isOnline, 
    isInstalled, 
    canInstall, 
    platform,
    updateAvailable 
  });

  /**
   * 🎨 Configuration du style selon l'état de connexion avec mémorisation
   */
  const connectionStyle = useMemo(() => {
    if (isOnline) {
      return {
        bgColor: 'bg-green-100/90',
        textColor: 'text-green-800',
        borderColor: 'border-green-200',
        icon: Wifi,
        text: '✅ En ligne',
        pulse: false
      };
    } else {
      return {
        bgColor: 'bg-red-100/90',
        textColor: 'text-red-800', 
        borderColor: 'border-red-200',
        icon: WifiOff,
        text: '❌ Hors ligne',
        pulse: true
      };
    }
  }, [isOnline]);

  /**
   * 🔧 Gestionnaire d'installation PWA
   */
  const handleInstall = async () => {
    console.log('📥 Tentative d\'installation PWA');
    
    try {
      const deferredPrompt = (window as any).deferredPrompt;
      
      if (deferredPrompt) {
        // 📱 Affichage de l'invite d'installation
        deferredPrompt.prompt();
        
        // ⏳ Attente de la réponse utilisateur
        const { outcome } = await deferredPrompt.userChoice;
        
        console.log('📊 Résultat installation:', outcome);
        
        // 🧹 Nettoyage de l'événement
        (window as any).deferredPrompt = null;
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'installation PWA:', error);
    }
  };

  /**
   * 🔄 Gestionnaire de mise à jour
   */
  const handleUpdate = () => {
    console.log('🔄 Rechargement pour mise à jour');
    window.location.reload();
  };

  // 📱 Masquage sur mobile/tablette car intégré dans MobileTopBar
  return (
    <div className="hidden lg:block fixed bottom-4 left-4 z-50">
      <div className={`
        flex flex-col space-y-2 p-3 rounded-xl shadow-lg transition-all duration-300 backdrop-blur-md max-w-xs
        ${connectionStyle.bgColor} ${connectionStyle.textColor} ${connectionStyle.borderColor} border
        ${connectionStyle.pulse ? 'animate-pulse' : ''}
      `}>
        
        {/* 🌐 Indicateur de connexion principal */}
        <div className="flex items-center space-x-2">
          <connectionStyle.icon size={16} />
          <span className="text-sm font-medium">{connectionStyle.text}</span>
          
          {/* 📱 Indicateur de plateforme */}
          <div className="flex items-center space-x-1 ml-auto">
            {isNative ? (
              <Smartphone size={12} className="text-blue-600" />
            ) : (
              <Globe size={12} className="text-gray-600" />
            )}
            <Badge variant="outline" className="text-xs px-1 py-0">
              {platform}
            </Badge>
          </div>
        </div>

        {/* 📊 Indicateurs d'état PWA */}
        <div className="flex items-center space-x-2 text-xs">
          {isInstalled && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Smartphone size={10} />
              <span>Installé</span>
            </Badge>
          )}
          
          {updateAvailable && (
            <Button
              size="sm"
              variant="secondary"
              onClick={handleUpdate}
              className="h-6 px-2 text-xs"
            >
              <RefreshCw size={10} className="mr-1" />
              Mettre à jour
            </Button>
          )}
          
          {canInstall && !isInstalled && (
            <Button
              size="sm"
              variant="secondary"
              onClick={handleInstall}
              className="h-6 px-2 text-xs"
            >
              <Download size={10} className="mr-1" />
              Installer
            </Button>
          )}
        </div>

        {/* 🔧 Informations de debug en mode développement */}
        {process.env.NODE_ENV === 'development' && (
          <div className="pt-2 border-t border-current/20">
            <div className="text-xs opacity-75 space-y-1">
              <div>🔧 Capacités: SW:{capabilities.hasServiceWorker ? '✅' : '❌'}</div>
              <div>📳 Vibration:{capabilities.hasVibration ? '✅' : '❌'} | 📷 Caméra:{capabilities.hasCamera ? '✅' : '❌'}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PWAStatus;
