
/**
 * Carte de statut temporaire PWA
 * 
 * Affiche des messages contextuels sur l'état de l'application
 * avec design médical et interactions utilisateur
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';

interface StatusCardProps {
  message: string;
  onClose: () => void;
}

/**
 * Composant de carte de statut avec design médical cohérent
 * Affiche des messages temporaires avec option de fermeture
 */
export const StatusCard: React.FC<StatusCardProps> = ({
  message,
  onClose
}) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-fade-in">
      <Card className="shadow-xl border-l-4 border-l-medical-blue backdrop-blur-sm bg-white/95">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 mb-1">
                Statut de l'application
              </p>
              <p className="text-xs text-gray-600">
                {message}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 ml-2 hover:bg-gray-100"
            >
              <X size={14} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
