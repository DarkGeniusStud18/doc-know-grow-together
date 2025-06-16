
import React, { Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
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

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  requireAuth = true, 
  showSidebar = true,
  simplified = false 
}) => {
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();

  if (requireAuth && !user && !loading) {
    // Redirect vers la page de login si l'utilisateur n'est pas authentifié
    window.location.href = '/login';
    return null; // Empêche le rendu du reste du composant
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Navigation principale */}
        {!simplified ? (
          <>
            {/* Barre supérieure mobile/tablette */}
            <MobileTopBar />
            
            {/* Navigation selon le type d'écran */}
            {isMobile ? (
              <Navbar simplified={simplified} />
            ) : (
              <DesktopNavbar />
            )}
          </>
        ) : (
          <Navbar simplified={true} />
        )}

        {/* Contenu principal avec padding adaptatif pour la barre mobile */}
        <main className={`
          ${!simplified && user ? 'md:ml-64' : ''}
          ${user ? 'pt-16 md:pt-0 pb-20 md:pb-0' : ''}
          min-h-screen transition-all duration-300
          px-0 sm:px-4 lg:px-6
        `}>
          <div className="w-full max-w-full">
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-blue"></div>
              </div>
            }>
              {children}
            </Suspense>
          </div>
        </main>

        {/* Sidebar Discord pour desktop */}
        {!simplified && showSidebar && user && !isMobile && (
          <DiscordSidebar />
        )}

        {/* Navigation mobile en bas */}
        <MobileNavbar />
      </div>
    </ErrorBoundary>
  );
};

export default MainLayout;
