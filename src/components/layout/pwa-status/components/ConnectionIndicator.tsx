
/**
 * Indicateur de statut de connexion PWA
 * 
 * Affiche de manière élégante le statut de connexion Internet
 * avec animations et design médical cohérent
 */

import React, { useMemo } from 'react';
import { Wifi, WifiOff, CheckCircle } from 'lucide-react';

interface ConnectionIndicatorProps {
  isOnline: boolean;
  isInstalled: boolean;
}

/**
 * Composant d'indicateur de connexion optimisé
 * Affiche le statut en ligne/hors ligne avec design médical
 */
export const ConnectionIndicator: React.FC<ConnectionIndicatorProps> = ({
  isOnline,
  isInstalled
}) => {
  /**
   * Mémorisation des styles d'indicateur pour éviter les re-calculs
   */
  const connectionIndicatorStyles = useMemo(() => ({
    container: `
      flex items-center space-x-2 px-3 py-2 rounded-full shadow-lg transition-all duration-300 backdrop-blur-sm
      ${isOnline 
        ? 'bg-green-100/90 text-green-800 border border-green-200' 
        : 'bg-red-100/90 text-red-800 border border-red-200 animate-pulse'
      }
    `,
    icon: isOnline ? 'text-green-600' : 'text-red-600',
    text: 'text-xs font-medium'
  }), [isOnline]);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className={connectionIndicatorStyles.container}>
        {isOnline ? (
          <Wifi size={16} className={connectionIndicatorStyles.icon} />
        ) : (
          <WifiOff size={16} className={connectionIndicatorStyles.icon} />
        )}
        <span className={connectionIndicatorStyles.text}>
          {isOnline ? 'En ligne' : 'Hors ligne'}
        </span>
        {isInstalled && (
          <CheckCircle size={14} className="text-blue-600 ml-1" />
        )}
      </div>
    </div>
  );
};
