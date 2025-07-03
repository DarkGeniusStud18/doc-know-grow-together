
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook personnalisé pour gérer le scroll automatique vers le haut lors des changements de route
 * Assure une navigation fluide et professionnelle dans l'application
 */
export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll fluide vers le haut à chaque changement de route
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    
    console.log('📜 ScrollToTop: Navigation vers', pathname);
  }, [pathname]);
};

/**
 * Hook pour forcer le scroll vers le haut immédiatement (sans animation)
 * Utile pour les cas où on a besoin d'un repositionnement immédiat
 */
export const useInstantScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll immédiat vers le haut
    window.scrollTo(0, 0);
    console.log('⚡ InstantScrollToTop: Position réinitialisée pour', pathname);
  }, [pathname]);
};
