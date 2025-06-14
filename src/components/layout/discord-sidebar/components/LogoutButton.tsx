
/**
 * Composant bouton de déconnexion pour DiscordSidebar
 * 
 * Bouton de déconnexion sécurisé avec animations spéciales
 * et gestion robuste des erreurs de déconnexion
 */

import React, { useCallback } from 'react';
import { LogOut } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * Interface pour les propriétés du composant LogoutButton
 */
interface LogoutButtonProps {
  onLogout: () => Promise<void>;
}

/**
 * Bouton de déconnexion fixe en bas avec animations spéciales
 * 
 * Fonctionnalités :
 * - Gestion sécurisée de la déconnexion
 * - Animations d'avertissement et de feedback
 * - Effets visuels distinctifs (rouge, rotation)
 * - Tooltip informatif avec délai optimisé
 * - Design accessible et intuitif
 */
export const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  /**
   * Gestionnaire optimisé pour la déconnexion avec gestion d'erreur robuste
   * Prévention des erreurs et logging détaillé pour le débogage
   */
  const handleLogout = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('DiscordSidebar: Tentative de déconnexion utilisateur');
    
    try {
      await onLogout();
      console.log('DiscordSidebar: Déconnexion réussie avec succès');
    } catch (error) {
      console.error('DiscordSidebar: Erreur lors de la déconnexion:', error);
    }
  }, [onLogout]);

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            onClick={handleLogout}
            className="w-12 h-12 flex items-center justify-center rounded-full mb-6 mt-auto transition-all duration-300 bg-gray-200 text-red-500 hover:bg-red-500 hover:text-white hover:rounded-2xl hover:scale-105 hover:shadow-lg group relative overflow-hidden z-30"
            aria-label="Se déconnecter de l'application MedCollab"
          >
            <LogOut 
              size={24} 
              className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 relative z-10" 
            />
            
            {/* Effet de fond au survol avec gradient rouge */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
            
            {/* Effet de pulsation d'avertissement pour la déconnexion */}
            <div className="absolute inset-0 bg-red-400 opacity-0 group-hover:opacity-20 animate-ping rounded-full"></div>
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          className="bg-gray-800 text-white border-gray-700 ml-2"
        >
          Se déconnecter de MedCollab en toute sécurité
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
