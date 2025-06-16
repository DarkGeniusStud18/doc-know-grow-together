/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Navigation mobile ultra-professionnelle avec Magic Navbar
 * 
 * Design premium avec animations fluides et micro-interactions
 * Optimisée pour l'expérience tactile mobile et tablette
 */

import React, { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { MoreHorizontal, Plus } from 'lucide-react';
import { MobileSecondaryMenu } from '../mobile-secondary-menu';
import { primaryNavItems, secondaryNavItems } from './navigation-config';
import { useBlobAnimation } from './hooks/useBlobAnimation';
import { MagicNavIcon } from './components/MagicNavIcon';

/**
 * Conversion optimisée des éléments de navigation secondaires
 */
const convertToSecondaryMenuItems = (items: any[]) => {
  return items.map(item => ({
    ...item,
    id: item.id || item.href,
    variant: 'default' as const,
    requiresAuth: true
  }));
};

/**
 * Navigation mobile avec design ultra-professionnel
 * 
 * Fonctionnalités premium :
 * - Magic Navbar avec blob animé fluide
 * - Micro-interactions et feedback haptique
 * - Design adaptatif mobile/tablette avec safe-area
 * - Animations de transition premium
 * - Indicateurs visuels d'état avancés
 */
const MobileNavbar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  const [isSecondaryMenuOpen, setIsSecondaryMenuOpen] = useState(false);
  
  // Hook pour les animations Magic Navbar avec performance optimisée
  const {
    hoveredItem,
    blobPosition,
    navItemsRef,
    navContainerRef,
    handleMouseEnter,
    handleMouseLeave
  } = useBlobAnimation(primaryNavItems);

  /**
   * Détermine si un élément de navigation est actif avec logique avancée
   */
  const isActiveItem = useCallback((item: any) => {
    if (item.isActive) {
      return item.isActive(location.pathname);
    }
    return location.pathname.startsWith(item.href);
  }, [location.pathname]);

  /**
   * Gestionnaire de fermeture du menu secondaire
   */
  const handleSecondaryMenuItemClick = useCallback(() => {
    setIsSecondaryMenuOpen(false);
  }, []);

  // Protection : masquer si aucun utilisateur connecté
  if (!user) {
    return null;
  }

  const secondaryMenuItems = convertToSecondaryMenuItems(secondaryNavItems);

  return (
    <>
      {/* Navigation mobile fixe avec design premium */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-2xl safe-area-inset-bottom">
        
        {/* Conteneur principal avec effet de verre */}
        <div 
          ref={navContainerRef}
          className="relative flex items-center justify-between px-2 sm:px-4 py-3 max-w-lg mx-auto"
          onMouseLeave={handleMouseLeave}
        >
          
          {/* Blob magique avec gradient premium et ombres */}
          <div
            className={cn(
              "absolute h-12 sm:h-14 bg-gradient-to-r from-medical-blue via-medical-teal to-medical-blue rounded-2xl transition-all duration-500 ease-out shadow-lg shadow-medical-blue/20",
              blobPosition.opacity > 0 ? "opacity-100 scale-100" : "opacity-0 scale-95"
            )}
            style={{
              left: `${blobPosition.left}px`,
              width: `${blobPosition.width}px`,
              top: '8px',
              transform: 'translateX(0)',
            }}
          >
            {/* Effet de brillance */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl"></div>
          </div>

          {/* Éléments de navigation principaux avec espacement optimisé */}
          {primaryNavItems.map((item) => (
            <div
              key={item.href}
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
                onMouseEnter={() => handleMouseEnter(item.href)}
                onMouseLeave={handleMouseLeave}
                showLabel={false}
              />
            </div>
          ))}

          {/* Bouton "Plus" avec design premium */}
          <div
            ref={(el) => {
              if (el && navItemsRef.current) {
                navItemsRef.current['more'] = el;
              }
            }}
            onMouseEnter={() => handleMouseEnter('more')}
            onMouseLeave={handleMouseLeave}
            className="flex-1 flex justify-center min-w-0"
          >
            <Sheet open={isSecondaryMenuOpen} onOpenChange={setIsSecondaryMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 group min-w-0 active:scale-90",
                    "hover:bg-transparent",
                    hoveredItem === 'more' && "text-white"
                  )}
                  aria-label="Plus d'options"
                >
                  {/* Icône avec animation de rotation */}
                  <div className={cn(
                    "transition-all duration-300",
                    isSecondaryMenuOpen && "rotate-45"
                  )}>
                    {isSecondaryMenuOpen ? (
                      <Plus 
                        size={20} 
                        className={cn(
                          "transition-all duration-300",
                          hoveredItem === 'more' ? "text-white drop-shadow-sm" : "text-gray-600"
                        )}
                      />
                    ) : (
                      <MoreHorizontal 
                        size={20} 
                        className={cn(
                          "transition-all duration-300",
                          hoveredItem === 'more' ? "text-white drop-shadow-sm" : "text-gray-600"
                        )}
                      />
                    )}
                  </div>
                  
                  {/* Indicateur de points pour menu */}
                  {!isSecondaryMenuOpen && (
                    <div className="flex space-x-1 mt-1">
                      {[...Array(3)].map((_, i) => (
                        <div 
                          key={i}
                          className={cn(
                            "w-1 h-1 rounded-full transition-all duration-300",
                            hoveredItem === 'more' ? "bg-white/80" : "bg-gray-400"
                          )}
                        ></div>
                      ))}
                    </div>
                  )}
                </Button>
              </SheetTrigger>
              
              {/* Menu secondaire avec animation fluide */}
              <SheetContent 
                side="bottom" 
                className="h-[80vh] p-0 border-0 bg-transparent rounded-t-3xl"
              >
                <MobileSecondaryMenu
                  items={secondaryMenuItems}
                  onItemClick={handleSecondaryMenuItemClick}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Indicateur de page actuelle - Barre fine en haut */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-medical-blue to-medical-teal rounded-b-full"></div>
      </div>

      {/* Spacer pour éviter que le contenu soit masqué */}
      <div className="md:hidden h-20 safe-area-inset-bottom"></div>
    </>
  );
};

export default MobileNavbar;
