
/**
 * 📱 Barre Supérieure Mobile - Version Complète avec Admin Access
 * 
 * Fonctionnalités :
 * - Logo et titre de l'application
 * - Bouton d'accès admin ultra-discret (mobile)
 * - Indicateurs de statut PWA
 * - Design médical cohérent
 * - Optimisation pour tous les écrans mobiles
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AdminAccessButton from '@/components/admin/AdminAccessButton';
import { ConnectionIndicator } from '@/components/layout/pwa-status/components/ConnectionIndicator';
import { usePWAState } from '@/components/layout/pwa-status/hooks/usePWAState';
import { Stethoscope, Wifi, WifiOff } from 'lucide-react';

/**
 * Composant barre supérieure mobile optimisée
 */
const MobileTopBar: React.FC = () => {
  const { user } = useAuth();
  const { pwaState } = usePWAState();

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        
        {/* Logo et titre */}
        <Link 
          to="/dashboard" 
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-medical-blue to-medical-teal rounded-xl flex items-center justify-center shadow-lg">
            <Stethoscope className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-medical-navy">MedCollab</h1>
            <p className="text-xs text-gray-600 -mt-1">Apprentissage médical</p>
          </div>
        </Link>

        {/* Section droite avec indicateurs et accès admin */}
        <div className="flex items-center space-x-3">
          
          {/* Indicateur de connexion PWA */}
          <div className="flex items-center space-x-2">
            <ConnectionIndicator 
              isOnline={pwaState.isOnline}
              isInstalled={pwaState.isInstalled}
              compact={true}
            />
          </div>

          {/* Bouton d'accès admin ultra-discret pour mobile */}
          <AdminAccessButton isMobile={true} className="ml-2" />

          {/* Informations utilisateur */}
          {user && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-medical-light rounded-full flex items-center justify-center">
                <span className="text-medical-navy text-sm font-medium">
                  {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default MobileTopBar;
