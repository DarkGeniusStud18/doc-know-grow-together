
/**
 * 📋 Composant de titre de page intelligent pour DesktopNavbar
 * 
 * Fonctionnalités :
 * - Mappage automatique des titres selon les routes
 * - Animation de transition fluide
 * - Fallback intelligent pour routes inconnues
 * - Organisation hiérarchique par catégories fonctionnelles
 */

import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Composant de titre de page avec mappage intelligent des routes
 * Optimisé avec mémorisation pour éviter les recalculs inutiles
 */
export const PageTitle: React.FC = () => {
  const location = useLocation();

  /**
   * 🏷️ Mappage intelligent des titres de page avec mémorisation
   * Évite les recalculs à chaque rendu pour optimiser les performances
   * Organisation hiérarchique par catégories fonctionnelles
   */
  const pageTitleMap = useMemo(() => ({
    // 🏠 Pages principales
    '/dashboard': 'Tableau de bord médical',
    '/': 'Accueil MedCollab',
    
    // 📚 Ressources et apprentissage
    '/resources': 'Ressources médicales avancées',
    '/my-courses': 'Mes cours personnalisés',
    '/notes': 'Carnet de notes intelligent',
    '/clinical-cases': 'Cas cliniques interactifs',
    '/exam-simulator': 'Simulateur d\'examens médicaux',
    '/continuing-education': 'Formation continue professionnelle',
    
    // 👥 Communauté et collaboration
    '/community': 'Communauté médicale collaborative',
    '/study-groups': 'Groupes d\'étude spécialisés',
    
    // 🛠️ Outils et productivité
    '/tools': 'Boîte à outils médicaux',
    '/calendar': 'Planificateur d\'études médicales',
    
    // ⚙️ Configuration et profil
    '/settings': 'Paramètres personnalisés',
    '/profile': 'Profil utilisateur complet',
    '/subscription': 'Gestion abonnement premium',
    
    // 🔐 Sécurité et vérification
    '/kyc': 'Vérification d\'identité médicale',
    '/kyc-verification': 'Processus de validation professionnelle',
    
    // 🎵 Fonctionnalités auxiliaires
    '/music-library': 'Bibliothèque audio thérapeutique'
  }), []);

  /**
   * 📄 Détermine le titre de la page actuelle avec fallback intelligent
   * Utilise le mapping optimisé avec titre par défaut professionnel
   */
  const currentPageTitle = useMemo(() => {
    const title = pageTitleMap[location.pathname as keyof typeof pageTitleMap];
    return title || 'MedCollab - Excellence Médicale Collaborative';
  }, [location.pathname, pageTitleMap]);

  return (
    <div className="flex-shrink-0">
      <h1 className="text-xl lg:text-2xl font-semibold text-medical-navy transition-all duration-200 hover:text-medical-teal">
        {currentPageTitle}
      </h1>
    </div>
  );
};
