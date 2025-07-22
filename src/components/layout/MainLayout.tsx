
import React, { Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import Navbar from './navbar/Navbar';
import { MobileNavbar } from './mobile-navbar/MobileNavbar';
import MobileTopBar from './mobile-topbar/MobileTopBar';
import DesktopNavbar from './DesktopNavbar';
import DiscordSidebar from './discord-sidebar/DiscordSidebar';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { UpdateManager } from './pwa-status/components/UpdateManager';

interface MainLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  showSidebar?: boolean;
  simplified?: boolean;
}

/**
 * Layout principal optimisé avec espacements mobiles corrigés
 * Navigation mobile toujours fixée en bas de l'écran
 * Barres de défilement masquées sur mobile/tablette
 */
const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  requireAuth = true, 
  showSidebar = true,
  simplified = false 
}) => {
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();

  // Redirection si authentification requise et utilisateur non connecté
  if (requireAuth && !user && !loading) {
    console.log('🔒 MainLayout: Redirection vers login - utilisateur non authentifié');
    window.location.href = '/login';
    return null;
  }

  const isTabletOrMobile = window.innerWidth < 1024;
  const isDesktop = window.innerWidth >= 1024;

  return (
    <ErrorBoundary>
      {/* 🔄 Gestionnaire de mises à jour OTA - Affiché sur tous les types d'écrans */}
      <UpdateManager />
      
      {/* Conteneur principal avec styles pour masquer les barres de défilement */}
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
          <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
            <MobileTopBar />
          </div>
        )}

        {/* Contenu principal avec espacements corrigés */}
        <div className={`
          flex-1 min-h-screen transition-all duration-300 flex flex-col
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

          {/* Zone de contenu principal avec padding uniforme */}
          <main className="flex-1 w-full max-w-full">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-[50vh]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-blue"></div>
                  <span className="ml-3 text-gray-600">Chargement en cours...</span>
                </div>
              }>
                {children}
              </Suspense>
            </div>
          </main>
        </div>

        {/* Navigation mobile/tablette horizontale - Position fixe garantie en bas */}
        {user && isTabletOrMobile && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg">
            <MobileNavbar />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default MainLayout;
