
/**
 * Composant éléments de navigation pour la Navbar
 * 
 * Affichage des éléments de navigation principaux avec animations
 */

import React, { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavItem } from '../types';

/**
 * Interface pour les propriétés du composant NavbarItems
 */
interface NavbarItemsProps {
  items: NavItem[];
}

/**
 * Composant des éléments de navigation avec gestion d'état actif
 * 
 * Fonctionnalités :
 * - Détection automatique de l'élément actif
 * - Animations et transitions fluides
 * - Navigation optimisée avec callbacks mémorisés
 * - Design adaptatif avec effets visuels
 */
export const NavbarItems: React.FC<NavbarItemsProps> = ({ items }) => {
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * Gestionnaire optimisé de navigation avec logging pour le débogage
   * @param href - URL de destination pour la navigation
   */
  const handleNavigation = useCallback((href: string) => {
    console.log('Navbar: Navigation vers:', href);
    navigate(href);
  }, [navigate]);

  /**
   * Fonction utilitaire pour déterminer si un lien de navigation est actif
   * Gestion spéciale pour la page d'accueil et comparaison de chemins
   * @param href - URL à vérifier contre la route actuelle
   * @returns true si le lien correspond à la route actuelle
   */
  const isActiveRoute = useCallback((href: string): boolean => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  }, [location.pathname]);

  return (
    <div className="hidden md:flex items-center space-x-1">
      {items.map((item) => {
        const isActive = isActiveRoute(item.href);
        const IconComponent = item.icon;
        
        return (
          <button
            key={item.href}
            onClick={() => handleNavigation(item.href)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
              hover:bg-medical-light hover:scale-[1.02] active:scale-[0.98]
              ${isActive 
                ? 'bg-medical-blue text-white shadow-md' 
                : 'text-gray-700 hover:text-medical-navy'
              }
            `}
            aria-current={isActive ? 'page' : undefined}
          >
            <IconComponent 
              size={18} 
              className={isActive ? 'text-white' : 'text-medical-blue'} 
            />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
