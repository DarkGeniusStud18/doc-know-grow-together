
/**
 * 🔝 Composant de Retour en Haut de Page Automatique
 * Corrige le problème de défilement automatique vers le haut
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Défilement vers le haut à chaque changement de route
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    
    // Alternative pour les navigateurs qui ne supportent pas le behavior smooth
    try {
      window.scroll(0, 0);
    } catch (error) {
      // Fallback silencieux
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
