
/**
 * Indicateur de statut de connexion PWA optimisé
 * 
 * Version corrigée qui évite les boucles infinies et s'adapte au contexte
 */

import React, { useMemo } from 'react';
import { Wifi, WifiOff, CheckCircle } from 'lucide-react';

interface ConnectionIndicatorProps {
  isOnline: boolean;
  isInstalled: boolean;
  compact?: boolean; // Nouvelle prop pour un affichage compact
}

/**
 * Composant d'indicateur de connexion optimisé
 * Affiche le statut en ligne/hors ligne avec design médical
 */
export const ConnectionIndicator: React.FC<ConnectionIndicatorProps> = ({
  isOnline,
  isInstalled,
  compact = false
}) => {
  /**
   * Styles adaptatifs selon le mode compact ou normal
   */
  const indicatorStyles = useMemo(() => ({
    container: compact ? `
      flex items-center space-x-2 px-2 py-1 rounded-full transition-all duration-300
      ${isOnline 
        ? 'bg-green-50 text-green-700' 
        : 'bg-red-50 text-red-700'
      }
    ` : `
      flex items-center space-x-2 px-3 py-2 rounded-full shadow-lg transition-all duration-300 backdrop-blur-sm
      ${isOnline 
        ? 'bg-green-100/90 text-green-800 border border-green-200' 
        : 'bg-red-100/90 text-red-800 border border-red-200 animate-pulse'
      }
    `,
    icon: isOnline ? 'text-green-600' : 'text-red-600',
    text: compact ? 'text-xs font-medium' : 'text-xs font-medium'
  }), [isOnline, compact]);

  return (
    <div className={indicatorStyles.container}>
      {!compact && (
        <>
          {isOnline ? (
            <Wifi size={16} className={indicatorStyles.icon} />
          ) : (
            <WifiOff size={16} className={indicatorStyles.icon} />
          )}
        </>
      )}
      <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-600' : 'bg-red-600'}`}></div>
      <span className={indicatorStyles.text}>
        {isOnline ? 'En ligne' : 'Hors ligne'}
      </span>
      {isInstalled && (
        <CheckCircle size={12} className="text-blue-600" />
      )}
    </div>
  );
};
