
/**
 * Types et interfaces pour le composant DiscordSidebar
 * 
 * Définitions TypeScript pour tous les éléments de navigation
 * et les propriétés d'animation Magic Navbar
 */

import { LucideIcon } from 'lucide-react';

/**
 * Interface pour les éléments de navigation avec support des animations Magic Navbar
 * Chaque élément contient un chemin, une icône et un label pour la navigation
 */
export interface NavItemData {
  path: string;
  icon: LucideIcon;
  label: string;
}

/**
 * Interface pour la position du blob magique animé
 * Contrôle la position et l'opacité des animations fluides
 */
export interface BlobPosition {
  top: number;
  opacity: number;
}

/**
 * Interface pour les références des éléments de navigation
 * Permet le calcul précis des positions pour les animations
 */
export interface NavItemsRef {
  [key: string]: HTMLDivElement | null;
}
