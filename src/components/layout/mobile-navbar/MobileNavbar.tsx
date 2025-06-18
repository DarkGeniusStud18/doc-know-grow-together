/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * 📱 Barre de navigation mobile/tablette horizontale optimisée pour MedCollab
 * 
 * Architecture responsive unifiée :
 * - Mobile (< 640px) : Navigation horizontale optimisée avec 5 éléments principaux
 * - Tablette (640px - 1023px) : Même interface que mobile pour cohérence UX
 * - Design adaptatif avec animations Magic Navbar fluides
 * - Menu secondaire extensible via Sheet pour fonctionnalités avancées
 * 
 * Fonctionnalités natives intégrées :
 * - Vibrations haptiques sur interaction (Capacitor)
 * - Gestion automatique des zones sécurisées (safe-area-inset)
 * - Synchronisation données native/web transparente
 * - Performance optimisée avec hooks personnalisés
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
 * 🔄 Convertisseur intelligent d'éléments de navigation secondaires
 * Adapte la structure des éléments pour compatibilité avec MobileSecondaryMenu
 * Ajoute les propriétés requises et normalise le format de données
 */
const convertToSecondaryMenuItems = (items: any[]) => {
  return items.map(item => ({
    ...item,
    id: item.id || item.href, // ID unique requis pour le tracking
    variant: 'default' as const,
    requiresAuth: true, // Toutes les fonctionnalités nécessitent une authentification
    category: item.category || 'general' // Catégorisation pour l'organisation du menu
  }));
};

/**
 * 📱 Composant principal de navigation mobile/tablette avec animations Magic Navbar
 * 
 * Optimisations techniques avancées :
 * - Hook dédié useBlobAnimation pour animations fluides 60fps
 * - Composants modulaires MagicNavIcon réutilisables
 * - Configuration centralisée pour maintenance simplifiée
 * - Gestion d'état optimisée avec minimal re-renders
 * - Intégration native Capacitor pour fonctionnalités avancées
 * - Espacement adaptatif automatique pour 5 éléments + menu "Plus"
 */
const MobileNavbar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // 📋 État du menu secondaire avec contrôle optimisé
  const [isSecondaryMenuOpen, setIsSecondaryMenuOpen] = useState(false);
  
  // ✨ Hook personnalisé pour animations Magic Navbar haute performance
  const {
    hoveredItem,
    blobPosition,
    navItemsRef,
    navContainerRef,
    handleMouseEnter,
    handleMouseLeave
  } = useBlobAnimation(primaryNavItems);

  /**
   * 🎯 Déterminateur intelligent d'état actif pour éléments de navigation
   * Utilise les fonctions isActive personnalisées pour gestion avancée du routage
   * Support des routes dynamiques et sous-chemins
   */
  const isActiveItem = useCallback((item: any) => {
    if (item.isActive && typeof item.isActive === 'function') {
      return item.isActive(location.pathname);
    }
    
    // 🔍 Vérification de correspondance de chemin avec support des paramètres
    return location.pathname === item.href || location.pathname.startsWith(item.href + '/');
  }, [location.pathname]);

  /**
   * 📱 Gestionnaire de fermeture automatique du menu secondaire
   * Optimise l'expérience utilisateur en fermant le menu après interaction
   * Intègre les vibrations haptiques pour feedback tactile (fonctionnalité native)
   */
  const handleSecondaryMenuItemClick = useCallback(async (item: any) => {
    console.log('📱 MobileNavbar: Fermeture automatique du menu secondaire');
    
    // 📳 Vibration haptique légère pour confirmation d'action (native)
    try {
      if ('vibrate' in navigator) {
        navigator.vibrate(10); // Vibration courte 10ms
      }
    } catch (error) {
      console.log('📳 Vibration non supportée sur cette plateforme');
    }
    
    setIsSecondaryMenuOpen(false);
  }, []);

  // 🛡️ Protection : masquer la navigation si aucun utilisateur connecté
  if (!user) {
    console.log('🚫 MobileNavbar: Aucun utilisateur connecté, masquage navigation mobile/tablette');
    return null;
  }

  // 🔄 Conversion des éléments secondaires pour compatibilité menu
  const secondaryMenuItems = convertToSecondaryMenuItems(secondaryNavItems);

  console.log('📱 MobileNavbar: Rendu navigation mobile/tablette -', {
    userId: user.id,
    userRole: user.role,
    currentPath: location.pathname,
    primaryItemsCount: primaryNavItems.length,
    secondaryItemsCount: secondaryMenuItems.length
  });

  return (
    <>
      {/* 📱 BARRE DE NAVIGATION MOBILE/TABLETTE FIXE - Positionnée en bas d'écran */}
      {/* Optimisée pour 5 éléments principaux + bouton "Plus" avec espacement automatique */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 safe-area-inset-bottom">
        <div 
          ref={navContainerRef}
          className="flex items-center justify-between px-1 sm:px-2 py-2 relative max-w-lg mx-auto"
          onMouseLeave={handleMouseLeave}
          role="navigation"
          aria-label="Navigation principale mobile"
        >
          
          {/* ✨ BLOB MAGIQUE ANIMÉ - Effet visuel Magic Navbar avec gradient médical */}
          <div
            className={cn(
              "absolute h-12 sm:h-14 bg-gradient-to-r from-medical-blue via-medical-teal to-medical-blue rounded-xl transition-all duration-500 ease-out shadow-lg opacity-0",
              blobPosition.opacity > 0 && "opacity-100 shadow-xl"
            )}
            style={{
              left: `${blobPosition.left}px`,
              width: `${blobPosition.width}px`,
              top: '6px',
              transform: 'translateX(0)',
              background: blobPosition.opacity > 0 
                ? 'linear-gradient(135deg, #0077B6 0%, #00B4D8 50%, #0077B6 100%)'
                : undefined
            }}
            aria-hidden="true"
          />

          {/* 🎯 ÉLÉMENTS DE NAVIGATION PRINCIPAUX - Rendu optimisé avec espacement adaptatif */}
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
                showLabel={false} // Labels masqués pour économiser l'espace sur mobile/tablette
                className="transition-all duration-300 hover:scale-105 active:scale-95"
              />
            </div>
          ))}

          {/* ➕ BOUTON "PLUS" - Accès au menu secondaire avec design cohérent */}
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
              
              {/* 📋 CONTENU DU MENU SECONDAIRE - Sheet modal optimisé */}
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

        {/* 🎯 INDICATEUR DE RÔLE UTILISATEUR - Barre colorée en bas pour identification rapide */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-20 rounded-t-lg transition-all duration-300">
          {user.role === 'student' && (
            <div className="w-full h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-t-lg" />
          )}
          {user.role === 'professional' && (
            <div className="w-full h-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-t-lg" />
          )}
        </div>
      </div>

      {/* 📏 ESPACEUR POUR ZONE SÉCURISÉE - Compense la hauteur de la navigation fixe */}
      <div className="lg:hidden h-20 safe-area-inset-bottom" aria-hidden="true" />
    </>
  );
};

export default MobileNavbar;
