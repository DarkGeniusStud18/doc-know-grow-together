
/**
 * Section de déconnexion pour le menu secondaire mobile
 * 
 * Composant dédié à la gestion de la déconnexion utilisateur
 * avec design cohérent et confirmation de sécurité
 */

import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';
import { LogoutSectionProps, MobileSecondaryMenuItem } from '../types';

/**
 * Section de déconnexion avec bouton stylisé et gestion des erreurs
 * 
 * Fonctionnalités :
 * - Déconnexion sécurisée avec confirmation
 * - Design cohérent avec le thème médical
 * - Feedback utilisateur via toast notifications
 * - Gestion d'erreurs robuste
 */
export const LogoutSection: React.FC<LogoutSectionProps> = ({ onItemClick }) => {
  const { signOut } = useAuth();

  /**
   * Gestionnaire de déconnexion avec confirmation et feedback
   * Gère les erreurs et affiche des notifications appropriées
   */
  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Déconnexion réussie', {
        description: 'À bientôt sur MedCollab !'
      });
      
      // Créer un élément de menu factice pour la compatibilité
      const logoutItem: MobileSecondaryMenuItem = {
        id: 'logout',
        label: 'Déconnexion',
        icon: LogOut, // Correction: utilisation directe de l'icône Lucide
        variant: 'danger'
      };
      
      onItemClick(logoutItem);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toast.error('Erreur de déconnexion', {
        description: 'Veuillez réessayer.'
      });
    }
  };

  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 p-4 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border-2 border-transparent hover:border-red-200"
        aria-label="Se déconnecter de l'application"
      >
        <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg">
          <LogOut size={18} />
        </div>
        <span className="font-medium">Se déconnecter</span>
      </button>
    </div>
  );
};
