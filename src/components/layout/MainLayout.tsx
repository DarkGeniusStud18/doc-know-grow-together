
/**
 * Layout principal de l'application MedCollab avec gestion responsive optimisée
 * 
 * Composant refactorisé pour éviter les chargements infinis et améliorer les performances
 * Architecture modulaire avec gestion d'erreurs robuste et chargement intelligent
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from './navbar';
import DiscordSidebar from './discord-sidebar/DiscordSidebar';
import { MobileNavbar } from './mobile-navbar';
import DesktopNavbar from './DesktopNavbar';
import { PWAStatus } from './PWAStatus';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { ErrorBoundary } from '@/components/ui/error-boundary';

interface MainLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

/**
 * Layout principal de l'application MedCollab avec gestion responsive optimisée
 * 
 * Fonctionnalités :
 * - Gestion adaptative desktop/mobile/tablette avec breakpoints intelligents
 * - Authentification sécurisée avec protection contre les boucles infinies
 * - Navigation contextuelle selon l'état utilisateur avec mémorisation
 * - Intégration PWA pour une expérience native optimisée
 * - Design responsive avec breakpoints optimisés et safe-areas
 * - Gestion d'erreurs robuste avec fallbacks gracieux
 */
const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  requireAuth = false 
}) => {
  const navigate = useNavigate();
  
  // État local pour éviter les re-rendus excessifs et les boucles infinies
  const [hasRedirected, setHasRedirected] = useState(false);
  const [forceShowContent, setForceShowContent] = useState(false);
  
  // Gestion sécurisée du contexte d'authentification avec protection d'erreur
  let user, loading;
  try {
    const authContext = useAuth();
    user = authContext.user;
    loading = authContext.loading;
  } catch (error) {
    console.error('MainLayout: Erreur du contexte d\'authentification:', error);
    // Traitement comme utilisateur non authentifié si erreur contexte
    user = null;
    loading = false;
  }
  
  // Protection contre les chargements infinis avec timeout automatique et mémorisation
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        console.warn('MainLayout: Timeout de chargement atteint, force l\'affichage');
        setForceShowContent(true);
      }, 3000); // Timeout de 3 secondes

      return () => clearTimeout(timer);
    }
  }, [loading]);
  
  // Redirection automatique vers login si authentification requise (une seule fois)
  useEffect(() => {
    if (!loading && !user && requireAuth && !hasRedirected && !forceShowContent) {
      console.log('MainLayout: Redirection vers login - authentification requise');
      setHasRedirected(true);
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate, requireAuth, hasRedirected, forceShowContent]);
  
  // Écran de chargement optimisé avec design médical et timeout intelligent
  if (loading && !forceShowContent && requireAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-medical-light to-medical-blue/10">
        <div className="flex flex-col items-center gap-6 p-6 sm:p-8 bg-white rounded-2xl shadow-lg max-w-sm w-full mx-4 border border-medical-blue/10">
          <div className="relative">
            <Loader2 className="h-12 w-12 sm:h-16 sm:w-16 text-medical-blue animate-spin" />
            <div className="absolute inset-0 h-12 w-12 sm:h-16 sm:w-16 border-2 border-medical-teal/20 rounded-full animate-pulse"></div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-medical-navy font-semibold text-base sm:text-lg">
              Vérification de la session...
            </p>
            <p className="text-gray-500 text-sm animate-pulse">
              Chargement de votre espace personnel
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Redirection forcée après timeout si authentification requise mais pas d'utilisateur
  if ((!loading || forceShowContent) && !user && requireAuth) {
    if (!hasRedirected) {
      console.log('MainLayout: Redirection forcée après timeout');
      navigate('/login', { replace: true });
      return null;
    }
  }
  
  // Layout pour utilisateur authentifié avec navigation complète et gestion d'erreurs
  if (user || !requireAuth) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-medical-light to-white flex overflow-hidden">
          {/* Sidebar Discord pour écrans desktop uniquement avec lazy loading */}
          {user && <DiscordSidebar />}
          
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Navbar mobile pour petits écrans (responsive) avec optimisations */}
            {user && <MobileNavbar />}
            
            {/* Navbar desktop pour écrans moyens et grands avec mémorisation */}
            {user && <DesktopNavbar />}
            
            {/* Navbar publique pour utilisateurs non connectés */}
            {!user && <Navbar simplified />}
            
            {/* Contenu principal avec padding responsive optimisé et safe-areas */}
            <main className="flex-grow padding-page container-page overflow-x-auto bg-white/50 backdrop-blur-sm">
              <div className="spacing-section max-w-7xl mx-auto">
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
              </div>
            </main>
            
            {/* Footer responsive avec espacement adaptatif et design amélioré */}
            <footer className="bg-white/80 backdrop-blur-sm py-4 sm:py-6 md:py-8 border-t border-medical-blue/10 mt-auto">
              <div className="container-page">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-center sm:text-left text-xs sm:text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} MedCollab. Tous droits réservés.
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>Plateforme médicale collaborative</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline">Version 1.0.0</span>
                  </div>
                </div>
              </div>
            </footer>
          </div>
          
          {/* Composant de statut PWA pour fonctionnalités natives avec lazy loading */}
          <PWAStatus />
        </div>
      </ErrorBoundary>
    );
  }
  
  // Fallback en cas d'état inattendu
  return null;
};

export default MainLayout;
