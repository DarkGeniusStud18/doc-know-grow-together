
/**
 * Layout principal simplifié pour éviter les boucles infinies
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

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  requireAuth = false 
}) => {
  const navigate = useNavigate();
  const [hasRedirected, setHasRedirected] = useState(false);
  const [showTimeout, setShowTimeout] = useState(false);
  
  let user, loading;
  try {
    const authContext = useAuth();
    user = authContext.user;
    loading = authContext.loading;
  } catch (error) {
    console.error('MainLayout: Erreur contexte auth:', error);
    user = null;
    loading = false;
  }
  
  // Timeout pour éviter les chargements infinis
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        console.warn('MainLayout: Timeout de chargement');
        setShowTimeout(true);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setShowTimeout(false);
    }
  }, [loading]);
  
  // Redirection vers login si nécessaire
  useEffect(() => {
    if (!loading && !showTimeout && !user && requireAuth && !hasRedirected) {
      console.log('MainLayout: Redirection vers login');
      setHasRedirected(true);
      navigate('/login', { replace: true });
    }
  }, [user, loading, showTimeout, navigate, requireAuth, hasRedirected]);
  
  // Écran de chargement avec timeout
  if ((loading && !showTimeout) && requireAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-medical-light to-medical-blue/10">
        <div className="flex flex-col items-center gap-6 p-8 bg-white rounded-2xl shadow-lg max-w-sm w-full mx-4">
          <Loader2 className="h-16 w-16 text-medical-blue animate-spin" />
          <div className="text-center space-y-2">
            <p className="text-medical-navy font-semibold text-lg">
              Chargement...
            </p>
            <p className="text-gray-500 text-sm">
              Vérification de votre session
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Redirection forcée si timeout atteint
  if ((showTimeout || (!loading && !user && requireAuth)) && !hasRedirected) {
    navigate('/login', { replace: true });
    return null;
  }
  
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-medical-light to-white flex overflow-hidden">
        {user && <DiscordSidebar />}
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {user && <MobileNavbar />}
          {user && <DesktopNavbar />}
          {!user && <Navbar simplified />}
          
          <main className="flex-grow padding-page container-page overflow-x-auto bg-white/50 backdrop-blur-sm">
            <div className="spacing-section max-w-7xl mx-auto">
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </div>
          </main>
          
          <footer className="bg-white/80 backdrop-blur-sm py-6 border-t border-medical-blue/10 mt-auto">
            <div className="container-page">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-center sm:text-left text-sm text-gray-500">
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
        
        <PWAStatus />
      </div>
    </ErrorBoundary>
  );
};

export default MainLayout;
