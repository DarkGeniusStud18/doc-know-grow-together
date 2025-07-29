
/**
 * Configuration des éléments de navigation pour la barre de navigation mobile
 * 
 * Organisation optimisée des fonctionnalités par priorité d'utilisation
 * et adaptation aux contraintes d'espace mobile/tablette avec 5 éléments principaux
 */

import { 
  Home, 
  BookOpen, 
  MessageCircle,
  FileText,
  Calendar,
  Settings,
  Music,
  Target,
  Timer,
  GraduationCap,
  Stethoscope,
  BarChart3,
  Users,
  Wrench
} from 'lucide-react';
import { MobileNavItem } from './types';

/**
 * Éléments de navigation principaux - Affichés dans la barre inférieure mobile
 * Ordre mis à jour selon les exigences utilisateur
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
    id: 'chat',
    icon: MessageCircle,
    label: 'Chat',
    href: '/chat',
    isActive: (pathname: string) => pathname.startsWith('/chat') || pathname.startsWith('/messaging')
  },
  {
    id: 'notes',
    icon: FileText,
    label: 'Notes',
    href: '/notes',
    isActive: (pathname: string) => pathname.startsWith('/notes')
  }
];

/**
 * Éléments de navigation secondaires - Menu déployable réorganisé
 * Ordre mis à jour selon les exigences utilisateur
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
    id: 'study-groups',
    icon: Users,
    label: 'Groupes d\'étude',
    href: '/study-groups',
    isActive: (pathname: string) => pathname.startsWith('/study-groups')
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
 * Configuration des seuils responsive pour l'affichage adaptatif
 */
export const responsiveConfig = {
  mobile: {
    maxWidth: 640,
    showLabels: false,
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
