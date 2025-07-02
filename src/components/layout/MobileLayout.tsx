
/**
 * 📱 Layout Mobile Optimisé - Version corrigée responsive
 */

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import MobileTopBar from './mobile-topbar/MobileTopBar';
import MobileNavbar from './mobile-navbar/MobileNavbar';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { usePWAStatus } from '@/hooks/usePWAStatus';

interface MobileLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  title?: string;
  showBackButton?: boolean;
  className?: string;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  requireAuth = true,
  title,
  showBackButton = false,
  className = ''
}) => {
  const { user, loading } = useAuth();
  const { isOnline, isNative, platform } = usePWAStatus();

  console.log('📱 MobileLayout: Rendu pour utilisateur', user?.id);
  console.log('🌐 État de connexion:', isOnline ? 'En ligne' : 'Hors ligne');
  console.log('📱 Plateforme:', platform, isNative ? '(Native)' : '(Web)');

  if (requireAuth && !user && !loading) {
    console.log('🔒 MobileLayout: Redirection vers login - utilisateur non authentifié');
    
    if (isNative) {
      console.log('📱 Redirection native vers /login');
      window.history.pushState(null, '', '/login');
      window.location.reload();
    } else {
      console.log('🌐 Redirection web vers /login');
      window.location.href = '/login';
    }
    
    return null;
  }

  if (requireAuth && loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-teal"></div>
          <p className="text-gray-600 dark:text-gray-300">🔄 Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col ${className}`}>
        
        {/* 📱 Barre supérieure mobile */}
        {user && (
          <div className="fixed top-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-lg shadow-sm border-b border-gray-200">
            <MobileTopBar 
              title={title} 
              showBackButton={showBackButton} 
            />
          </div>
        )}

        {/* 📄 Zone de contenu principal responsive */}
        <main className={`
          flex-1 w-full overflow-x-hidden
          ${user ? 'pt-[60px] pb-[88px]' : 'pt-0 pb-0'}
          ${!isOnline ? 'bg-gray-100 dark:bg-gray-800' : ''}
        `}>
          {/* 🌐 Indicateur de statut de connexion */}
          {!isOnline && (
            <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-3 text-sm text-center">
              <div className="flex items-center justify-center space-x-2">
                <span>📶</span>
                <span>Mode hors ligne - Certaines fonctionnalités peuvent être limitées</span>
              </div>
            </div>
          )}
          
          {/* 📱 Conteneur principal responsive */}
          <div className="w-full h-full px-3 py-4 sm:px-4 md:px-6 lg:px-8 max-w-full overflow-x-hidden">
            {/* 🔌 Indicateur de plateforme en mode développement */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-4 p-2 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-600 text-center">
                  🔧 Dev: Plateforme {platform} • Connexion: {isOnline ? '✅' : '❌'} • Utilisateur: {user?.displayName || 'Anonyme'}
                </p>
              </div>
            )}
            
            {/* 📋 Contenu principal responsive */}
            <div className="w-full max-w-full">
              {children}
            </div>
          </div>
        </main>

        {/* 🧭 Navigation mobile fixe */}
        {user && <MobileNavbar />}
        
        {/* 📱 Styles CSS pour les safe areas et responsive */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .safe-area-inset-top {
              padding-top: env(safe-area-inset-top);
            }
            .safe-area-inset-bottom {
              padding-bottom: env(safe-area-inset-bottom);
            }
            
            /* Corrections responsive pour mobile */
            @media (max-width: 768px) {
              .container {
                padding-left: 1rem;
                padding-right: 1rem;
                max-width: 100%;
              }
              
              .grid {
                gap: 1rem;
              }
              
              .text-3xl {
                font-size: 1.875rem;
              }
              
              .space-y-6 > * + * {
                margin-top: 1.5rem;
              }
            }
            
            @media (max-width: 640px) {
              .container {
                padding-left: 0.75rem;
                padding-right: 0.75rem;
              }
              
              .text-2xl {
                font-size: 1.5rem;
              }
              
              .grid-cols-2 {
                grid-template-columns: 1fr;
              }
              
              .space-y-4 > * + * {
                margin-top: 1rem;
              }
            }
          `
        }} />
      </div>
    </ErrorBoundary>
  );
};

export default MobileLayout;
