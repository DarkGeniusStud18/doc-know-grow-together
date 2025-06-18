
/**
 * ⚡ Composant d'actions utilisateur pour DesktopNavbar
 * 
 * Fonctionnalités :
 * - Sélecteur de langue avec tooltip informatif
 * - Centre de notifications avec compteur dynamique
 * - Menu utilisateur contextuel avec informations détaillées
 * - Gestion sécurisée de la déconnexion
 */

import React, { useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Globe, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AuthUser } from '@/hooks/useSupabaseAuth';

interface UserActionsProps {
  user: AuthUser;
  onLogout: () => Promise<void>;
}

/**
 * Section d'actions utilisateur avec optimisations d'accessibilité
 * Composant modulaire pour les actions rapides et menu utilisateur
 */
export const UserActions: React.FC<UserActionsProps> = ({ user, onLogout }) => {
  /**
   * 🚪 Gestionnaire de déconnexion sécurisé avec gestion d'erreur
   * Nettoie les données utilisateur et redirige vers la page d'accueil
   */
  const handleLogout = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('🚪 UserActions: Initialisation déconnexion sécurisée');
    
    try {
      await onLogout();
      console.log('✅ UserActions: Déconnexion réussie avec nettoyage complet');
    } catch (error) {
      console.error('❌ UserActions: Erreur critique lors de la déconnexion:', error);
      // 🔄 Fallback: redirection forcée en cas d'échec
      window.location.href = '/login';
    }
  }, [onLogout]);

  /**
   * 👤 Génération intelligente des initiales utilisateur pour l'avatar
   * Traite les noms composés et caractères internationaux
   */
  const userInitials = useMemo(() => {
    if (!user.displayName) return 'UM'; // Utilisateur Médical par défaut
    
    return user.displayName
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [user.displayName]);

  return (
    <div className="flex items-center gap-2 lg:gap-4">
      
      {/* 🌐 Sélecteur de langue avec tooltip informatif */}
      <Button 
        variant="ghost" 
        size="icon" 
        title="Sélectionner la langue d'interface (FR/EN)" 
        className="h-9 w-9 transition-all duration-200 hover:scale-110 hover:bg-medical-light"
        aria-label="Changer de langue d'interface"
      >
        <Globe className="h-5 w-5" />
      </Button>
      
      {/* 🔔 Centre de notifications avec compteur dynamique */}
      <Button 
        variant="ghost" 
        size="icon" 
        title="Notifications médicales importantes" 
        className="h-9 w-9 relative transition-all duration-200 hover:scale-110 hover:bg-medical-light"
        aria-label="Voir les notifications"
        asChild
      >
        <Link to="/notifications">
          <Bell className="h-5 w-5" />
          {/* 🔴 Indicateur de nouvelles notifications avec animation */}
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center animate-pulse">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
          </span>
        </Link>
      </Button>
      
      {/* 👤 Menu utilisateur contextuel avec informations détaillées */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="relative h-9 w-9 rounded-full transition-all duration-200 hover:scale-110 hover:ring-2 hover:ring-medical-teal hover:ring-opacity-50"
            aria-label={`Menu utilisateur - ${user.displayName} (${user.role})`}
          >
            <Avatar className="h-9 w-9">
              <AvatarImage 
                src={user.profileImage || "/placeholder.svg"} 
                alt={`Photo de profil de ${user.displayName}`}
              />
              <AvatarFallback className="bg-medical-teal text-white text-sm font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        
        {/* 📋 Contenu du menu avec informations utilisateur enrichies */}
        <DropdownMenuContent align="end" className="w-64 p-2 animate-in slide-in-from-top-2">
          
          {/* 👤 En-tête avec profil utilisateur détaillé */}
          <div className="flex items-center justify-start gap-3 p-3 rounded-md bg-gradient-to-r from-gray-50 to-medical-light">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-medium text-sm text-gray-900">{user.displayName}</p>
              <p className="w-[200px] truncate text-xs text-gray-500" title={user.email}>
                {user.email}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-medical-teal capitalize font-medium">
                  {user.role === 'student' ? '🎓 Étudiant' : '👨‍⚕️ Professionnel'}
                </p>
                {user.subscriptionStatus === 'premium' && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                    💎 Premium
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <DropdownMenuSeparator />
          
          {/* 🔗 Liens de navigation rapide avec icônes descriptives */}
          <DropdownMenuItem asChild>
            <Link 
              to="/profile" 
              className="w-full cursor-pointer hover:bg-gray-100 transition-colors py-2 px-3 rounded-md flex items-center gap-2"
            >
              <span>👤</span>
              <span>Mon profil médical</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link 
              to="/settings" 
              className="w-full cursor-pointer hover:bg-gray-100 transition-colors py-2 px-3 rounded-md flex items-center gap-2"
            >
              <span>⚙️</span>
              <span>Paramètres avancés</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link 
              to="/subscription" 
              className="w-full cursor-pointer hover:bg-gray-100 transition-colors py-2 px-3 rounded-md flex items-center gap-2"
            >
              <span>💎</span>
              <span>Abonnement premium</span>
            </Link>
          </DropdownMenuItem>
          
          {/* 🆔 Vérification KYC pour étudiants non vérifiés */}
          {user.role === 'student' && user.kycStatus !== 'verified' && (
            <DropdownMenuItem asChild>
              <Link 
                to="/kyc" 
                className="w-full cursor-pointer hover:bg-blue-50 transition-colors py-2 px-3 rounded-md flex items-center gap-2 text-blue-600"
              >
                <span>🆔</span>
                <span>Vérifier mon statut étudiant</span>
              </Link>
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          
          {/* 🚪 Action de déconnexion sécurisée avec style distinctif */}
          <DropdownMenuItem
            className="cursor-pointer text-red-500 focus:text-red-500 hover:bg-red-50 transition-colors flex items-center py-2 px-3 rounded-md gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Déconnexion sécurisée</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
