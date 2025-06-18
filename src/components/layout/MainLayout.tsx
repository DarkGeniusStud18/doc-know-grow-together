
import React, { Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import Navbar from './navbar/Navbar';
import MobileNavbar from './mobile-navbar/MobileNavbar';
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
 * Layout principal de l'application MedCollab optimisé pour toutes les plateformes
 * 
 * Architecture responsive adaptée :
 * - Mobile (< 640px) : Navigation horizontale en bas uniquement
 * - Tablette (640px - 1023px) : Navigation horizontale en bas uniquement  
 * - Desktop (≥ 1024px) : Sidebar verticale à gauche + navigation desktop
 * 
 * Fonctionnalités natives et web synchronisées automatiquement sans interférence
 */
const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  requireAuth = true, 
  showSidebar = true,
  simplified = false 
}) => {
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();

  // Redirection automatique vers la page de connexion si non authentifié
  if (requireAuth && !user && !loading) {
    console.log('🔒 MainLayout: Redirection vers login - utilisateur non authentifié');
    window.location.href = '/login';
    return null;
  }

  // Détermination intelligente du type d'écran pour l'interface adaptative
  const isTabletOrMobile = window.innerWidth < 1024; // < lg breakpoint
  const isDesktop = window.innerWidth >= 1024;

  console.log('📱 MainLayout: Type d\'écran détecté -', {
    isMobile,
    isTabletOrMobile,
    isDesktop,
    windowWidth: window.innerWidth
  });

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        
        {/* 🎯 SIDEBAR VERTICALE DISCORD - UNIQUEMENT DESKTOP (≥ 1024px) */}
        {!simplified && showSidebar && user && isDesktop && (
          <div className="fixed left-0 top-0 h-full z-30">
            <DiscordSidebar />
          </div>
        )}

        {/* 📱 CONTENU PRINCIPAL avec espacement adaptatif intelligent */}
        <div className={`
          flex-1 min-h-screen transition-all duration-300
          ${!simplified && user && isDesktop ? 'ml-[80px]' : ''}
          ${isTabletOrMobile && user ? 'pb-20' : ''}
        `}>
          
          {/* 🌐 NAVIGATION SUPERIEURE - UNIQUEMENT MODE SIMPLIFIE OU DESKTOP */}
          {simplified ? (
            <Navbar simplified={true} />
          ) : isDesktop && user ? (
            <DesktopNavbar />
          ) : null}

          {/* 📄 ZONE DE CONTENU PRINCIPAL avec gestion d'erreur intégrée */}
          <main className="w-full max-w-full px-0 sm:px-4 lg:px-6">
            <div className="w-full max-w-full">
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-blue"></div>
                  <span className="ml-3 text-gray-600">Chargement en cours...</span>
                </div>
              }>
                {children}
              </Suspense>
            </div>
          </main>
        </div>

        {/* 📱 NAVIGATION MOBILE/TABLETTE HORIZONTALE - POSITIONNEE EN BAS FIXE */}
        {/* Utilisée pour mobile ET tablette (< 1024px) selon vos spécifications */}
        {user && isTabletOrMobile && (
          <div className="lg:hidden">
            <MobileNavbar />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default MainLayout;
