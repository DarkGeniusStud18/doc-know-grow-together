
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * 📱 Navigation mobile/tablette horizontale FIXE - Version corrigée
 * 
 * Corrections apportées :
 * - Position fixe renforcée avec z-index très élevé
 * - Espacements uniformes et professionnels
 * - Suppression du bouton "Plus" en double
 * - Amélioration de l'accessibilité
 */

import React, { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';
import { MobileSecondaryMenu } from '../mobile-secondary-menu';
import { primaryNavItems, secondaryNavItems } from './navigation-config';
import { useBlobAnimation } from './hooks/useBlobAnimation';
import { MagicNavIcon } from './components/MagicNavIcon';

/**
 * Convertisseur d'éléments de navigation secondaires
 */
const convertToSecondaryMenuItems = (items: any[]) => {
  return items.map(item => ({
    ...item,
    id: item.id || item.href,
    variant: 'default' as const,
    requiresAuth: true,
    category: item.category || 'general'
  }));
};

/**
 * Navigation mobile/tablette avec position fixe garantie
 */
const MobileNavbar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  const [isSecondaryMenuOpen, setIsSecondaryMenuOpen] = useState(false);
  
  const {
    hoveredItem,
    blobPosition,
    navItemsRef,
    navContainerRef,
    handleMouseEnter,
    handleMouseLeave
  } = useBlobAnimation(primaryNavItems);

  const isActiveItem = useCallback((item: any) => {
    if (item.isActive && typeof item.isActive === 'function') {
      return item.isActive(location.pathname);
    }
    
    return location.pathname === item.href || location.pathname.startsWith(item.href + '/');
  }, [location.pathname]);

  const handleSecondaryMenuItemClick = useCallback(async (item: any) => {
    console.log('📱 MobileNavbar: Fermeture automatique du menu secondaire');
    
    try {
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
    } catch (error) {
      console.log('📳 Vibration non supportée sur cette plateforme');
    }
    
    setIsSecondaryMenuOpen(false);
  }, []);

  if (!user) {
    return null;
  }

  const secondaryMenuItems = convertToSecondaryMenuItems(secondaryNavItems);

  return (
    <>
      {/* Navigation mobile/tablette avec position fixe absolue */}
      <div 
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200"
        style={{
          height: '80px',
          paddingBottom: 'env(safe-area-inset-bottom)'
        }}
      >
        <div 
          ref={navContainerRef}
          className="flex items-center justify-between px-2 py-2 relative max-w-lg mx-auto h-full"
          onMouseLeave={handleMouseLeave}
          role="navigation"
          aria-label="Navigation principale mobile"
        >
          
          {/* Blob magique animé */}
          <div
            className={cn(
              "absolute h-12 bg-gradient-to-r from-medical-blue via-medical-teal to-medical-blue rounded-xl transition-all duration-500 ease-out shadow-lg opacity-0",
              blobPosition.opacity > 0 && "opacity-100 shadow-xl"
            )}
            style={{
              left: `${blobPosition.left}px`,
              width: `${blobPosition.width}px`,
              top: '8px',
              transform: 'translateX(0)',
              background: blobPosition.opacity > 0 
                ? 'linear-gradient(135deg, #0077B6 0%, #00B4D8 50%, #0077B6 100%)'
                : undefined
            }}
            aria-hidden="true"
          />

          {/* Éléments de navigation principaux */}
          {primaryNavItems.map((item, index) => (
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
                onMouseEnter={() => handleMouseEnter(item.href)}
                onMouseLeave={handleMouseLeave}
                showLabel={false}
                className="transition-all duration-300 hover:scale-105 active:scale-95"
              />
            </div>
          ))}

          {/* Bouton "Plus" pour menu secondaire */}
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
            <Sheet 
              open={isSecondaryMenuOpen} 
              onOpenChange={setIsSecondaryMenuOpen}
            >
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 group min-w-0",
                    "hover:bg-transparent active:scale-95 focus:outline-none focus:ring-2 focus:ring-medical-teal focus:ring-offset-2",
                    hoveredItem === 'more' && "text-white"
                  )}
                  aria-label="Ouvrir le menu des fonctionnalités avancées"
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
                </Button>
              </SheetTrigger>
              
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
                  onItemClick={handleSecondaryMenuItemClick}
                  userRole={user.role}
                  userName={user.displayName}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Indicateur de rôle utilisateur */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-20 rounded-t-lg transition-all duration-300">
          {user.role === 'student' && (
            <div className="w-full h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-t-lg" />
          )}
          {user.role === 'professional' && (
            <div className="w-full h-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-t-lg" />
          )}
        </div>
      </div>

      {/* Espaceur compensateur */}
      <div 
        className="lg:hidden" 
        style={{ 
          height: '80px',
          paddingBottom: 'env(safe-area-inset-bottom)'
        }}
        aria-hidden="true" 
      />
    </>
  );
};

export default MobileNavbar;
