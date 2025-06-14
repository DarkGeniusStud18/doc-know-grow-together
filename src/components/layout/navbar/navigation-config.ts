
/**
 * Configuration des éléments de navigation pour la Navbar
 * 
 * Organisation centralisée de tous les éléments de navigation
 * selon les priorités et les fonctionnalités disponibles
 */

import { 
  Home, 
  BookOpen, 
  Users, 
  User
} from 'lucide-react';
import { NavItem } from './types';

/**
 * Configuration des éléments de navigation organisés par priorité
 * Ordre basé sur l'importance et la fréquence d'utilisation
 */
export const navigationItems: NavItem[] = [
  {
    icon: Home,
    label: 'Accueil',
    href: '/',
    requiresAuth: false,
    showInSimplified: true
  },
  {
    icon: BookOpen,
    label: 'Ressources médicales',
    href: '/resources',
    requiresAuth: false,
    showInSimplified: true
  },
  {
    icon: Users,
    label: 'Communauté',
    href: '/community',
    requiresAuth: false,
    showInSimplified: true
  },
  {
    icon: User,
    label: 'Tableau de bord',
    href: '/dashboard',
    requiresAuth: true,
    showInSimplified: false
  }
];
