
/**
 * Configuration des éléments de navigation pour la barre de navigation mobile
 * 
 * Organisation optimisée des fonctionnalités par priorité d'utilisation
 * et adaptation aux contraintes d'espace mobile/tablette avec 5 éléments principaux
 */

import { 
  Home, 
  BookOpen, 
  Users, 
  Calendar,
  Settings,
  Music,
  Target,
  Timer,
  GraduationCap,
  Stethoscope,
  BarChart3
} from 'lucide-react';
import { MobileNavItem } from './types';

/**
 * Éléments de navigation principaux - Affichés dans la barre inférieure mobile
 * Étendu à 5 éléments pour optimiser l'accès aux fonctionnalités principales
 * sur écrans mobile et tablette
 */
export const primaryNavItems: MobileNavItem[] = [
  {
    id: 'dashboard',
    icon: Home,
    label: 'Accueil',
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
    isActive: (pathname: string) => pathname.startsWith('/community') || pathname.startsWith('/study-groups')
  },
  {
    id: 'calendar',
    icon: Calendar,
    label: 'Planning',
    href: '/calendar',
    isActive: (pathname: string) => pathname.startsWith('/calendar')
  },
  {
    id: 'progress',
    icon: BarChart3,
    label: 'Progrès',
    href: '/tools/performance-tracker',
    isActive: (pathname: string) => pathname.startsWith('/tools/performance-tracker')
  }
];

/**
 * Éléments de navigation secondaires - Affichés dans le menu déployable
 * Fonctionnalités avancées et outils spécialisés accessibles via le bouton "Plus"
 */
export const secondaryNavItems: MobileNavItem[] = [
  {
    id: 'study-goals',
    icon: Target,
    label: 'Objectifs d\'étude',
    href: '/tools/study-goals',
    isActive: (pathname: string) => pathname.startsWith('/tools/study-goals')
  },
  {
    id: 'pomodoro',
    icon: Timer,
    label: 'Minuteur Pomodoro',
    href: '/tools/pomodoro',
    isActive: (pathname: string) => pathname.startsWith('/tools/pomodoro')
  },
  {
    id: 'exam-simulator',
    icon: GraduationCap,
    label: 'Simulateur d\'examen',
    href: '/exam-simulator',
    isActive: (pathname: string) => pathname.startsWith('/exam-simulator')
  },
  {
    id: 'clinical-cases',
    icon: Stethoscope,
    label: 'Cas cliniques',
    href: '/clinical-cases',
    isActive: (pathname: string) => pathname.startsWith('/clinical-cases')
  },
  {
    id: 'music',
    icon: Music,
    label: 'Musique d\'étude',
    href: '/music',
    isActive: (pathname: string) => pathname.startsWith('/music')
  },
  {
    id: 'settings',
    icon: Settings,
    label: 'Paramètres',
    href: '/settings',
    isActive: (pathname: string) => pathname.startsWith('/settings')
  }
];

/**
 * Configuration des seuils responsive pour l'affichage adaptatif
 * Permet d'ajuster le comportement selon la taille d'écran avec support 5 éléments
 */
export const responsiveConfig = {
  // Breakpoints en pixels pour les adaptations
  mobile: {
    maxWidth: 640,
    showLabels: false, // Masquer les labels sur très petits écrans
    maxPrimaryItems: 5 // 5 éléments principaux pour mobile
  },
  tablet: {
    minWidth: 641,
    maxWidth: 1024,
    showLabels: true, // Afficher les labels sur tablette
    maxPrimaryItems: 5 // 5 éléments principaux pour tablette
  }
};

/**
 * Fonction utilitaire pour filtrer les éléments selon la taille d'écran
 * Permet une adaptation dynamique du contenu avec support 5 éléments
 */
export const getFilteredNavItems = (screenWidth: number, items: MobileNavItem[]) => {
  const config = screenWidth <= responsiveConfig.mobile.maxWidth 
    ? responsiveConfig.mobile 
    : responsiveConfig.tablet;
    
  return items.slice(0, config.maxPrimaryItems);
};

/**
 * Configuration des animations pour les différents états
 * Respecte les préférences d'accessibilité de l'utilisateur
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
