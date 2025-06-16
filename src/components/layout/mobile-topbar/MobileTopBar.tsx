
/**
 * Barre supérieure fixe pour mobile et tablette
 * 
 * Contient le profil utilisateur, l'indicateur de connexion et le bouton paramètres
 * Affichée uniquement sur les écrans mobile et tablette
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { usePWAState } from '@/components/layout/pwa-status/hooks/usePWAState';

/**
 * Composant principal de la barre supérieure mobile
 * 
 * Fonctionnalités :
 * - Profil utilisateur à gauche avec avatar
 * - Indicateur de connexion au centre
 * - Bouton paramètres à droite
 * - Masqué automatiquement sur desktop
 */
const MobileTopBar: React.FC = () => {
  const { user } = useAuth();
  const { pwaState } = usePWAState();

  // Masquer si aucun utilisateur connecté
  if (!user) {
    return null;
  }

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 safe-area-inset-top">
        
        {/* Section profil utilisateur à gauche */}
        <Link 
          to="/profile" 
          className="flex items-center space-x-3 hover:bg-gray-100 rounded-lg p-2 transition-colors"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={user.profileImage} 
              alt={user.displayName || user.email || ''} 
            />
            <AvatarFallback className="bg-medical-blue text-white">
              {user.displayName 
                ? user.displayName.charAt(0).toUpperCase()
                : user.email?.charAt(0).toUpperCase() || <User className="h-4 w-4" />
              }
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-gray-900 truncate">
              {user.displayName || 'Utilisateur'}
            </span>
            <span className="text-xs text-gray-500 truncate">
              {user.email}
            </span>
          </div>
        </Link>

        {/* Section droite avec indicateur de connexion et paramètres */}
        <div className="flex items-center space-x-3">
          
          {/* Indicateur de connexion adapté pour la barre supérieure */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gray-50">
            <div className={`w-2 h-2 rounded-full ${pwaState.isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-xs font-medium text-gray-700">
              {pwaState.isOnline ? 'En ligne' : 'Hors ligne'}
            </span>
            {pwaState.isInstalled && (
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            )}
          </div>

          {/* Bouton paramètres */}
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 hover:bg-gray-100"
            asChild
          >
            <Link to="/settings" aria-label="Paramètres">
              <Settings className="h-4 w-4 text-gray-600" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileTopBar;
