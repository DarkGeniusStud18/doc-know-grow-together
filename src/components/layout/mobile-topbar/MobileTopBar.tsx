
/**
 * Barre supérieure mobile ultra-professionnelle
 * 
 * Design premium avec micro-interactions et animations fluides
 * Optimisée pour l'expérience utilisateur mobile et tablette
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings, User, Bell, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { usePWAState } from '@/components/layout/pwa-status/hooks/usePWAState';
import { cn } from '@/lib/utils';

/**
 * Composant de barre supérieure mobile avec design premium
 * 
 * Fonctionnalités :
 * - Design adaptatif mobile/tablette avec animations
 * - Profil utilisateur avec informations contextuelles
 * - Indicateurs de statut avec micro-animations
 * - Boutons d'action avec feedback tactile optimisé
 * - Safe-area pour les appareils avec notch
 */
const MobileTopBar: React.FC = () => {
  const { user } = useAuth();
  const { pwaState } = usePWAState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Masquer si aucun utilisateur connecté
  if (!user) {
    return null;
  }

  // Détermination du statut utilisateur pour l'affichage
  const userRole = user.role === 'student' ? 'Étudiant' : 'Professionnel';
  const userInitials = user.displayName 
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
    : user.email?.charAt(0).toUpperCase() || 'U';

  return (
    <>
      {/* Barre supérieure fixe avec backdrop blur premium */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="safe-area-inset-top">
          <div className="flex items-center justify-between px-4 py-3">
            
            {/* Section gauche - Profil utilisateur premium */}
            <Link 
              to="/profile" 
              className="group flex items-center space-x-3 hover:bg-gray-50 rounded-2xl p-2 pr-4 transition-all duration-200 active:scale-95 min-w-0 flex-1 max-w-[60%]"
            >
              {/* Avatar avec indicateur de statut */}
              <div className="relative">
                <Avatar className="h-10 w-10 ring-2 ring-gray-100 group-hover:ring-medical-blue/30 transition-all duration-200">
                  <AvatarImage 
                    src={user.profileImage} 
                    alt={user.displayName || user.email || ''} 
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-medical-blue to-medical-teal text-white font-semibold text-sm">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                
                {/* Indicateur de statut en ligne */}
                <div className={cn(
                  "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white transition-all duration-300",
                  pwaState.isOnline ? "bg-green-500" : "bg-gray-400"
                )}>
                  {!pwaState.isOnline && (
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                  )}
                </div>
              </div>

              {/* Informations utilisateur avec typographie optimisée */}
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-base font-semibold text-gray-900 truncate group-hover:text-medical-blue transition-colors">
                    {user.displayName || 'Utilisateur'}
                  </span>
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "text-xs px-2 py-0.5 font-medium",
                      user.role === 'student' 
                        ? "bg-blue-50 text-blue-700 border-blue-200" 
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    )}
                  >
                    {userRole}
                  </Badge>
                </div>
                <span className="text-sm text-gray-500 truncate">
                  {user.email}
                </span>
              </div>
            </Link>

            {/* Section droite - Actions utilisateur */}
            <div className="flex items-center space-x-2">
              
              {/* Bouton recherche - Tablette uniquement */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex h-10 w-10 p-0 hover:bg-gray-100 rounded-xl transition-all duration-200 active:scale-95"
                asChild
              >
                <Link to="/search" aria-label="Rechercher">
                  <Search className="h-4 w-4 text-gray-600" />
                </Link>
              </Button>

              {/* Bouton notifications avec badge */}
              <Button
                variant="ghost"
                size="sm"
                className="relative h-10 w-10 p-0 hover:bg-gray-100 rounded-xl transition-all duration-200 active:scale-95"
                asChild
              >
                <Link to="/notifications" aria-label="Notifications">
                  <Bell className="h-4 w-4 text-gray-600" />
                  {/* Badge de notification */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white">
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                  </div>
                </Link>
              </Button>

              {/* Bouton paramètres */}
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0 hover:bg-gray-100 rounded-xl transition-all duration-200 active:scale-95"
                asChild
              >
                <Link to="/settings" aria-label="Paramètres">
                  <Settings className="h-4 w-4 text-gray-600" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Indicateur de connexion compact - Mobile uniquement */}
          <div className="sm:hidden px-4 pb-2">
            <div className={cn(
              "flex items-center justify-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300",
              pwaState.isOnline 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-red-50 text-red-700 border border-red-200"
            )}>
              <div className={cn(
                "w-2 h-2 rounded-full",
                pwaState.isOnline ? "bg-green-500" : "bg-red-500"
              )}></div>
              <span>{pwaState.isOnline ? 'En ligne' : 'Hors ligne'}</span>
              {pwaState.isInstalled && (
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer pour compenser la barre fixe */}
      <div className="md:hidden h-16 sm:h-20"></div>
    </>
  );
};

export default MobileTopBar;
