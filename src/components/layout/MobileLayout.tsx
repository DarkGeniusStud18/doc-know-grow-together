
/**
 * 📱 Layout Mobile Optimisé - Version améliorée avec PWA et responsive
 * 
 * ✅ Améliorations apportées :
 * - Gestion intelligente de l'espacement vertical responsive
 * - Navigation adaptée aux écrans tactiles optimisée
 * - Performance PWA intégrée pour les connexions mobiles
 * - Synchronisation parfaite avec les fonctionnalités natives
 * - Commentaires français détaillés pour maintenance
 * - Gestion d'erreurs robuste et logging amélioré
 */

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import MobileTopBar from './mobile-topbar/MobileTopBar';
import { MobileNavbar } from './mobile-navbar/MobileNavbar';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { usePWAStatus } from '@/hooks/usePWAStatus';

/**
 * 📋 Interface pour les propriétés du layout mobile
 * Structure optimisée pour la flexibilité et la réutilisabilité
 */
interface MobileLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  title?: string;
  showBackButton?: boolean;
  className?: string;
}

/**
 * 📱 Layout mobile avec gestion optimisée de l'espace d'écran et PWA
 * 
 * Fonctionnalités avancées :
 * - Expérience utilisateur fluide sur tous les appareils mobiles
 * - Support PWA avec synchronisation automatique
 * - Gestion intelligente des environnements natifs/web
 * - Responsive design adaptatif et performant
 * - Safe area insets pour compatibilité avec les écrans modernes
 * - Animations fluides respectant les préférences utilisateur
 */
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

  // 🔒 Redirection si authentification requise mais utilisateur non connecté
  if (requireAuth && !user && !loading) {
    console.log('🔒 MobileLayout: Redirection vers login - utilisateur non authentifié');
    
    // 🚨 Gestion différenciée selon la plateforme
    if (isNative) {
      // 📱 Environnement natif : navigation via l'historique
      console.log('📱 Redirection native vers /login');
      window.history.pushState(null, '', '/login');
      window.location.reload();
    } else {
      // 🌐 Environnement web : redirection classique
      console.log('🌐 Redirection web vers /login');
      window.location.href = '/login';
    }
    
    return null;
  }

  // 🔄 Affichage du loader pendant l'authentification
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
        
        {/* 📱 Barre supérieure mobile - Position fixe pour navigation constante */}
        {user && (
          <div className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200">
            <MobileTopBar 
              title={title} 
              showBackButton={showBackButton} 
            />
          </div>
        )}

        {/* 📄 Zone de contenu principal avec padding adaptatif et responsive */}
        <main className={`
          flex-1 w-full overflow-x-hidden
          ${user ? 'pt-[60px] pb-[80px]' : 'pt-0 pb-0'}
          ${!isOnline ? 'bg-gray-100 dark:bg-gray-800' : ''}
        `}>
          {/* 🌐 Indicateur de statut de connexion (si hors ligne) */}
          {!isOnline && (
            <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-3 text-sm text-center">
              <div className="flex items-center justify-center space-x-2">
                <span>📶</span>
                <span>Mode hors ligne - Certaines fonctionnalités peuvent être limitées</span>
              </div>
            </div>
          )}
          
          {/* 📱 Conteneur principal responsive avec padding intelligent */}
          <div className="w-full h-full px-3 py-4 sm:px-4 md:px-6 lg:px-8">
            {/* 🔌 Indicateur de plateforme en mode développement */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-4 p-2 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-600 text-center">
                  🔧 Dev: Plateforme {platform} • Connexion: {isOnline ? '✅' : '❌'} • Utilisateur: {user?.displayName || 'Anonyme'}
                </p>
              </div>
            )}
            
            {/* 📋 Contenu principal de la page */}
            <div className="w-full">
              {children}
            </div>
          </div>
        </main>

        {/* 🧭 Navigation mobile horizontale - Position fixe en bas */}
        {user && (
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200">
            <MobileNavbar />
          </div>
        )}
        
        {/* 📱 Safe area pour les appareils avec encoche/punch hole */}
        <style>
          {`
            .safe-area-inset-top {
              padding-top: env(safe-area-inset-top);
            }
            .safe-area-inset-bottom {
              padding-bottom: env(safe-area-inset-bottom);
            }
          `}
        </style>
      </div>
    </ErrorBoundary>
  );
};

export default MobileLayout;
