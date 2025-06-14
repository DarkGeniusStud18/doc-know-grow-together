
/**
 * Hook personnalisé pour gérer les animations Magic Navbar
 * 
 * Gestion complète du blob flottant avec animations fluides
 * et calculs de position précis pour une expérience utilisateur optimale
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { BlobPosition, NavItemsRef, NavItemData } from '../types';

/**
 * Hook principal pour les animations Magic Navbar du blob flottant
 * 
 * Fonctionnalités :
 * - Gestion des états de survol et d'activité
 * - Calcul automatique des positions d'animation
 * - Synchronisation avec la navigation utilisateur
 * - Transitions fluides et optimisées
 * 
 * @param allNavItems - Liste complète des éléments de navigation
 * @returns Objet contenant les états et gestionnaires d'animation
 */
export const useBlobAnimation = (allNavItems: NavItemData[]) => {
  const location = useLocation();
  
  // États pour les animations Magic Navbar - gestion fluide du blob flottant
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [blobPosition, setBlobPosition] = useState<BlobPosition>({ top: 0, opacity: 0 });
  
  // Références pour le calcul précis des positions d'animation
  const navItemsRef = useRef<NavItemsRef>({});
  const sidebarRef = useRef<HTMLDivElement>(null);

  /**
   * Fonction utilitaire optimisée pour déterminer si un chemin est actif
   * @param path - Chemin de navigation à vérifier
   * @returns True si le chemin correspond à la route actuelle
   */
  const isActive = useCallback((path: string) => {
    return location.pathname === path;
  }, [location.pathname]);

  /**
   * Calcule la position du blob magique basé sur l'élément cible
   * Animation fluide avec transitions CSS optimisées
   * @param targetPath - Chemin de l'élément cible pour l'animation
   */
  const updateBlobPosition = useCallback((targetPath: string) => {
    const targetElement = navItemsRef.current[targetPath];
    const sidebarElement = sidebarRef.current;
    
    if (targetElement && sidebarElement) {
      const sidebarRect = sidebarElement.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();
      
      // Calcul de la position relative à la sidebar pour le blob
      const relativeTop = targetRect.top - sidebarRect.top;
      
      setBlobPosition({
        top: relativeTop,
        opacity: 1
      });
    }
  }, []);

  /**
   * Gestion du survol pour l'animation Magic Navbar
   * Déclenchement immédiat de l'animation au survol
   */
  const handleMouseEnter = useCallback((path: string) => {
    setHoveredItem(path);
    updateBlobPosition(path);
  }, [updateBlobPosition]);

  /**
   * Gestion de la sortie du survol avec retour à l'élément actif
   * Restauration de la position du blob sur l'élément actif
   */
  const handleMouseLeave = useCallback(() => {
    setHoveredItem(null);
    // Retourner au blob sur l'élément actif
    const activeItem = allNavItems.find(item => isActive(item.path));
    if (activeItem) {
      updateBlobPosition(activeItem.path);
    } else {
      setBlobPosition(prev => ({ ...prev, opacity: 0 }));
    }
  }, [allNavItems, isActive, updateBlobPosition]);

  /**
   * Effet pour mettre à jour la position du blob lors des changements de route
   * Synchronisation automatique avec la navigation utilisateur
   */
  useEffect(() => {
    const activeItem = allNavItems.find(item => isActive(item.path));
    if (activeItem) {
      // Délai pour permettre au DOM de se mettre à jour complètement
      setTimeout(() => {
        updateBlobPosition(activeItem.path);
      }, 100);
    }
  }, [location.pathname, allNavItems, isActive, updateBlobPosition]);

  return {
    hoveredItem,
    blobPosition,
    navItemsRef,
    sidebarRef,
    isActive,
    handleMouseEnter,
    handleMouseLeave
  };
};
