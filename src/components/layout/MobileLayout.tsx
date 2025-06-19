
/**
 * 📱 Layout Mobile Optimisé
 * 
 * Composant de mise en page spécialement conçu pour les appareils mobiles
 * - Gestion intelligente de l'espacement vertical
 * - Navigation adaptée aux écrans tactiles
 * - Performance optimisée pour les connexions mobiles
 */

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import MobileTopBar from './mobile-topbar/MobileTopBar';
import MobileNavbar from './mobile-navbar/MobileNavbar';
import { ErrorBoundary } from '@/components/ui/error-boundary';

interface MobileLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  title?: string;
  showBackButton?: boolean;
}

/**
 * Layout mobile avec gestion optimisée de l'espace d'écran
 * Assure une expérience utilisateur fluide sur tous les appareils mobiles
 */
const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  requireAuth = true,
  title,
  showBackButton = false
}) => {
  const { user, loading } = useAuth();

  // 🔒 Redirection si authentification requise mais utilisateur non connecté
  if (requireAuth && !user && !loading) {
    console.log('🔒 MobileLayout: Redirection vers login - utilisateur non authentifié');
    window.location.href = '/login';
    return null;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        
        {/* 📱 Barre supérieure mobile - Position fixe pour navigation constante */}
        {user && (
          <div className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm border-b">
            <MobileTopBar title={title} showBackButton={showBackButton} />
          </div>
        )}

        {/* 📄 Zone de contenu principal avec padding adaptatif */}
        <main className={`
          flex-1 w-full overflow-x-hidden
          ${user ? 'pt-[60px] pb-[80px]' : 'pt-0 pb-0'}
        `}>
          <div className="w-full h-full px-3 py-4 sm:px-4 md:px-6">
            {children}
          </div>
        </main>

        {/* 🧭 Navigation mobile horizontale - Position fixe en bas */}
        {user && (
          <div className="fixed bottom-0 left-0 right-0 z-40">
            <MobileNavbar />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default MobileLayout;
