
/**
 * Composant de spinner de chargement réutilisable
 * 
 * Spinner animé avec différentes tailles et couleurs
 * pour indiquer les états de chargement dans l'application
 */

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Interface des propriétés du spinner
 */
interface LoadingSpinnerProps {
  /** Taille du spinner */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Couleur du spinner */
  variant?: 'primary' | 'secondary' | 'white';
  /** Classe CSS personnalisée */
  className?: string;
  /** Message de chargement optionnel */
  message?: string;
}

/**
 * Configuration des tailles de spinner
 */
const sizeVariants = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12'
};

/**
 * Configuration des couleurs de spinner
 */
const colorVariants = {
  primary: 'border-medical-blue',
  secondary: 'border-medical-teal',
  white: 'border-white'
};

/**
 * Composant spinner de chargement avec animations fluides
 * 
 * Fonctionnalités :
 * - Plusieurs tailles disponibles
 * - Thèmes de couleurs cohérents
 * - Animation de rotation fluide
 * - Message de chargement optionnel
 * - Accessible pour les lecteurs d'écran
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  className,
  message
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {/* Spinner animé */}
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-gray-200',
          `border-t-2 ${colorVariants[variant]}`,
          sizeVariants[size],
          className
        )}
        role="status"
        aria-label="Chargement en cours"
      />
      
      {/* Message de chargement optionnel */}
      {message && (
        <p className="text-sm text-gray-600 animate-pulse">
          {message}
        </p>
      )}
      
      {/* Texte pour les lecteurs d'écran */}
      <span className="sr-only">Chargement en cours...</span>
    </div>
  );
};

export default LoadingSpinner;
