
/**
 * Composant d'icône de navigation avec animations Magic Navbar
 * 
 * Fonctionnalités optimisées pour navigation 5 éléments :
 * - Animations fluides de mise à l'échelle et transitions de couleur
 * - Gestion intelligente des états actifs et survolés
 * - Optimisation des performances avec mémorisation React
 * - Support complet de l'accessibilité ARIA
 * - Design responsive adaptatif mobile/tablette avec espacement compact
 * - Bordures arrondies et design moderne amélioré
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { MagicNavIconProps } from '../types';

/**
 * Composant d'icône de navigation avec animations Magic Navbar
 * Optimisé avec React.memo pour éviter les re-rendus inutiles
 * Adapté pour affichage compact avec 5 éléments + bouton Plus
 * Design arrondi et espacement généreux pour une meilleure UX
 * 
 * @param item - Élément de navigation à afficher avec configuration complète
 * @param showLabel - Contrôle l'affichage du label (responsive)
 * @param isActive - État actif de l'élément (route courante)
 * @param isHovered - État de survol pour les animations
 * @param onMouseEnter - Callback d'entrée de souris pour blob animation
 * @param onMouseLeave - Callback de sortie de souris pour blob animation
 * @param navItemRef - Référence DOM pour le calcul de position du blob
 * @param className - Classes CSS additionnelles
 */
export const MagicNavIcon: React.FC<MagicNavIconProps> = React.memo(({ 
  item, 
  showLabel = true,
  isActive,
  isHovered,
  hovered, // Alias pour compatibilité
  onMouseEnter,
  onMouseLeave,
  navItemRef,
  className
}) => {
  // Récupération du composant d'icône depuis l'élément de navigation
  const IconComponent = item.icon;
  
  // Détermine l'état de survol en utilisant les deux props possibles
  const isItemHovered = isHovered || hovered;
  
  return (
    <Link
      ref={navItemRef}
      to={item.href}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        // Styles de base avec transitions fluides optimisées et bordures arrondies
        "flex flex-col items-center justify-center relative z-10 transition-all duration-300",
        "rounded-2xl p-2 sm:p-3 border-2 border-transparent",
        // Tailles adaptatives selon l'écran - optimisées pour 5 éléments compacts
        "min-w-[48px] h-[52px] sm:min-w-[56px] sm:h-[60px]",
        // Couleurs selon l'état avec contraste optimal pour l'accessibilité
        isActive || isItemHovered
          ? "text-white bg-medical-blue border-medical-blue shadow-lg" 
          : "text-gray-600 hover:text-medical-blue bg-white hover:bg-medical-light border-gray-100 hover:border-medical-blue/30 shadow-sm hover:shadow-md",
        // Animation de mise à l'échelle
        "hover:scale-[1.05] active:scale-[0.95]",
        className
      )}
      aria-label={`Naviguer vers ${item.label}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {/* Conteneur d'icône avec bordures arrondies et espacement */}
      <div className={cn(
        "flex items-center justify-center rounded-xl p-1.5 transition-all duration-300",
        (isActive || isItemHovered) 
          ? "bg-white/20 border border-white/30" 
          : "bg-medical-blue/10 border border-medical-blue/20"
      )}>
        {/* Icône avec animation de mise à l'échelle responsive - taille adaptée */}
        <IconComponent 
          size={showLabel ? 20 : 22} // Taille légèrement augmentée pour meilleure visibilité
          className={cn(
            "transition-all duration-300",
            // Animation de mise à l'échelle selon l'état
            (isActive || isItemHovered) ? "scale-110" : "group-hover:scale-105"
          )} 
        />
      </div>
      
      {/* Label avec visibilité conditionnelle et animations de fondu - espacement optimisé */}
      {showLabel && (
        <span 
          className={cn(
            "text-xs font-medium transition-all duration-300 text-center leading-tight mt-1",
            // Responsive font size - taille adaptée pour lisibilité
            "text-[10px] sm:text-[11px]",
            // Opacité selon l'état pour un feedback visuel clair
            (isActive || isItemHovered) ? "opacity-100" : "opacity-80"
          )}
        >
          {item.label}
        </span>
      )}
      
      {/* Effet de pulsation subtil pour l'élément actif - améliore l'UX */}
      {isActive && (
        <div 
          className="absolute inset-0 rounded-2xl bg-medical-blue opacity-20 animate-pulse pointer-events-none border border-medical-blue/30"
          aria-hidden="true"
        />
      )}
      
      {/* Indicateur d'accessibilité pour les lecteurs d'écran */}
      {isActive && (
        <span className="sr-only">Page actuelle</span>
      )}
    </Link>
  );
});

// Nom d'affichage pour les outils de développement React
MagicNavIcon.displayName = 'MagicNavIcon';
