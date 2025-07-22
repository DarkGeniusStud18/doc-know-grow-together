/**
 * 🔄 Gestionnaire de mises à jour OTA - React + Vite + PWA + Capacitor.js
 * 
 * Fonctionnalités complètes :
 * - Détection automatique des mises à jour
 * - Notifications utilisateur élégantes
 * - Gestion du cycle de vie du service worker
 * - Support Capacitor.js pour les applications natives
 * - Interface utilisateur intuitive avec animations
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Download, Check, X, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface UpdateState {
  hasUpdate: boolean;
  isChecking: boolean;
  isInstalling: boolean;
  updateAvailable: boolean;
  lastChecked: Date | null;
  error: string | null;
}

/**
 * 🔄 Composant de gestion des mises à jour OTA
 * Intègre detection, notification et installation automatique
 */
export const UpdateManager: React.FC = () => {
  const [updateState, setUpdateState] = useState<UpdateState>({
    hasUpdate: false,
    isChecking: false,
    isInstalling: false,
    updateAvailable: false,
    lastChecked: null,
    error: null
  });

  const [isVisible, setIsVisible] = useState(false);

  /**
   * 🔍 Vérification des mises à jour disponibles
   * Interroge le service worker et vérifie les nouvelles versions
   */
  const checkForUpdates = useCallback(async () => {
    setUpdateState(prev => ({ 
      ...prev, 
      isChecking: true, 
      error: null 
    }));

    try {
      console.log('🔍 UpdateManager: Vérification des mises à jour...');
      
      // Vérification du support des service workers
      if (!('serviceWorker' in navigator)) {
        console.warn('⚠️ Service Workers non supportés');
        setUpdateState(prev => ({ 
          ...prev, 
          isChecking: false,
          error: 'Service Workers non supportés'
        }));
        return;
      }

      // Obtention des registrations du service worker
      const registrations = await navigator.serviceWorker.getRegistrations();
      
      for (const registration of registrations) {
        // Force la vérification d'une nouvelle version
        await registration.update();
        console.log('🔄 Service worker mis à jour:', registration.scope);
        
        // Vérifie s'il y a un service worker en attente
        if (registration.waiting) {
          console.log('✅ Mise à jour détectée!');
          setUpdateState(prev => ({ 
            ...prev, 
            hasUpdate: true, 
            updateAvailable: true,
            lastChecked: new Date(),
            isChecking: false
          }));
          
          setIsVisible(true);
          
          // Affiche une notification toast
          toast({
            title: "🚀 Mise à jour disponible",
            description: "Une nouvelle version de l'application est prête à être installée.",
            duration: 10000,
          });
          
          return;
        }
      }
      
      // Aucune mise à jour trouvée
      setUpdateState(prev => ({ 
        ...prev, 
        isChecking: false,
        lastChecked: new Date(),
        hasUpdate: false 
      }));
      
      console.log('✅ Application à jour');
      
    } catch (error) {
      console.error('❌ Erreur lors de la vérification des mises à jour:', error);
      setUpdateState(prev => ({ 
        ...prev, 
        isChecking: false,
        error: 'Erreur de vérification' 
      }));
      
      toast({
        title: "❌ Erreur de mise à jour",
        description: "Impossible de vérifier les mises à jour. Réessayez plus tard.",
        variant: "destructive"
      });
    }
  }, []);

  /**
   * 📥 Installation de la mise à jour disponible
   * Active le nouveau service worker et recharge l'application
   */
  const installUpdate = useCallback(async () => {
    setUpdateState(prev => ({ ...prev, isInstalling: true }));
    
    try {
      console.log('📥 Installation de la mise à jour...');
      
      const registrations = await navigator.serviceWorker.getRegistrations();
      
      for (const registration of registrations) {
        if (registration.waiting) {
          // Envoie un message au service worker en attente pour qu'il prenne le contrôle
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          
          // Écoute le changement de service worker actif
          registration.addEventListener('updatefound', () => {
            console.log('🔄 Nouveau service worker trouvé');
          });

          // Attendre que le nouveau service worker prenne le contrôle
          const newWorker = registration.installing || registration.waiting;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'activated') {
                console.log('✅ Nouveau service worker activé');
                
                toast({
                  title: "✅ Mise à jour installée",
                  description: "L'application va se recharger pour appliquer les changements.",
                  duration: 3000,
                });
                
                // Recharge l'application après un petit délai
                setTimeout(() => {
                  window.location.reload();
                }, 1500);
              }
            });
          }
          
          break;
        }
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'installation:', error);
      setUpdateState(prev => ({ 
        ...prev, 
        isInstalling: false,
        error: 'Erreur d\'installation' 
      }));
      
      toast({
        title: "❌ Erreur d'installation",
        description: "Impossible d'installer la mise à jour. Réessayez.",
        variant: "destructive"
      });
    }
  }, []);

  /**
   * 🚫 Ignorer cette mise à jour
   */
  const dismissUpdate = useCallback(() => {
    setIsVisible(false);
    setUpdateState(prev => ({ 
      ...prev, 
      hasUpdate: false, 
      updateAvailable: false 
    }));
    
    toast({
      title: "📝 Mise à jour ignorée",
      description: "Vous pourrez l'installer plus tard depuis les paramètres.",
    });
  }, []);

  /**
   * ⚡ Configuration des événements du service worker
   * Écoute les mises à jour automatiquement
   */
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Vérification initiale
      checkForUpdates();
      
      // Vérification périodique toutes les 30 minutes
      const interval = setInterval(checkForUpdates, 30 * 60 * 1000);
      
      // Écoute des événements du service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SW_UPDATE_AVAILABLE') {
          console.log('📢 Mise à jour détectée via message SW');
          checkForUpdates();
        }
      });
      
      // Écoute des changements de contrôleur (nouveau SW actif)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('🔄 Nouveau service worker actif');
        window.location.reload();
      });
      
      return () => {
        clearInterval(interval);
      };
    }
  }, [checkForUpdates]);

  // N'affiche rien si aucune mise à jour
  if (!isVisible && !updateState.hasUpdate) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top-2 duration-500">
      <Card className="shadow-2xl border-2 border-medical-teal/20 backdrop-blur-lg bg-white/95 max-w-sm">
        <CardContent className="p-4">
          {/* 🎯 Header avec icône et titre */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Download className="w-5 h-5 text-medical-teal" />
                {updateState.isInstalling && (
                  <div className="absolute -inset-1">
                    <div className="w-7 h-7 border-2 border-medical-teal/20 border-t-medical-teal rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Mise à jour disponible</h3>
                <p className="text-xs text-gray-600">Nouvelle version prête</p>
              </div>
            </div>
            
            {/* Badge de version */}
            <Badge variant="secondary" className="bg-medical-teal/10 text-medical-teal">
              v2.0+
            </Badge>
          </div>

          {/* 📝 Description */}
          <div className="mb-4 space-y-2">
            <p className="text-sm text-gray-700">
              Une mise à jour contenant de nouvelles fonctionnalités et améliorations est disponible.
            </p>
            
            {updateState.lastChecked && (
              <p className="text-xs text-gray-500">
                Vérifiée le {updateState.lastChecked.toLocaleTimeString('fr-FR')}
              </p>
            )}
            
            {updateState.error && (
              <div className="flex items-center space-x-1 text-red-600 text-xs">
                <AlertCircle className="w-3 h-3" />
                <span>{updateState.error}</span>
              </div>
            )}
          </div>

          {/* 🎛️ Boutons d'action */}
          <div className="flex space-x-2">
            <Button
              onClick={installUpdate}
              disabled={updateState.isInstalling}
              className="flex-1 bg-medical-teal hover:bg-medical-navy"
              size="sm"
            >
              {updateState.isInstalling ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Installation...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Installer
                </>
              )}
            </Button>
            
            <Button
              onClick={dismissUpdate}
              variant="outline"
              size="sm"
              disabled={updateState.isInstalling}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* 🔄 Bouton de vérification manuelle */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <Button
              onClick={checkForUpdates}
              variant="ghost"
              size="sm"
              disabled={updateState.isChecking || updateState.isInstalling}
              className="w-full text-xs"
            >
              {updateState.isChecking ? (
                <>
                  <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
                  Vérification...
                </>
              ) : (
                <>
                  <RefreshCw className="w-3 h-3 mr-2" />
                  Vérifier maintenant
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};