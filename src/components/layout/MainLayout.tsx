
/**
 * 🏗️ Layout Principal MedCollab - Version Mobile-First Optimisée
 * 
 * Fonctionnalités principales :
 * - Navigation mobile fixe en bas d'écran
 * - Suppression des barres de défilement sur mobile/tablette
 * - Gestion responsive intelligente
 * - Support PWA complet
 * - Synchronisation automatique des données
 */

import React, { Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import Navbar from './navbar/Navbar';
import MobileNavbar from './mobile-navbar/MobileNavbar';
import MobileTopBar from './mobile-topbar/MobileTopBar';
import DesktopNavbar from './DesktopNavbar';
import DiscordSidebar from './discord-sidebar/DiscordSidebar';
import { ErrorBoundary } from '@/components/ui/error-boundary';

interface MainLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  showSidebar?: boolean;
  simplified?: boolean;
}

/**
 * 🎨 Layout principal avec optimisations mobile et PWA
 * Gestion intelligente des espacements et navigation
 */
const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  requireAuth = true, 
  showSidebar = true,
  simplified = false 
}) => {
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();

  // Redirection automatique si authentification requise
  if (requireAuth && !user && !loading) {
    console.log('🔒 MainLayout: Redirection vers login - utilisateur non authentifié');
    window.location.href = '/login';
    return null;
  }

  // Détection de l'environnement d'affichage
  const isTabletOrMobile = window.innerWidth < 1024;
  const isDesktop = window.innerWidth >= 1024;

  return (
    <ErrorBoundary>
      {/* Conteneur principal avec gestion du défilement */}
      <div className={`
        min-h-screen bg-gray-50 dark:bg-gray-900 flex
        ${isTabletOrMobile ? 'overflow-x-hidden' : ''}
      `}>
        
        {/* Sidebar verticale Discord - Desktop uniquement */}
        {!simplified && showSidebar && user && isDesktop && (
          <div className="fixed left-0 top-0 h-full z-30">
            <DiscordSidebar />
          </div>
        )}

        {/* Barre supérieure mobile - Position fixe */}
        {!simplified && user && isTabletOrMobile && (
          <div className="lg:hidden fixed top-0 left-0 right-0 z-40">
            <MobileTopBar />
          </div>
        )}

        {/* Contenu principal avec espacements corrigés */}
        <div className={`
          flex-1 min-h-screen transition-all duration-300 relative
          ${!simplified && user && isDesktop ? 'ml-[80px]' : ''}
          ${!simplified && user && isTabletOrMobile ? 'pt-[60px]' : ''}
          ${user && isTabletOrMobile ? 'pb-[80px]' : ''}
        `}>
          
          {/* Navigation supérieure - Conditions adaptées */}
          {simplified ? (
            <Navbar simplified={true} />
          ) : isDesktop && user ? (
            <DesktopNavbar />
          ) : null}

          {/* Zone de contenu principal avec gestion du défilement */}
          <main className={`
            w-full max-w-full relative
            ${isTabletOrMobile ? 'overflow-x-hidden' : ''}
          `}>
            {/* Conteneur de contenu avec padding uniforme */}
            <div className={`
              w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4
              ${isTabletOrMobile ? 'max-h-[calc(100vh-140px)] overflow-y-auto scrollbar-hide' : ''}
            `}>
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-[50vh]">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-blue"></div>
                    <span className="text-gray-600">Chargement en cours...</span>
                  </div>
                </div>
              }>
                {children}
              </Suspense>
            </div>
          </main>
        </div>

        {/* Navigation mobile/tablette horizontale - Position fixe garantie */}
        {user && isTabletOrMobile && (
          <div className="fixed bottom-0 left-0 right-0 z-50">
            <MobileNavbar />
          </div>
        )}
      </div>

      {/* Styles CSS personnalisés pour masquer les barres de défilement */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Masquer les barres de défilement sur mobile et tablette */
          @media (max-width: 1023px) {
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            
            /* Masquer la barre de défilement principale sur mobile */
            html, body {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            
            html::-webkit-scrollbar,
            body::-webkit-scrollbar {
              display: none;
            }
            
            /* Optimisation du défilement tactile */
            * {
              -webkit-overflow-scrolling: touch;
            }
          }
          
          /* Amélioration des performances d'animation */
          .transition-all {
            will-change: transform, opacity;
          }
          
          /* Optimisation des animations pour mobile */
          @media (max-width: 1023px) {
            * {
              transform: translateZ(0);
              backface-visibility: hidden;
            }
          }
        `
      }} />
    </ErrorBoundary>
  );
};

export default MainLayout;
