
/**
 * Section de navigation pour le menu secondaire mobile
 * 
 * Composant responsable de l'affichage organisé des éléments de navigation
 * avec grille responsive et espacement optimisé
 */

import React from 'react';
import { useLocation } from 'react-router-dom';
import { NavigationItem } from './NavigationItem';
import { NavigationSectionProps } from '../types';

/**
 * Section de navigation avec grille responsive et organisation intelligente
 * 
 * Fonctionnalités optimisées :
 * - Grille adaptative selon la taille d'écran
 * - Détection automatique de l'état actif des éléments
 * - Espacement et padding optimisés pour mobile/tablette
 * - Organisation logique des éléments par catégorie
 * - Performance optimisée avec mémorisation des calculs
 */
export const NavigationSection: React.FC<NavigationSectionProps> = ({
  items,
  onItemClick
}) => {
  const location = useLocation();

  /**
   * Détermine si un élément de navigation est actif
   * Prend en compte le href et les fonctions isActive personnalisées
   * 
   * @param item - Élément de navigation à vérifier
   * @returns true si l'élément est actif
   */
  const isItemActive = React.useCallback((item: typeof items[0]) => {
    if (!item.href) return false;
    
    // Utiliser la fonction isActive personnalisée si disponible
    if (item.isActive && typeof item.isActive === 'function') {
      return item.isActive(location.pathname);
    }
    
    // Vérification par défaut basée sur le pathname
    return location.pathname === item.href || 
           location.pathname.startsWith(item.href + '/');
  }, [location.pathname]);

  /**
   * Gestionnaire de clic optimisé pour les éléments de navigation
   * Ferme le menu et exécute les callbacks appropriés
   * 
   * @param item - Élément cliqué
   */
  const handleItemClick = React.useCallback((item: typeof items[0]) => {
    // Fermer le menu via le callback parent
    onItemClick(item);
  }, [onItemClick]);

  return (
    <div className="space-y-6">
      {/* Titre de section avec design amélioré */}
      <div className="px-2">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          Navigation
        </h3>
        <p className="text-sm text-gray-500">
          Accédez rapidement à vos outils favoris
        </p>
      </div>
      
      {/* Grille de navigation responsive avec espacement optimisé */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 px-2">
        {items.map((item) => (
          <NavigationItem
            key={item.id}
            item={item}
            isActive={isItemActive(item)}
            onClick={() => handleItemClick(item)}
          />
        ))}
      </div>
      
      {/* Message informatif si aucun élément */}
      {items.length === 0 && (
        <div className="text-center py-8 px-4">
          <p className="text-gray-500 text-sm">
            Aucun élément de navigation disponible
          </p>
        </div>
      )}
    </div>
  );
};
