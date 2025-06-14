
/**
 * Composant d'invitation à l'installation PWA
 * 
 * Affiche une invitation élégante pour installer l'application
 * avec gestion complète des interactions utilisateur
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X, Smartphone } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface InstallPromptProps {
  installPromptEvent: any;
  onInstall: () => Promise<void>;
  onDismiss: () => void;
}

/**
 * Composant d'invitation à l'installation avec design médical
 * Gère l'interaction utilisateur pour l'installation PWA
 */
export const InstallPrompt: React.FC<InstallPromptProps> = ({
  installPromptEvent,
  onInstall,
  onDismiss
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Gestionnaire d'installation avec gestion d'état
   */
  const handleInstall = async () => {
    if (!installPromptEvent) {
      console.warn('PWAStatus: Aucun événement d\'installation disponible');
      toast.error('Installation non disponible', {
        description: 'Veuillez utiliser le menu "Ajouter à l\'écran d\'accueil" de votre navigateur',
        duration: 5000
      });
      return;
    }

    try {
      setIsProcessing(true);
      await onInstall();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-50 max-w-sm animate-slide-in-right">
      <Card className="shadow-xl border-l-4 border-l-medical-teal backdrop-blur-sm bg-white/95">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-r from-medical-teal to-medical-blue rounded-lg flex items-center justify-center">
                <Smartphone size={20} className="text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Installer MedCollab
              </h3>
              <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                Accédez instantanément à vos outils d'étude en installant l'application sur votre appareil.
              </p>
              <div className="flex space-x-2">
                <Button
                  onClick={handleInstall}
                  disabled={isProcessing}
                  size="sm"
                  className="flex items-center space-x-1 bg-medical-teal hover:bg-medical-teal/90 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="w-3 h-3 border border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Download size={14} />
                  )}
                  <span>{isProcessing ? 'Installation...' : 'Installer'}</span>
                </Button>
                <Button
                  onClick={onDismiss}
                  variant="ghost"
                  size="sm"
                  className="text-xs hover:bg-gray-100"
                  disabled={isProcessing}
                >
                  Plus tard
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
