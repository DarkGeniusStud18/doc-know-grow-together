
import React from 'react';
import { useLocation } from 'react-router-dom';
import { NavigationItems } from './components/NavigationItems';
import { MoreButton } from './components/MoreButton';
import { NavigationBlob } from './components/NavigationBlob';
import { primaryNavItems } from './navigation-config';
import { useBlobAnimation } from './hooks/useBlobAnimation';
import AdminAccessButton from '@/components/admin/AdminAccessButton';

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
  const { blobStyle, updateBlobPosition } = useBlobAnimation();

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

  return (
    <nav 
      className="
        fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md 
        border-t border-gray-200/50 shadow-lg px-2 py-2 
        safe-area-inset-bottom md:px-4 lg:hidden
      "
      role="navigation"
      aria-label="Navigation mobile principale"
    >
      <div className="relative max-w-md mx-auto">
        {/* 🌟 Blob de navigation animé */}
        <NavigationBlob style={blobStyle} />
        
        {/* 📱 Conteneur des éléments de navigation */}
        <div className="relative flex items-center justify-between px-2">
          {/* 🔗 Éléments de navigation principaux */}
          <NavigationItems 
            items={primaryNavItems}
            activeIndex={activeIndex < primaryNavItems.length ? activeIndex : -1}
            onItemClick={updateBlobPosition}
          />
          
          {/* ➕ Bouton "More" pour le menu secondaire */}
          <MoreButton 
            isActive={activeIndex >= primaryNavItems.length}
            onActivate={() => updateBlobPosition(primaryNavItems.length)}
          />

          {/* 🔐 Bouton d'accès admin ultra-dissimulé */}
          <div className="absolute -top-1 -right-1">
            <AdminAccessButton isMobile={true} />
          </div>
        </div>
      </div>
    </nav>
  );
};
