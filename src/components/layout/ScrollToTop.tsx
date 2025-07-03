
/**
 * 🔝 Composant ScrollToTop - Version Corrigée et Optimisée
 * 
 * Fonctionnalités améliorées :
 * - Défilement automatique vers le haut lors des changements de route
 * - Gestion intelligente des transitions
 * - Support pour les environnements mobile et desktop
 * - Optimisation des performances avec debouncing
 * - Prise en compte des ancres et des fragments d'URL
 */

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 🔝 Hook pour gérer le défilement automatique vers le haut
 * Déclenché à chaque changement de route avec optimisations
 */
const ScrollToTop: React.FC = () => {
  const location = useLocation();
  const previousPath = useRef<string>('');

  useEffect(() => {
    // Vérifier si le chemin a réellement changé
    const currentPath = location.pathname + location.search;
    
    if (previousPath.current === currentPath) {
      return; // Pas de changement, pas besoin de défiler
    }

    // Fonction de défilement avec options optimisées
    const scrollToTop = () => {
      try {
        // Méthode moderne avec smooth scrolling si supportée
        if ('scrollBehavior' in document.documentElement.style) {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
        } else {
          // Fallback pour les navigateurs plus anciens
          window.scrollTo(0, 0);
        }

        // Assurer le défilement pour les containers avec défilement
        const scrollableContainers = document.querySelectorAll('.overflow-y-auto, .overflow-auto');
        scrollableContainers.forEach(container => {
          if (container.scrollTop > 0) {
            container.scrollTop = 0;
          }
        });

        // Défilement spécifique pour les layouts mobiles
        const mobileContent = document.querySelector('.mobile-content');
        if (mobileContent && mobileContent.scrollTop > 0) {
          mobileContent.scrollTop = 0;
        }

        // Défilement pour le contenu principal
        const mainContent = document.querySelector('main');
        if (mainContent && mainContent.scrollTop > 0) {
          mainContent.scrollTop = 0;
        }

      } catch (error) {
        console.warn('⚠️ Erreur lors du défilement automatique:', error);
        // Fallback simple en cas d'erreur
        window.scrollTo(0, 0);
      }
    };

    // Gestion des fragments d'URL (ancres)
    if (location.hash) {
      // Si il y a une ancre, laisser le navigateur gérer le défilement
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    } else {
      // Pas d'ancre, défiler vers le haut
      // Utiliser un petit délai pour s'assurer que le DOM est mis à jour
      const timeoutId = setTimeout(scrollToTop, 50);
      
      // Nettoyage du timeout si le composant se démonte
      return () => clearTimeout(timeoutId);
    }

    // Mettre à jour le chemin précédent
    previousPath.current = currentPath;

    // Log pour le débogage en mode développement
    if (process.env.NODE_ENV === 'development') {
      console.log('🔝 ScrollToTop: Navigation vers', currentPath);
    }

  }, [location.pathname, location.search, location.hash]);

  // Ce composant ne rend rien, il ne fait que des effets de bord
  return null;
};

export default ScrollToTop;
