
/**
 * Configuration des éléments de navigation pour DiscordSidebar
 * 
 * Organisation centralisée de tous les éléments de navigation
 * selon les rôles utilisateur et les fonctionnalités disponibles
 */

import { 
  Book, BookOpen, Calendar, FileText, LayoutGrid, Settings, 
  Wrench, Users, Music, Stethoscope, GraduationCap,
  Home, MessageSquare
} from 'lucide-react';
import { NavItemData } from './types';

/**
 * Configuration mémorisée des éléments de navigation communs
 * Fonctionnalités accessibles à tous les utilisateurs connectés
 */
export const commonNavItems: NavItemData[] = [
  { path: '/dashboard', icon: Home, label: 'Tableau de bord principal' },
  { path: '/resources', icon: BookOpen, label: 'Ressources médicales complètes' },
  { path: '/messaging', icon: Users, label: 'Chat médicale interactive' },
  { path: '/calendar', icon: Calendar, label: 'Calendrier des études personnalisé' },
  { path: '/music-library', icon: Music, label: 'Bibliothèque musicale pour la concentration' },
];

/**
 * Éléments de navigation spécifiques aux étudiants en médecine
 * Fonctionnalités orientées apprentissage et collaboration académique
 */
export const studentNavItems: NavItemData[] = [
  { path: '/notes', icon: FileText, label: 'Mes notes d\'étude personnelles' },
  { path: '/tools', icon: Wrench, label: 'Outils de productivité académique' },
];

/**
 * Éléments de navigation spécifiques aux professionnels de santé
 * Fonctionnalités orientées pratique clinique et formation continue
 */
export const professionalNavItems: NavItemData[] = [
  { path: '/clinical-cases', icon: Stethoscope, label: 'Cas cliniques interactifs avancés' },
  { path: '/continuing-education', icon: GraduationCap, label: 'Formation médicale continue certifiée' },
];

/**
 * Élément de navigation pour les paramètres
 * Accessible à tous les utilisateurs pour la configuration
 */
export const settingsNavItem: NavItemData = {
  path: '/settings', 
  icon: Settings, 
  label: 'Paramètres et configuration de l\'application'
};

/**
 * Génère la liste complète des éléments de navigation selon le rôle utilisateur
 * @param userRole - Rôle de l'utilisateur ('student' ou 'professional')
 * @returns Liste complète des éléments de navigation
 */
export const generateNavItems = (userRole: string): NavItemData[] => {
  const roleSpecificItems = userRole === 'student' ? studentNavItems : professionalNavItems;
  return [
    ...commonNavItems,
    ...roleSpecificItems,
    settingsNavItem
  ];
};
