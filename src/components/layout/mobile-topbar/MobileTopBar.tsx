
/**
 * Barre supérieure mobile permanente pour MedCollab
 * 
 * Composant de navigation supérieure toujours visible sur mobile.
 * Élimine les problèmes de visibilité intermittente.
 */

import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const MobileTopBar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const userInitials = useMemo(() => {
    if (!user?.displayName) return 'U';
    return user.displayName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [user?.displayName]);

  const pageTitle = useMemo(() => {
    const path = location.pathname;
    
    const titleMap: Record<string, string> = {
      '/': 'Accueil',
      '/dashboard': 'Tableau de bord',
      '/courses': 'Cours',
      '/resources': 'Ressources',
      '/community': 'Communauté',
      '/clinical-cases': 'Cas cliniques',
      '/tools': 'Outils',
      '/study-groups': 'Groupes d\'étude',
      '/calendar': 'Calendrier',
      '/profile': 'Mon profil',
      '/settings': 'Paramètres',
      '/subscription': 'Abonnement'
    };

    return titleMap[path] || 'MedCollab';
  }, [location.pathname]);

  const isPremiumUser = useMemo(() => {
    return user?.subscriptionStatus === 'premium' || user?.subscriptionStatus === 'trial';
  }, [user?.subscriptionStatus]);

  // ALWAYS show topbar when user is logged in - NO CONDITIONS
  if (!user) {
    return null;
  }

  return (
    <>
      {/* Barre de navigation PERMANENTE - TOUJOURS VISIBLE */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 safe-area-inset-top">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          
          {/* Section gauche : Logo et titre */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Link 
              to="/dashboard" 
              className="flex-shrink-0 transition-transform duration-200 hover:scale-105 active:scale-95"
              aria-label="Retour au tableau de bord"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-medical-blue to-medical-teal rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">M</span>
              </div>
            </Link>
            
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-semibold text-gray-900 truncate">
                {pageTitle}
              </h1>
              
              {isPremiumUser && (
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300"
                >
                  Premium
                </Badge>
              )}
            </div>
          </div>

          {/* Section droite : Actions utilisateur */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "relative p-2 rounded-full transition-all duration-200",
                "hover:bg-gray-100 active:scale-95"
              )}
              asChild
            >
              <Link to="/notifications" aria-label="Notifications">
                <Bell size={20} className="text-gray-700" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "p-2 rounded-full transition-all duration-200",
                "hover:bg-gray-100 active:scale-95"
              )}
              asChild
            >
              <Link to="/settings" aria-label="Paramètres">
                <Settings size={20} className="text-gray-700" />
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "p-1 rounded-full transition-all duration-200",
                "hover:bg-gray-100 active:scale-95"
              )}
              asChild
            >
              <Link to="/profile" aria-label="Profil">
                <Avatar className="h-8 w-8 border-2 border-transparent hover:border-medical-blue transition-colors">
                  <AvatarImage 
                    src={user.profileImage || undefined} 
                    alt={`Photo de profil de ${user.displayName}`}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-medical-blue to-medical-teal text-white text-sm font-medium">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </Button>
          </div>
        </div>

        {/* Indicateur de rôle utilisateur */}
        {user.role === 'professional' && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-green-400 to-green-600" />
        )}
        {user.role === 'student' && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600" />
        )}
      </div>

      {/* Espaceur pour la hauteur de la barre PERMANENTE */}
      <div className="md:hidden h-16 safe-area-inset-top" />
    </>
  );
};

export default MobileTopBar;
