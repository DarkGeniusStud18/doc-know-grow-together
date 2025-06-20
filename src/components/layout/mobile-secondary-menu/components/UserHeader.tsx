
/**
 * 👤 En-tête utilisateur pour le menu secondaire mobile - Version optimisée
 * 
 * ✅ Améliorations apportées :
 * - Bouton de fermeture unique et fonctionnel
 * - Informations utilisateur enrichies
 * - Design responsive et accessible
 * - Commentaires français détaillés
 */

import React from 'react';
import { X, User, Crown, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';

interface UserHeaderProps {
  onClose: () => void;
  userRole?: string;
  userName?: string;
}

/**
 * 👤 En-tête utilisateur avec informations contextuelles et fermeture propre
 * 
 * Fonctionnalités optimisées :
 * - Avatar utilisateur avec image de profil
 * - Informations de rôle et statut
 * - Bouton de fermeture unique et accessible
 * - Design cohérent avec le thème médical
 * - Responsive design adaptatif
 */
export const UserHeader: React.FC<UserHeaderProps> = ({ 
  onClose, 
  userRole, 
  userName 
}) => {
  const { user } = useAuth();
  
  console.log('👤 UserHeader: Rendu pour utilisateur', user?.displayName);

  /**
   * 🎨 Obtient l'icône correspondant au rôle utilisateur
   */
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown size={16} className="text-yellow-600" />;
      case 'professional':
        return <Briefcase size={16} className="text-green-600" />;
      default:
        return <User size={16} className="text-blue-600" />;
    }
  };

  /**
   * 🏷️ Obtient le libellé français du rôle utilisateur
   */
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'professional':
        return 'Professionnel';
      case 'student':
        return 'Étudiant';
      default:
        return 'Utilisateur';
    }
  };

  /**
   * 🎨 Obtient la couleur du badge selon le rôle
   */
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'professional':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // 🎭 Calcul des initiales utilisateur
  const userInitials = user?.displayName
    ? user.displayName
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <div className="relative bg-gradient-to-r from-medical-blue to-medical-teal text-white p-6 rounded-t-3xl">
      {/* 🚪 Bouton de fermeture UNIQUE - Positionné en haut à droite */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
        aria-label="Fermer le menu"
      >
        <X size={20} />
      </Button>

      {/* 👤 Informations utilisateur avec avatar et détails */}
      <div className="flex items-center space-x-4 pr-12">
        {/* 🖼️ Avatar utilisateur avec image de profil */}
        <Avatar className="h-16 w-16 border-2 border-white/30">
          <AvatarImage 
            src={user?.profileImage || undefined} 
            alt={`Photo de profil de ${user?.displayName}`}
            className="object-cover"
          />
          <AvatarFallback className="bg-white/20 text-white text-lg font-bold">
            {userInitials}
          </AvatarFallback>
        </Avatar>

        {/* 📋 Informations textuelles utilisateur */}
        <div className="flex-1 min-w-0">
          {/* 👋 Nom d'utilisateur */}
          <h2 className="text-xl font-bold text-white truncate mb-1">
            {user?.displayName || userName || 'Utilisateur'}
          </h2>
          
          {/* 📧 Email utilisateur */}
          {user?.email && (
            <p className="text-white/80 text-sm truncate mb-2">
              {user.email}
            </p>
          )}
          
          {/* 🏷️ Badge de rôle avec icône */}
          <div className="flex items-center space-x-2">
            <Badge 
              variant={getRoleBadgeVariant(user?.role || userRole || 'student')}
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              <div className="flex items-center space-x-1">
                {getRoleIcon(user?.role || userRole || 'student')}
                <span>{getRoleLabel(user?.role || userRole || 'student')}</span>
              </div>
            </Badge>
            
            {/* 🌟 Indicateur de statut premium (si applicable) */}
            {user?.subscriptionStatus === 'premium' && (
              <Badge className="bg-yellow-500/20 text-yellow-100 border-yellow-400/30">
                ⭐ Premium
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* ✨ Effet de brillance décoratif */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-t-3xl pointer-events-none"></div>
    </div>
  );
};
