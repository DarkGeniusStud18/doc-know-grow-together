
/**
 * Types et interfaces pour le composant Navbar
 * 
 * Définitions TypeScript pour tous les éléments de navigation
 * et les propriétés du composant Navbar
 */

import { LucideIcon } from 'lucide-react';

/**
 * Interface pour les propriétés du composant Navbar
 */
export interface NavbarProps {
  simplified?: boolean; // Mode simplifié pour les pages publiques et de connexion
}

/**
 * Interface pour les éléments de navigation
 * Compatible avec les types Lucide React pour les icônes
 */
export interface NavItem {
  icon: LucideIcon; // Type strict pour compatibilité avec Lucide
  label: string;
  href: string;
  requiresAuth: boolean;          // Indique si l'authentification est requise
  showInSimplified?: boolean;     // Affichage en mode simplifié
}
