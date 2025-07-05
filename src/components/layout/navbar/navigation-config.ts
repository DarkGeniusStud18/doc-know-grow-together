
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
  GraduationCap
} from 'lucide-react';
import { NavItem } from './types';

/**
 * Configuration des éléments de navigation organisés par priorité
 * Ordre mis à jour selon les exigences utilisateur
 */
export const navigationItems: NavItem[] = [
  {
    icon: Home,
    label: 'Dashboard',
    href: '/dashboard',
    requiresAuth: true,
    showInSimplified: false
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
    icon: GraduationCap,
    label: 'Groupe d\'étude',
    href: '/study-groups',
    requiresAuth: true,
    showInSimplified: false
  }
];
