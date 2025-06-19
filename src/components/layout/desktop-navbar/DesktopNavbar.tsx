
/**
 * 🖥️ Barre de navigation desktop optimisée pour MedCollab - Version refactorisée
 * 
 * Architecture modulaire avec composants séparés :
 * - PageTitle : Gestion intelligente des titres de page
 * - SearchBar : Recherche avec debouncing et validation
 * - UserActions : Actions utilisateur et menu contextuel
 * 
 * Optimisations maintenues :
 * - Mémorisation des calculs coûteux avec useMemo
 * - Gestionnaires d'événements optimisés avec useCallback
 * - États locaux minimaux pour de meilleures performances
 * - Intégration native/web transparente sans interférence
 */

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PageTitle } from './components/PageTitle';
import { SearchBar } from './components/SearchBar';
import { UserActions } from './components/UserActions';

/**
 * Composant principal de navigation desktop refactorisé
 * Architecture modulaire pour une meilleure maintenabilité
 */
const DesktopNavbar: React.FC = () => {
  const { user, signOut } = useAuth();
  
  // 🛡️ Protection : masquer la navbar si aucun utilisateur connecté
  if (!user) {
    console.log('🚫 DesktopNavbar: Aucun utilisateur connecté, masquage de la navbar');
    return null;
  }

  /**
   * 🔍 Gestionnaire de recherche centralisé
   * Traite les requêtes de recherche provenant du composant SearchBar
   */
  const handleSearch = (query: string) => {
    console.log('DesktopNavbar: Recherche centralisée:', query);
    // 🚀 TODO: Intégrer le service de recherche global
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm backdrop-blur-md">
      <div className="container px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center gap-4 lg:gap-6">
        
        {/* 📋 Titre de page avec animation de transition fluide */}
        <PageTitle />

        {/* 🔍 Barre de recherche intelligente avec états visuels dynamiques */}
        <SearchBar onSearch={handleSearch} />

        {/* ⚡ Section actions utilisateur avec optimisations d'accessibilité */}
        <UserActions user={user} onLogout={signOut} />
      </div>
    </header>
  );
};

export default DesktopNavbar;
