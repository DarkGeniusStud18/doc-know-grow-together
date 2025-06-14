
/**
 * Composant avatar utilisateur pour DiscordSidebar
 * 
 * Avatar interactif avec informations utilisateur, effets visuels
 * et indicateur de statut en ligne avec animations
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * Interface pour les propriétés du composant UserAvatar
 */
interface UserAvatarProps {
  displayName: string;
  role: string;
}

/**
 * Composant avatar utilisateur avec lien vers le profil et effets visuels
 * 
 * Fonctionnalités :
 * - Génération automatique des initiales utilisateur
 * - Tooltip informatif avec nom et rôle
 * - Effets de survol et d'interaction
 * - Indicateur de statut en ligne animé
 * - Design moderne avec gradient et ombres
 */
export const UserAvatar: React.FC<UserAvatarProps> = ({ displayName, role }) => {
  /**
   * Génération des initiales de l'utilisateur pour l'avatar
   * Extraction des deux premiers caractères du nom d'affichage
   */
  const userInitials = displayName.substring(0, 2).toUpperCase();

  /**
   * Conversion du rôle en texte français lisible
   */
  const roleText = role === 'student' ? 'Étudiant en médecine' : 'Professionnel de santé';

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link 
            to="/profile" 
            className="w-14 h-14 bg-medical-blue text-white rounded-full mt-6 mb-6 flex items-center justify-center hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer relative overflow-hidden group z-30"
            aria-label={`Profil utilisateur de ${displayName}`}
          >
            <span className="font-semibold text-lg relative z-10">
              {userInitials}
            </span>
            
            {/* Effet de brillance au survol pour interactivité */}
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            
            {/* Indicateur de statut en ligne avec animation de pulsation */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          </Link>
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          className="bg-gray-800 text-white border-gray-700 ml-2"
        >
          <div className="font-medium">{displayName}</div>
          <div className="text-xs text-gray-300 capitalize">
            {roleText}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
