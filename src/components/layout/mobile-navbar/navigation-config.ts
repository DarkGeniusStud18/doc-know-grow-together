
/**
 * Configuration des éléments de navigation pour la barre de navigation mobile
 * 
 * Navigation réorganisée selon les spécifications exactes de l'utilisateur :
 * Menu principal : Dashboard, Ressources médicales, Communauté, Groupes d'étude
 * Menu secondaire : Outils de productivité, Mes notes, Bibliothèque musicale, Calendrier
 */

import { 
  Home, 
  BookOpen, 
  Users, 
  GraduationCap,
  Wrench,
  FileText,
  Music,
  Calendar,
  Stethoscope
} from 'lucide-react';
import { MobileNavItem } from './types';

/**
 * Éléments de navigation principaux - Affichés dans la barre inférieure mobile
 * Ordre exact spécifié par l'utilisateur
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
    label: 'Ressources',
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
    icon: GraduationCap, // Icône différente pour les groupes d'étude comme demandé
    label: 'Groupes',
    href: '/study-groups',
    isActive: (pathname: string) => pathname.startsWith('/study-groups')
  }
];

/**
 * Éléments de navigation secondaires - Menu déployable
 * Ordre exact spécifié par l'utilisateur, exam-simulator retiré
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
    href: '/music',
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
 * Configuration des seuils responsive pour l'affichage adaptatif
 */
export const responsiveConfig = {
  mobile: {
    maxWidth: 640,
    showLabels: true,
    maxPrimaryItems: 4 // 4 éléments principaux + bouton menu
  },
  tablet: {
    minWidth: 641,
    maxWidth: 1024,
    showLabels: true,
    maxPrimaryItems: 4
  }
};

/**
 * Fonction utilitaire pour filtrer les éléments selon la taille d'écran
 */
export const getFilteredNavItems = (screenWidth: number, items: MobileNavItem[]) => {
  const config = screenWidth <= responsiveConfig.mobile.maxWidth 
    ? responsiveConfig.mobile 
    : responsiveConfig.tablet;
    
  return items.slice(0, config.maxPrimaryItems);
};

/**
 * Configuration des animations pour les différents états
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
