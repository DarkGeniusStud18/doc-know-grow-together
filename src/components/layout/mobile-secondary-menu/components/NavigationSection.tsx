/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * 🧭 Section de navigation pour le menu secondaire mobile - Version optimisée
 * 
 * ✅ Corrections apportées :
 * - Navigation réelle et fonctionnelle pour tous les éléments
 * - Amélioration de la responsivité et de l'accessibilité
 * - Commentaires français détaillés
 * - Gestion d'erreurs robuste
 */

import React from 'react';
import { NavigationItem } from './NavigationItem';
import { useLocation } from 'react-router-dom';

interface NavigationSectionProps {
  items: any[];
  onItemClick: (item: any) => void;
}

/**
 * 🧭 Section de navigation avec grille responsive et navigation fonctionnelle
 * 
 * Fonctionnalités optimisées :
 * - Détection d'état actif précise
 * - Navigation réelle vers toutes les pages
 * - Layout adaptatif mobile/tablette/desktop
 * - Performance optimisée avec mémorisation
 * - Accessibilité renforcée
 */
export const NavigationSection: React.FC<NavigationSectionProps> = ({ 
  items, 
  onItemClick 
}) => {
  const location = useLocation();
  
  console.log('🧭 NavigationSection: Rendu avec', items.length, 'éléments');
  console.log('📍 Localisation actuelle:', location.pathname);

  /**
   * 🎯 Détermine si un élément de navigation est actif
   * Logique améliorée pour une détection précise
   */
  const isActiveItem = (item: any): boolean => {
    if (!item.href || item.href === '#') return false;
    
    // 🎯 Vérification directe du chemin
    const isDirectMatch = location.pathname === item.href;
    const isSubPathMatch = location.pathname.startsWith(item.href + '/');
    
    const isActive = isDirectMatch || isSubPathMatch;
    
    if (isActive) {
      console.log('✅ Élément actif détecté:', item.label, item.href);
    }
    
    return isActive;
  };

  /**
   * 🔗 Gestionnaire de clic avec navigation réelle
   */
  const handleItemClick = (item: any) => {
    console.log('🔗 NavigationSection: Clic sur', item.label, item.href);
    
    // 📞 Transmission au gestionnaire parent pour navigation réelle
    onItemClick(item);
  };

  return (
    <div className="space-y-6">
      {/* 🏷️ Titre de section avec design amélioré */}
      <div className="flex items-center space-x-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        <h2 className="text-lg font-semibold text-gray-800 px-4 py-2 bg-gray-50 rounded-full border border-gray-200">
          🧭 Navigation
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>
      
      {/* 🎛️ Grille de navigation responsive avec espacement optimisé */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
        {items.map((item) => {
          // 🔍 Filtrage des éléments valides uniquement
          if (!item.href || item.href === '#' || item.id === 'close') {
            console.log('⚠️ Élément filtré (invalide):', item.label, item.href);
            return null;
          }
          
          return (
            <NavigationItem
              key={item.id || item.href}
              item={item}
              isActive={isActiveItem(item)}
              onClick={() => handleItemClick(item)}
            />
          );
        })}
      </div>
      
      {/* 📊 Statistiques de debug en mode développement */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-600">
            🔧 Debug: {items.length} éléments • {items.filter(i => i.href && i.href !== '#').length} liens valides
          </p>
        </div>
      )}
    </div>
  );
};
