/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Types TypeScript pour le menu secondaire mobile
 * Définit les interfaces et types utilisés dans le menu déployable
 */

import { AuthUser } from '@/hooks/useSupabaseAuth';
import { LucideProps } from 'lucide-react';

/**
 * Interface pour les propriétés de l'en-tête utilisateur
 * Contient les informations nécessaires pour afficher le profil utilisateur
 */
export interface UserHeaderProps {
  user?: AuthUser | null;
  onClose?: () => void;
}

/**
 * Interface pour un élément de navigation du menu secondaire
 * Définit la structure des éléments de menu avec icônes et actions
 */
export interface MobileSecondaryMenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>; // Changed to match MobileNavItem
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'danger';
  requiresAuth?: boolean;
  category?: string; // Added category property
  isActive?: (pathname: string) => boolean;
}

/**
 * Interface pour les éléments de navigation mobile (compatible avec MobileNavItem)
 * Structure standardisée pour tous les éléments de navigation
 */
export interface MobileNavItem {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  href: string;
  isActive?: (pathname: string) => boolean;
}

/**
 * Interface pour les propriétés du menu secondaire mobile
 * Configuration complète du menu avec éléments et callbacks
 */
export interface MobileSecondaryMenuProps {
  items: MobileSecondaryMenuItem[];
  onItemClick: (item: MobileSecondaryMenuItem) => void;
  userRole?: string;
  userName?: string;
}

/**
 * Interface pour les propriétés de la section de navigation
 * Gère l'affichage des éléments de navigation principaux
 */
export interface NavigationSectionProps {
  items: MobileSecondaryMenuItem[];
  onItemClick: (item: MobileSecondaryMenuItem) => void;
}

/**
 * Interface pour les propriétés d'un élément de navigation individuel
 * Définit les props pour le rendu d'un élément de menu
 */
export interface NavigationItemProps {
  item: MobileSecondaryMenuItem;
  isActive: boolean;
  onClick: () => void;
}

/**
 * Interface pour les propriétés de la section de déconnexion
 * Gère les actions de déconnexion utilisateur
 */
export interface LogoutSectionProps {
  onItemClick: (item: MobileSecondaryMenuItem) => void;
}

/**
 * Interface pour les propriétés du bouton de déconnexion
 * Configuration du bouton de déconnexion avec callback
 */
export interface LogoutButtonProps {
  onLogout: () => void;
  onItemClick: (item: MobileSecondaryMenuItem) => void;
}
