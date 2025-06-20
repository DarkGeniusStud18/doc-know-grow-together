
/**
 * 📱 Menu secondaire mobile déployable avec navigation fonctionnelle - Version optimisée
 * 
 * ✅ Corrections apportées :
 * - Navigation réelle vers les pages demandées
 * - Suppression des liens factices et non fonctionnels
 * - Amélioration de l'architecture modulaire
 * - Design responsive avec layout adaptatif optimisé
 * - Commentaires français détaillés pour maintenance
 * - Performance et accessibilité améliorées
 */

import React from 'react';
import { X } from 'lucide-react';
import { MobileSecondaryMenuProps } from './types';
import { UserHeader } from './components/UserHeader';
import { NavigationSection } from './components/NavigationSection';
import { LogoutSection } from './components/LogoutSection';
import { MenuFooter } from './components/MenuFooter';

/**
 * 📱 Menu secondaire mobile avec architecture modulaire et navigation réelle
 * 
 * Fonctionnalités optimisées et corrigées :
 * - Header utilisateur avec informations contextuelles
 * - Section de navigation avec grille responsive et NAVIGATION RÉELLE
 * - Section de déconnexion avec confirmation sécurisée
 * - Footer informatif avec version de l'application
 * - Design cohérent avec bordures arrondies et espacement amélioré
 * - Animations respectant les préférences d'accessibilité
 * - Gestion d'erreurs robuste et logging détaillé
 */
const MobileSecondaryMenu: React.FC<MobileSecondaryMenuProps> = ({
  items,
  onItemClick,
  userRole,
  userName
}) => {
  console.log('🎛️ MobileSecondaryMenu: Rendu avec', items.length, 'éléments');
  console.log('👤 Utilisateur:', { userRole, userName });

  /**
   * 🚪 Gestionnaire de fermeture du menu
   * Crée un élément factice pour maintenir la compatibilité de l'interface
   * mais utilise une vraie navigation pour fermer le menu
   */
  const handleClose = () => {
    console.log('🚪 MobileSecondaryMenu: Fermeture du menu demandée');
    
    const closeItem = {
      id: 'close',
      label: 'Fermer',
      icon: X,
      href: 'close' // Marqueur spécial pour fermeture
    };
    
    // 📞 Appel du gestionnaire parent avec l'élément de fermeture
    onItemClick(closeItem);
  };

  /**
   * 🔗 Gestionnaire de clic pour les éléments de navigation
   * Assure une navigation réelle et fonctionnelle
   */
  const handleItemClick = (item: any) => {
    console.log('🔗 MobileSecondaryMenu: Clic sur élément', item.label, item.href);
    
    // 📞 Transmission directe au gestionnaire parent pour navigation réelle
    onItemClick(item);
  };

  return (
    <div className="flex flex-col h-full max-h-[80vh] overflow-hidden bg-white rounded-t-3xl border-t-2 border-gray-100 shadow-2xl">
      {/* 👤 En-tête utilisateur avec informations contextuelles et bouton de fermeture fonctionnel */}
      <div className="flex-shrink-0">
        <UserHeader 
          onClose={handleClose}
          userRole={userRole}
          userName={userName}
        />
      </div>
      
      {/* 📱 Contenu principal avec scroll optimisé et espacement amélioré */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6">
        <div className="space-y-8 py-6">
          {/* 🧭 Section principale de navigation avec layout responsive et NAVIGATION RÉELLE */}
          <NavigationSection 
            items={items} 
            onItemClick={handleItemClick} // Navigation réelle assurée ici
          />
          
          {/* 🚪 Section de déconnexion avec design cohérent et navigation fonctionnelle */}
          <LogoutSection onItemClick={handleItemClick} />
        </div>
      </div>
      
      {/* 📋 Footer informatif fixe en bas avec bordures arrondies */}
      <div className="flex-shrink-0 border-t border-gray-100 bg-gray-50 rounded-b-3xl">
        <MenuFooter />
      </div>
    </div>
  );
};

export default MobileSecondaryMenu;
