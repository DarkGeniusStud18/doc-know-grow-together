
/**
 * Configuration des éléments de navigation pour la barre de navigation mobile
 * Réorganisation selon les demandes utilisateur avec ordre spécifique
 */

import { 
  Home, 
  BookOpen, 
  Users, 
  GraduationCap,
  Wrench,
  FileText,
  Music,
  Calendar
} from 'lucide-react';
import { MobileNavItem } from './types';

/**
 * Éléments de navigation principaux - Ordre spécifique demandé par l'utilisateur
 * 1. Dashboard, 2. Ressources médicales, 3. Communauté, 4. Groupes d'étude, 5. Menu secondaire
 */
export const primaryNavItems: MobileNavItem[] = [
  {
    id: 'dashboard',
    icon: Home,
    label: 'Dashboard',
    href: '/dashboard',
    isActive: (pathname: string) => pathname === '/dashboard' || pathname === '/'
  },
  {
    id: 'resources',
    icon: BookOpen,
    label: 'Ressources médicales',
    href: '/resources',
    isActive: (pathname: string) => pathname.startsWith('/resources')
  },
  {
    id: 'community',
    icon: Users,
    label: 'Communauté',
    href: '/community',
    isActive: (pathname: string) => pathname.startsWith('/community')
  },
  {
    id: 'study-groups',
    icon: GraduationCap, // Icône différente pour les groupes d'étude
    label: 'Groupes d\'étude',
    href: '/study-groups',
    isActive: (pathname: string) => pathname.startsWith('/study-groups')
  }
];

/**
 * Éléments de navigation secondaires - Menu déployable réorganisé
 * Ordre demandé : Outils de productivité, Mes notes, Bibliothèque musicale, Calendrier
 */
export const secondaryNavItems: MobileNavItem[] = [
  {
    id: 'tools',
    icon: Wrench,
    label: 'Outils de productivité',
    href: '/tools',
    isActive: (pathname: string) => pathname.startsWith('/tools')
  },
  {
    id: 'notes',
    icon: FileText,
    label: 'Mes notes',
    href: '/notes',
    isActive: (pathname: string) => pathname.startsWith('/notes')
  },
  {
    id: 'music',
    icon: Music,
    label: 'Bibliothèque musicale',
    href: '/music-library',
    isActive: (pathname: string) => pathname.startsWith('/music')
  },
  {
    id: 'calendar',
    icon: Calendar,
    label: 'Calendrier',
    href: '/calendar',
    isActive: (pathname: string) => pathname.startsWith('/calendar')
  }
];

/**
 * Configuration responsive mise à jour pour 4 éléments principaux + 1 menu
 */
export const responsiveConfig = {
  mobile: {
    maxWidth: 640,
    showLabels: false,
    maxPrimaryItems: 4 // 4 éléments principaux + menu secondaire
  },
  tablet: {
    minWidth: 641,
    maxWidth: 1024,
    showLabels: true,
    maxPrimaryItems: 4
  }
};

/**
 * Fonction utilitaire mise à jour pour la nouvelle configuration
 */
export const getFilteredNavItems = (screenWidth: number, items: MobileNavItem[]) => {
  const config = screenWidth <= responsiveConfig.mobile.maxWidth 
    ? responsiveConfig.mobile 
    : responsiveConfig.tablet;
    
  return items.slice(0, config.maxPrimaryItems);
};

/**
 * Configuration des animations pour une expérience fluide
 */
export const animationConfig = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500
  },
  easing: {
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  }
};
