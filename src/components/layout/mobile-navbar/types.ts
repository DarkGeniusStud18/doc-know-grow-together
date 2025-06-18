
/**
 * Types et interfaces pour la navigation mobile avec animations Magic Navbar
 * 
 * Définitions TypeScript pour tous les éléments de navigation mobile,
 * les propriétés des composants et les états d'animation
 */

import React from 'react';

/**
 * Interface pour les éléments de navigation mobile avec support des animations
 * Définit la structure standardisée pour tous les éléments de navigation
 */
export interface MobileNavItem {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  href: string;
  isActive?: (pathname: string) => boolean; // Fonction personnalisée pour déterminer l'état actif
}

/**
 * Interface pour les propriétés du composant MagicNavIcon
 * Définit les props pour le rendu des icônes avec animations
 */
export interface MagicNavIconProps {
  item: MobileNavItem;
  showLabel?: boolean;
  isActive: boolean;
  isHovered: boolean;
  hovered: boolean; // Alias pour compatibilité
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  navItemRef?: (el: HTMLElement | null) => void;
  className?: string; // Ajout de la propriété className
}

/**
 * Interface pour la position du blob magique
 * Contrôle les animations fluides du blob flottant
 */
export interface BlobPosition {
  left: number;
  width: number;
  opacity: number;
}

/**
 * Interface pour les propriétés du menu secondaire mobile
 */
export interface MobileSecondaryMenuProps {
  items: MobileNavItem[];
  onItemClick: () => void;
}
