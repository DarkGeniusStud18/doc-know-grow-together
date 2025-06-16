
/**
 * Navigation principale ultra-professionnelle pour desktop
 * 
 * Design premium avec animations fluides et hiérarchie visuelle claire
 * Optimisée pour l'expérience desktop avec interactions avancées
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { navigationItems } from './navigation-config';
import { NavbarProps } from './types';
import { NavbarLogo } from './components/NavbarLogo';
import { NavbarItems } from './components/NavbarItems';
import { NavbarUserActions } from './components/NavbarUserActions';
import { NavbarMobileMenu } from './components/NavbarMobileMenu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Bell, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Navigation principale avec design ultra-professionnel
 * 
 * Fonctionnalités premium desktop :
 * - Barre de navigation fixe avec backdrop blur
 * - Animations de survol et transitions fluides
 * - Indicateurs visuels d'état avancés
 * - Design adaptatif avec micro-interactions
 * - Hiérarchie visuelle claire et professionnelle
 */
const Navbar: React.FC<NavbarProps> = ({ simplified = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  /**
   * Filtrage intelligent des éléments de navigation
   */
  const visibleNavItems = navigationItems.filter(item => {
    if (simplified && !item.showInSimplified) {
      return false;
    }
    return !item.requiresAuth || (item.requiresAuth && user);
  });

  /**
   * Détermine si un élément de navigation est actif
   */
  const isActiveNavItem = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <nav className="bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-18">
          
          {/* Section gauche - Logo et navigation principale */}
          <div className="flex items-center space-x-8">
            
            {/* Logo avec design premium */}
            <Link to="/" className="group flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-medical-blue to-medical-teal rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">
                  MedCollab
                </span>
                <div className="text-xs text-gray-500 -mt-1">
                  Plateforme médicale
                </div>
              </div>
            </Link>

            {/* Navigation principale - Desktop uniquement */}
            <div className="hidden lg:flex items-center space-x-1">
              {visibleNavItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "group relative px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center space-x-2",
                    isActiveNavItem(item.href)
                      ? "bg-medical-blue/10 text-medical-blue"
                      : "text-gray-700 hover:bg-gray-50 hover:text-medical-blue"
                  )}
                >
                  {item.icon && (
                    <item.icon className="h-4 w-4" />
                  )}
                  <span>{item.label}</span>
                  
                  {/* Indicateur actif */}
                  {isActiveNavItem(item.href) && (
                    <div className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-gradient-to-r from-medical-blue to-medical-teal rounded-full"></div>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Section centre - Barre de recherche premium (Desktop) */}
          <div className="hidden xl:flex flex-1 max-w-md mx-8">
            <div className={cn(
              "relative w-full transition-all duration-300",
              isSearchFocused && "scale-105"
            )}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className={cn(
                  "h-4 w-4 transition-colors duration-200",
                  isSearchFocused ? "text-medical-blue" : "text-gray-400"
                )} />
              </div>
              <input
                type="text"
                placeholder="Rechercher des ressources, cours, outils..."
                className={cn(
                  "w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-medical-blue/20 focus:border-medical-blue focus:bg-white",
                  "placeholder-gray-500"
                )}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>
          </div>

          {/* Section droite - Actions utilisateur */}
          <div className="flex items-center space-x-3">
            
            {/* Bouton recherche mobile/tablette */}
            <Button
              variant="ghost"
              size="sm"
              className="xl:hidden h-10 w-10 p-0 hover:bg-gray-100 rounded-xl"
            >
              <Search className="h-4 w-4 text-gray-600" />
            </Button>

            {user ? (
              <>
                {/* Notifications avec badge */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative h-10 w-10 p-0 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <Bell className="h-4 w-4 text-gray-600" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500 hover:bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </Badge>
                </Button>

                {/* Sélecteur de langue */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden lg:flex h-10 w-10 p-0 hover:bg-gray-100 rounded-xl"
                >
                  <Globe className="h-4 w-4 text-gray-600" />
                </Button>

                {/* Profil utilisateur premium */}
                <NavbarUserActions user={user} loading={loading} />
              </>
            ) : (
              /* Boutons de connexion/inscription pour visiteurs */
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-medium"
                  asChild
                >
                  <Link to="/login">Se connecter</Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-medical-blue to-medical-teal hover:from-medical-blue/90 hover:to-medical-teal/90 font-medium px-4"
                  asChild
                >
                  <Link to="/register">S'inscrire</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menu mobile pour utilisateurs non connectés */}
      <NavbarMobileMenu user={user} loading={loading} />
    </nav>
  );
};

export default Navbar;
