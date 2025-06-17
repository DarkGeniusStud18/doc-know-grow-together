/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Barre de navigation mobile horizontale optimisée pour MedCollab
 * 
 * Composant principal refactorisé avec architecture modulaire et animations Magic Navbar
 * Design responsive adapté aux différentes tailles d'écrans mobile et tablette - 5 éléments principaux
 */

import React, { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';
import { MobileSecondaryMenu } from '../mobile-secondary-menu';
import { primaryNavItems, secondaryNavItems } from './navigation-config';
import { useBlobAnimation } from './hooks/useBlobAnimation';
import { MagicNavIcon } from './components/MagicNavIcon';

/**
 * Conversion des éléments de navigation secondaires vers le format MobileSecondaryMenuItem
 * Ajoute l'ID requis et adapte la structure pour le menu secondaire
 */
const convertToSecondaryMenuItems = (items: any[]) => {
  return items.map(item => ({
    ...item,
    id: item.id || item.href, // Utilise l'ID existant ou le href comme fallback
    variant: 'default' as const,
    requiresAuth: true
  }));
};

/**
 * Composant principal de navigation mobile avec animations Magic Navbar
 * 
 * Fonctionnalités avancées optimisées pour 5 éléments :
 * - Architecture modulaire pour faciliter la maintenance
 * - Hook dédié pour les animations blob avec performance optimisée
 * - Composants réutilisables pour les icônes avec états visuels
 * - Configuration centralisée de la navigation par priorité (5 éléments principaux)
 * - Design responsive adaptatif mobile/tablette avec espacement optimisé
 * - Animations fluides respectant les préférences d'accessibilité
 */
const MobileNavbar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // État pour le contrôle du menu secondaire avec gestion optimisée
  const [isSecondaryMenuOpen, setIsSecondaryMenuOpen] = useState(false);
  
  // Hook personnalisé pour gérer les animations Magic Navbar avec performance
  const {
    hoveredItem,
    blobPosition,
    navItemsRef,
    navContainerRef,
    handleMouseEnter,
    handleMouseLeave
  } = useBlobAnimation(primaryNavItems);

  /**
   * Détermine si un élément de navigation est actuellement actif
   * Utilise les fonctions isActive personnalisées pour plus de flexibilité de routage
   */
  const isActiveItem = useCallback((item: any) => {
    if (item.isActive) {
      return item.isActive(location.pathname);
    }
    return location.pathname.startsWith(item.href);
  }, [location.pathname]);

  /**
   * Gestionnaire de clic pour les éléments du menu secondaire
   * Ferme le menu après interaction
   */
  const handleSecondaryMenuItemClick = useCallback(() => {
    setIsSecondaryMenuOpen(false);
  }, []);

  // Protection : masquer la navigation mobile si aucun utilisateur connecté
  if (!user) {
    console.log('MobileNavbar: Aucun utilisateur connecté, masquage de la navigation mobile');
    return null;
  }

  // Conversion des éléments secondaires pour compatibilité avec MobileSecondaryMenu
  const secondaryMenuItems = convertToSecondaryMenuItems(secondaryNavItems);

  return (
    <>
      {/* Barre de navigation mobile fixe en bas d'écran avec safe-area - optimisée pour 5 éléments */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-inset-bottom">
        <div 
          ref={navContainerRef}
          className="flex items-center justify-between px-1 sm:px-2 py-2 relative max-w-lg mx-auto"
          onMouseLeave={handleMouseLeave}
        >
          {/* Blob magique animé avec gradient médical et transitions fluides */}
          <div
            className={cn(
              "absolute h-12 sm:h-14 bg-gradient-to-r from-medical-blue to-medical-teal rounded-xl transition-all duration-500 ease-out shadow-lg",
              blobPosition.opacity > 0 ? "opacity-100" : "opacity-0"
            )}
            style={{
              left: `${blobPosition.left}px`,
              width: `${blobPosition.width}px`,
              top: '6px',
              transform: 'translateX(0)',
            }}
          />

          {/* Rendu de tous les éléments de navigation principaux avec espacement adaptatif pour 5 éléments */}
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
                showLabel={false} // Masquer les labels sur mobile pour économiser l'espace avec 5 éléments
              />
            </div>
          ))}

          {/* Bouton "Plus" pour accéder au menu secondaire avec design cohérent */}
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
                    "relative flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl transition-all duration-300 group min-w-0",
                    "hover:bg-transparent active:scale-95",
                    hoveredItem === 'more' && "text-white"
                  )}
                  aria-label="Plus d'options"
                >
                  <MoreHorizontal 
                    size={20} 
                    className={cn(
                      "transition-all duration-300",
                      hoveredItem === 'more' ? "text-white drop-shadow-sm" : "text-gray-600"
                    )}
                  />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="bottom" 
                className="h-[80vh] p-0 border-0 bg-transparent"
              >
                <MobileSecondaryMenu
                  items={secondaryMenuItems}
                  onItemClick={handleSecondaryMenuItemClick}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNavbar;
