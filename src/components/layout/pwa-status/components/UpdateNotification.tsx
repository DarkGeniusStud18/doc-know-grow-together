
/**
 * Composant de notification de mise à jour PWA
 * 
 * Affiche une notification pour les mises à jour disponibles
 * avec gestion des interactions utilisateur
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';

interface UpdateNotificationProps {
  onUpdate: () => Promise<void>;
}

/**
 * Composant de notification de mise à jour avec design cohérent
 * Gère l'affichage et l'interaction pour les mises à jour PWA
 */
export const UpdateNotification: React.FC<UpdateNotificationProps> = ({
  onUpdate
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Gestionnaire de mise à jour avec gestion d'état
   */
  const handleUpdate = async () => {
    try {
      setIsProcessing(true);
      await onUpdate();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 animate-fade-in">
      <Card className="shadow-xl border-l-4 border-l-blue-500 backdrop-blur-sm bg-white/95">
        <CardContent className="p-3">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 flex-1">
              <RefreshCw size={16} className="text-blue-600" />
              <span className="text-sm font-medium">Mise à jour disponible</span>
            </div>
            <Button
              onClick={handleUpdate}
              disabled={isProcessing}
              size="sm"
              variant="outline"
              className="ml-2 hover:bg-blue-50"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 border border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                  <span>Mise à jour...</span>
                </div>
              ) : (
                'Mettre à jour'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
