
/**
 * ➕ Composant bouton "Plus" pour accès au menu secondaire
 * 
 * Fonctionnalités :
 * - Design cohérent avec les éléments de navigation
 * - Animation de rotation sur survol pour feedback visuel
 * - Indicateur de nouvelles fonctionnalités
 * - Intégration Sheet pour menu modal
 */

import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { MobileSecondaryMenu } from '../../mobile-secondary-menu';
import { MobileSecondaryMenuItem } from '../../mobile-secondary-menu/types';

interface MoreButtonProps {
  hoveredItem: string | null;
  isMenuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  navItemRef: (el: HTMLElement | null) => void;
  secondaryMenuItems: MobileSecondaryMenuItem[];
  onItemClick: (item: MobileSecondaryMenuItem) => void;
  userRole?: string;
  userName?: string;
}

/**
 * Bouton "Plus" avec menu secondaire déployable
 * Design cohérent avec animation et indicateurs visuels
 */
export const MoreButton: React.FC<MoreButtonProps> = ({
  hoveredItem,
  isMenuOpen,
  onMenuOpenChange,
  onMouseEnter,
  onMouseLeave,
  navItemRef,
  secondaryMenuItems,
  onItemClick,
  userRole,
  userName
}) => {
  return (
    <div
      ref={navItemRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="flex-1 flex justify-center min-w-0"
    >
      <Sheet open={isMenuOpen} onOpenChange={onMenuOpenChange}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "relative flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl transition-all duration-300 group min-w-0",
              "hover:bg-transparent active:scale-95 focus:outline-none focus:ring-2 focus:ring-medical-teal focus:ring-offset-2",
              hoveredItem === 'more' && "text-white"
            )}
            aria-label="Ouvrir le menu des fonctionnalités avancées"
            title="Plus d'options et fonctionnalités"
          >
            <MoreHorizontal 
              size={20} 
              className={cn(
                "transition-all duration-300",
                hoveredItem === 'more' 
                  ? "text-white drop-shadow-sm transform rotate-90" 
                  : "text-gray-600 group-hover:text-medical-teal"
              )}
            />
            
            {/* 🔥 Indicateur visuel pour nouvelles fonctionnalités */}
            {secondaryMenuItems.length > 8 && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </Button>
        </SheetTrigger>
        
        {/* 📋 CONTENU DU MENU SECONDAIRE - Sheet modal optimisé sans bouton de fermeture redondant */}
        <SheetContent 
          side="bottom" 
          className="h-[85vh] p-0 border-0 bg-transparent rounded-t-xl"
          aria-describedby="menu-secondaire-description"
        >
          <div id="menu-secondaire-description" className="sr-only">
            Menu des fonctionnalités avancées et paramètres utilisateur
          </div>
          
          <MobileSecondaryMenu
            items={secondaryMenuItems}
            onItemClick={onItemClick}
            userRole={userRole}
            userName={userName}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};
