
/**
 * 🎯 Composant de rendu des éléments de navigation principaux
 * 
 * Fonctionnalités :
 * - Rendu optimisé des 5 éléments de navigation principaux
 * - Gestion des références DOM pour animations de blob
 * - États actifs et survolés avec animations Magic Navbar
 * - Espacement adaptatif pour différentes tailles d'écran
 */

import React from 'react';
import { useLocation } from 'react-router-dom';
import { MobileNavItem } from '../types';
import { MagicNavIcon } from './MagicNavIcon';

interface NavigationItemsProps {
  items: MobileNavItem[];
  hoveredItem: string | null;
  navItemsRef: React.MutableRefObject<Record<string, HTMLElement | null>>;
  onMouseEnter: (itemKey: string) => void;
  onMouseLeave: () => void;
}

/**
 * Composant de navigation principal avec rendu optimisé
 * Gère l'affichage des éléments de navigation avec animations
 */
export const NavigationItems: React.FC<NavigationItemsProps> = ({
  items,
  hoveredItem,
  navItemsRef,
  onMouseEnter,
  onMouseLeave
}) => {
  const location = useLocation();

  /**
   * 🎯 Déterminateur intelligent d'état actif pour éléments de navigation
   * Utilise les fonctions isActive personnalisées pour gestion avancée du routage
   * Support des routes dynamiques et sous-chemins
   */
  const isActiveItem = (item: MobileNavItem) => {
    if (item.isActive && typeof item.isActive === 'function') {
      return item.isActive(location.pathname);
    }
    
    // 🔍 Vérification de correspondance de chemin avec support des paramètres
    return location.pathname === item.href || location.pathname.startsWith(item.href + '/');
  };

  return (
    <>
      {/* 🎯 ÉLÉMENTS DE NAVIGATION PRINCIPAUX - Rendu optimisé avec espacement adaptatif */}
      {items.map((item, index) => (
        <div
          key={`${item.href}-${index}`}
          ref={(el) => {
            if (el && navItemsRef.current) {
              navItemsRef.current[item.href] = el;
            }
          }}
          className="flex-1 flex justify-center min-w-0"
        >
          <MagicNavIcon
            item={item}
            isActive={isActiveItem(item)}
            isHovered={hoveredItem === item.href}
            hovered={hoveredItem === item.href}
            onMouseEnter={() => onMouseEnter(item.href)}
            onMouseLeave={onMouseLeave}
            showLabel={false} // Labels masqués pour économiser l'espace sur mobile/tablette
            className="transition-all duration-300 hover:scale-105 active:scale-95"
          />
        </div>
      ))}
    </>
  );
};
