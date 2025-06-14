
/**
 * Menu secondaire mobile déployable avec design optimisé
 * 
 * Composant principal refactorisé offrant un accès rapide aux fonctionnalités avancées
 * Design responsive avec layout adaptatif mobile/tablette et bordures arrondies
 */

import React from 'react';
import { X } from 'lucide-react';
import { MobileSecondaryMenuProps } from './types';
import { UserHeader } from './components/UserHeader';
import { NavigationSection } from './components/NavigationSection';
import { LogoutSection } from './components/LogoutSection';
import { MenuFooter } from './components/MenuFooter';

/**
 * Menu secondaire mobile avec architecture modulaire et design arrondi
 * 
 * Fonctionnalités optimisées :
 * - Header utilisateur avec informations contextuelles
 * - Section de navigation avec grille responsive adaptative
 * - Section de déconnexion avec confirmation sécurisée
 * - Footer informatif avec version de l'application
 * - Design cohérent avec bordures arrondies et espacement amélioré
 * - Animations respectant les préférences d'accessibilité
 */
const MobileSecondaryMenu: React.FC<MobileSecondaryMenuProps> = ({
  items,
  onItemClick
}) => {
  /**
   * Gestionnaire de fermeture du menu
   * Crée un élément factice pour maintenir la compatibilité de l'interface
   */
  const handleClose = () => {
    const closeItem = {
      id: 'close',
      label: 'Fermer',
      icon: X, // Utilisation d'une vraie icône Lucide
      href: '#'
    };
    onItemClick(closeItem);
  };

  return (
    <div className="flex flex-col h-full max-h-[80vh] overflow-hidden bg-white rounded-t-3xl border-t-2 border-gray-100">
      {/* En-tête utilisateur avec informations contextuelles */}
      <div className="flex-shrink-0">
        <UserHeader onClose={handleClose} />
      </div>
      
      {/* Contenu principal avec scroll optimisé et espacement amélioré */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6">
        <div className="space-y-8 py-6">
          {/* Section principale de navigation avec layout responsive */}
          <NavigationSection 
            items={items} 
            onItemClick={onItemClick}
          />
          
          {/* Section de déconnexion avec design cohérent */}
          <LogoutSection onItemClick={onItemClick} />
        </div>
      </div>
      
      {/* Footer informatif fixe en bas avec bordures arrondies */}
      <div className="flex-shrink-0 border-t border-gray-100 bg-gray-50 rounded-b-3xl">
        <MenuFooter />
      </div>
    </div>
  );
};

export default MobileSecondaryMenu;
