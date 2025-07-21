
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { NavigationItems } from './components/NavigationItems';
import { MoreButton } from './components/MoreButton';
import { NavigationBlob } from './components/NavigationBlob';
import { primaryNavItems, secondaryNavItems } from './navigation-config';
import { useBlobAnimation } from './hooks/useBlobAnimation';
import AdminAccessButton from '@/components/admin/AdminAccessButton';
import { useAuth } from '@/hooks/useAuth';
import { MobileSecondaryMenuItem } from '../mobile-secondary-menu/types';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * 📱 Barre de navigation mobile principale - Design Discord optimisé
 * 
 * Fonctionnalités avancées :
 * - Animation fluide avec blob de navigation
 * - Responsive design adaptatif (mobile/tablette)
 * - Gestion intelligente des éléments principaux/secondaires
 * - Performance optimisée avec mémorisation
 * - Support complet touch et hover
 */
export const MobileNavbar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const { 
    hoveredItem, 
    blobPosition, 
    navItemsRef, 
    navContainerRef, 
    handleMouseEnter, 
    handleMouseLeave 
  } = useBlobAnimation(primaryNavItems);

  // 🎯 Détermination de l'élément actif avec gestion du bouton "More"
  const getActiveIndex = () => {
    const activeItem = primaryNavItems.find(item => item.isActive(location.pathname));
    
    if (activeItem) {
      return primaryNavItems.indexOf(activeItem);
    }
    
    // 📋 Si aucun élément principal n'est actif, le bouton "More" est considéré comme actif
    return primaryNavItems.length; // Index du bouton "More"
  };

  const activeIndex = getActiveIndex();

  // Convert secondary nav items to mobile secondary menu items with proper typing
  const secondaryMenuItems: MobileSecondaryMenuItem[] = secondaryNavItems.map(item => ({
    id: item.id,
    icon: item.icon,
    label: item.label,
    href: item.href,
    requiresAuth: false,
    category: 'secondary',
    isActive: item.isActive
  }));

  const handleSecondaryItemClick = (item: MobileSecondaryMenuItem) => {
    setIsMenuOpen(false);
    // Navigation is handled by the Link component in the menu
  };

  return (
    <nav 
      ref={navContainerRef}
      className="
        fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md 
        border-t border-gray-200/50 shadow-lg px-2 py-2 
        safe-area-inset-bottom md:px-4 lg:hidden
        transform-none sticky-mobile-nav
      "
      role="navigation"
      aria-label="Navigation mobile principale"
      style={{ position: 'fixed' }}
    >
      <div className="relative max-w-md mx-auto">
        {/* 🌟 Blob de navigation animé */}
        <NavigationBlob blobPosition={blobPosition} />
        
        {/* 📱 Conteneur des éléments de navigation */}
        <div className="relative flex items-center justify-between px-2">
          {/* 🔗 Éléments de navigation principaux */}
          <NavigationItems 
            items={primaryNavItems}
            hoveredItem={hoveredItem}
            navItemsRef={navItemsRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          
          {/* ➕ Bouton "More" pour le menu secondaire */}
          <MoreButton 
            hoveredItem={hoveredItem}
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}
            onMouseEnter={() => handleMouseEnter('more')}
            onMouseLeave={handleMouseLeave}
            navItemRef={(el) => {
              if (el && navItemsRef.current) {
                navItemsRef.current['more'] = el;
              }
            }}
            secondaryMenuItems={secondaryMenuItems}
            onItemClick={handleSecondaryItemClick}
            userRole={user?.role}
            userName={user?.displayName}
          />

          {/* 🔐 Bouton d'accès admin ultra-dissimulé */}
          {user?.email === 'yasseradjadi9@gmail.com' && (
            <div className="absolute -top-1 -right-1">
              <AdminAccessButton isMobile={true} />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default MobileNavbar;
