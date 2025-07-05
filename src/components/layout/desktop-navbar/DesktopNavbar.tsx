
import React from 'react';
import { PageTitle } from './components/PageTitle';
import { SearchBar } from './components/SearchBar';
import { UserActions } from './components/UserActions';
import AdminAccessButton from '@/components/admin/AdminAccessButton';

/**
 * 🖥️ Barre de navigation desktop - Design professionnel et moderne
 * 
 * Caractéristiques :
 * - Layout responsive adaptatif
 * - Composants modulaires réutilisables
 * - Performance optimisée
 * - Accessibilité complète
 * - Intégration parfaite avec le thème
 */
export const DesktopNavbar: React.FC = () => {
  return (
    <header 
      className={`
        sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md 
        border-b border-gray-200/50 shadow-sm
        transition-all duration-300 ease-in-out
      `}
      role="banner"
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 lg:h-16">
          {/* 📄 Titre de la page actuelle */}
          <PageTitle />
          
          {/* 🔍 Barre de recherche centrée */}
          <div className="flex-1 max-w-xl mx-8">
            <SearchBar />
          </div>
          
          {/* 👤 Actions utilisateur */}
          <div className="flex items-center gap-3 relative">
            <UserActions />
            
            {/* 🔐 Bouton d'accès admin ultra-dissimulé */}
            <div className="absolute -top-2 -right-2">
              <AdminAccessButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
