
/**
 * Barre de navigation principale optimisée pour MedCollab
 * 
 * Composant de navigation adaptatif refactorisé en composants modulaires
 * avec support complet pour la responsive design et l'accessibilité
 */

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { navigationItems } from './navigation-config';
import { NavbarProps } from './types';
import { NavbarLogo } from './components/NavbarLogo';
import { NavbarItems } from './components/NavbarItems';
import { NavbarUserActions } from './components/NavbarUserActions';
import { NavbarMobileMenu } from './components/NavbarMobileMenu';

/**
 * Composant de navigation principal avec architecture modulaire
 * 
 * Fonctionnalités :
 * - Navigation responsive (desktop/mobile/tablette)
 * - Animations et transitions fluides optimisées
 * - Accessibilité complète avec ARIA labels
 * - Gestion intelligente des états de chargement
 * - Interface intuitive pour utilisateurs connectés et visiteurs
 * - Architecture modulaire pour faciliter la maintenance
 */
const Navbar: React.FC<NavbarProps> = ({ simplified = false }) => {
  // Hooks pour la gestion de l'état et de la navigation
  const { user, loading } = useAuth();

  /**
   * Filtrage intelligent des éléments de navigation
   * Adaptation selon le mode d'affichage et l'état d'authentification
   */
  const visibleNavItems = navigationItems.filter(item => {
    // En mode simplifié, n'afficher que les éléments autorisés
    if (simplified && !item.showInSimplified) {
      return false;
    }
    
    // Filtrage selon l'état d'authentification utilisateur
    return !item.requiresAuth || (item.requiresAuth && user);
  });

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Section logo et branding avec navigation adaptative */}
          <NavbarLogo isAuthenticated={!!user} />

          {/* Navigation principale pour les écrans desktop */}
          <NavbarItems items={visibleNavItems} />

          {/* Section des actions utilisateur (connexion/profil) */}
          <NavbarUserActions user={user} loading={loading} />
        </div>
      </div>

      {/* Menu mobile déployable pour utilisateurs non connectés */}
      <NavbarMobileMenu user={user} loading={loading} />
    </nav>
  );
};

export default Navbar;
