
/**
 * Composant PWA Status optimisé sans boucles infinies
 * 
 * Version corrigée qui évite les re-renders excessifs
 */

import React from 'react';
import { usePWAStatus } from '@/hooks/usePWAStatus';

/**
 * Composant d'affichage du statut PWA
 * Version simplifiée pour éviter les problèmes de performance
 */
const PWAStatus: React.FC = () => {
  const { isOnline, isInstalled, canInstall } = usePWAStatus();

  // Masquer sur mobile/tablette car intégré dans MobileTopBar
  return (
    <div className="hidden lg:block fixed bottom-4 left-4 z-50">
      <div className={`
        flex items-center space-x-2 px-3 py-2 rounded-full shadow-lg transition-all duration-300 backdrop-blur-sm
        ${isOnline 
          ? 'bg-green-100/90 text-green-800 border border-green-200' 
          : 'bg-red-100/90 text-red-800 border border-red-200 animate-pulse'
        }
      `}>
        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-600' : 'bg-red-600'}`}></div>
        <span className="text-xs font-medium">
          {isOnline ? 'En ligne' : 'Hors ligne'}
        </span>
        {isInstalled && (
          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
        )}
        {canInstall && (
          <div className="w-2 h-2 rounded-full bg-purple-600"></div>
        )}
      </div>
    </div>
  );
};

export default PWAStatus;
