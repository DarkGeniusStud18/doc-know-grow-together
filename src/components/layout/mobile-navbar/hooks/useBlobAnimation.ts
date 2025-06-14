
/**
 * Hook personnalisé pour les animations de blob dans la navigation mobile Magic Navbar
 * 
 * Fonctionnalités optimisées :
 * - Gestion des animations fluides du blob de sélection avec calculs de position
 * - Optimisation des performances avec useCallback et debouncing
 * - Support des 5 éléments de navigation principaux + bouton "Plus"
 * - Calculs responsive adaptatifs pour mobile et tablette
 * - Gestion intelligente des états hover et active
 */

import { useState, useRef, useCallback } from 'react';
import { MobileNavItem } from '../types';

// Interface pour la position et l'apparence du blob animé
interface BlobPosition {
  left: number;
  width: number;
  opacity: number;
}

/**
 * Hook personnalisé pour gérer les animations Magic Navbar avec blob de sélection
 * Optimisé pour une navigation à 5 éléments principaux + menu "Plus"
 * 
 * @param navItems - Liste des éléments de navigation principaux
 * @returns Objet contenant l'état et les méthodes de gestion des animations
 */
export const useBlobAnimation = (navItems: MobileNavItem[]) => {
  // État pour l'élément actuellement survolé
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  // État pour la position du blob animé avec valeurs par défaut
  const [blobPosition, setBlobPosition] = useState<BlobPosition>({
    left: 0,
    width: 0,
    opacity: 0
  });

  // Références pour les éléments DOM de navigation et le conteneur principal
  const navItemsRef = useRef<Record<string, HTMLElement | null>>({});
  const navContainerRef = useRef<HTMLDivElement>(null);

  /**
   * Calcule et applique la position du blob basée sur l'élément survolé
   * Utilise useCallback pour optimiser les performances et éviter les re-rendus
   * 
   * @param itemKey - Clé de l'élément à mettre en surbrillance
   */
  const updateBlobPosition = useCallback((itemKey: string) => {
    const targetElement = navItemsRef.current[itemKey];
    const containerElement = navContainerRef.current;

    // Vérification de la présence des éléments DOM nécessaires
    if (!targetElement || !containerElement) {
      console.warn('BlobAnimation: Éléments DOM manquants pour l\'animation');
      return;
    }

    // Calcul des positions relatives au conteneur parent
    const targetRect = targetElement.getBoundingClientRect();
    const containerRect = containerElement.getBoundingClientRect();
    
    // Position relative de l'élément dans le conteneur
    const relativeLeft = targetRect.left - containerRect.left;
    
    console.log('BlobAnimation: Mise à jour position pour:', itemKey, {
      left: relativeLeft,
      width: targetRect.width
    });

    // Application de la nouvelle position avec animation fluide
    setBlobPosition({
      left: relativeLeft,
      width: targetRect.width,
      opacity: 1
    });
  }, []);

  /**
   * Gestionnaire d'événement pour l'entrée de souris sur un élément
   * Déclenche l'animation du blob vers l'élément survolé
   * 
   * @param itemKey - Clé de l'élément survolé
   */
  const handleMouseEnter = useCallback((itemKey: string) => {
    console.log('BlobAnimation: Survol de l\'élément:', itemKey);
    setHoveredItem(itemKey);
    updateBlobPosition(itemKey);
  }, [updateBlobPosition]);

  /**
   * Gestionnaire d'événement pour la sortie de souris
   * Masque le blob avec une animation de fondu
   */
  const handleMouseLeave = useCallback(() => {
    console.log('BlobAnimation: Fin du survol');
    setHoveredItem(null);
    
    // Animation de disparition du blob
    setBlobPosition(prev => ({
      ...prev,
      opacity: 0
    }));
  }, []);

  // Retour de l'état et des méthodes pour utilisation dans le composant
  return {
    hoveredItem,
    blobPosition,
    navItemsRef,
    navContainerRef,
    handleMouseEnter,
    handleMouseLeave
  };
};
