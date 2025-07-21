
/**
 * ✨ Composant de blob magique animé pour navigation mobile
 * 
 * Fonctionnalités :
 * - Animation fluide du blob de sélection avec gradient médical
 * - Synchronisation avec les positions des éléments de navigation
 * - Effets visuels optimisés pour performance 60fps
 * - Transitions CSS natives pour fluidité maximale
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { BlobPosition } from '../types';

interface NavigationBlobProps {
  blobPosition: BlobPosition;
}

/**
 * Blob magique animé avec gradient médical
 * Optimisé pour les animations fluides de navigation Magic Navbar
 */
export const NavigationBlob: React.FC<NavigationBlobProps> = ({ blobPosition }) => {
  return (
    <div
      className={cn(
        "absolute h-12 sm:h-14 bg-gradient-to-r from-medical-blue via-medical-teal to-medical-blue rounded-xl transition-all duration-500 ease-out shadow-lg opacity-0",
        blobPosition.opacity > 0 && "opacity-100 shadow-xl"
      )}
      style={{
        left: `${blobPosition.left}px`,
        width: `${blobPosition.width}px`,
        top: '6px',
        transform: 'translateX(0)',
        background: blobPosition.opacity > 0 
          ? 'linear-gradient(135deg, #0077B6 0%, #00B4D8 50%, #0077B6 100%)'
          : undefined
      }}
      aria-hidden="true"
    />
  );
};
