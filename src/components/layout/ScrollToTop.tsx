
/**
 * 🔝 Composant ScrollToTop - Gestion automatique du défilement
 * 
 * Fonctionnalités :
 * - Défilement automatique vers le haut lors des changements de route
 * - Gestion intelligente des exceptions (modales, onglets)
 * - Performance optimisée avec useEffect
 * - Compatible avec toutes les tailles d'écran
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Composant de gestion automatique du scroll
 * Corrige le problème de démarrage en bas de page
 */
const ScrollToTop: React.FC = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Liste des routes qui ne doivent pas déclencher le scroll automatique
    const excludedRoutes = [
      '/admin-dashboard', // Dashboard admin peut avoir des ancrages spécifiques
    ];

    // Vérifier si la route actuelle doit être exclue
    const shouldScroll = !excludedRoutes.some(route => pathname.startsWith(route));

    if (shouldScroll) {
      // Délai court pour s'assurer que le composant est monté
      setTimeout(() => {
        // Défilement vers le haut avec comportement fluide
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'auto' // Changé de 'smooth' à 'auto' pour un scroll immédiat
        });

        // Fallback supplémentaire pour garantir le scroll
        try {
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        } catch (error) {
          console.log('ScrollToTop: Fallback scroll appliqué');
        }
      }, 10); // Délai très court mais nécessaire
    }

    // Log pour le débogage
    console.log(`📍 Navigation vers: ${pathname}${search} - Scroll: ${shouldScroll ? 'Activé' : 'Désactivé'}`);
  }, [pathname, search]);

  // Ce composant n'affiche rien - il agit uniquement sur le comportement
  return null;
};

export default ScrollToTop;
