
/**
 * Composant d'icône de navigation avec animations Magic Navbar
 * 
 * Icône interactive avec effets visuels avancés, animations de survol
 * et indicateurs d'état pour une expérience utilisateur immersive
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { NavItemData } from '../types';

/**
 * Interface pour les propriétés du composant MagicNavIcon
 */
interface MagicNavIconProps {
  item: NavItemData;
  isActive: boolean;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  navItemRef: (el: HTMLDivElement | null) => void;
}

/**
 * Composant d'icône de navigation optimisé avec animations Magic Navbar
 * 
 * Fonctionnalités :
 * - Animations fluides de survol et d'activation
 * - Effets visuels avancés (échelle, rotation, pulsation)
 * - Tooltips informatifs avec délai optimisé
 * - Indicateurs d'état actif avec animations
 * - Design adaptatif et accessible
 */
export const MagicNavIcon: React.FC<MagicNavIconProps> = React.memo(({ 
  item,
  isActive,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  navItemRef
}) => {
  const Icon = item.icon;
  
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            ref={navItemRef}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="relative group mb-3"
          >
            <Link 
              to={item.path} 
              className="block" 
              aria-label={item.label}
            >
              <div 
                className={cn(
                  "relative w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ease-out z-10",
                  isActive || isHovered
                    ? "bg-medical-blue text-white rounded-2xl transform scale-110 shadow-xl" 
                    : "bg-gray-200 text-gray-500 hover:bg-medical-teal hover:text-white hover:rounded-2xl hover:scale-105"
                )}
              >
                {/* Indicateur d'état actif avec animation d'apparition */}
                {isActive && (
                  <div className="absolute -left-4 w-1.5 h-10 bg-white rounded-r-full transition-all duration-300 animate-in slide-in-from-left-2 z-20"></div>
                )}
                
                {/* Icône avec animation de survol et mise à l'échelle */}
                <Icon 
                  size={24} 
                  className={cn(
                    "transition-all duration-300 relative z-30",
                    (isActive || isHovered) ? "scale-110" : "group-hover:scale-110"
                  )} 
                />
                
                {/* Effet de pulsation pour l'élément actif */}
                {isActive && (
                  <div className="absolute inset-0 rounded-full bg-medical-blue opacity-20 animate-pulse"></div>
                )}
              </div>
            </Link>
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          className="bg-gray-800 text-white border-gray-700 ml-2 font-medium"
          sideOffset={8}
        >
          {item.label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

MagicNavIcon.displayName = 'MagicNavIcon';
