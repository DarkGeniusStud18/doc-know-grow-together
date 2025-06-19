/**
 * En-tête utilisateur pour le menu secondaire mobile
 * 
 * Affiche les informations de l'utilisateur connecté avec photo de profil,
 * nom d'affichage et statut de vérification KYC
 */

import React from 'react';
import { X, User, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { UserHeaderProps } from '../types';

/**
 * En-tête utilisateur avec informations contextuelles et bouton de fermeture
 * 
 * Fonctionnalités :
 * - Affichage de la photo de profil ou avatar par défaut
 * - Nom d'affichage et email de l'utilisateur
 * - Indicateur de statut KYC avec couleurs appropriées
 * - Bouton de fermeture du menu
 * - Design responsive et accessible
 */
export const UserHeader: React.FC<UserHeaderProps> = ({ onClose }) => {
  const { user } = useAuth();

  // Fonction pour obtenir les initiales de l'utilisateur
  const getUserInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Fonction pour obtenir l'indicateur de statut KYC
  const getKycStatusIndicator = () => {
    if (!user?.kycStatus) return null;

    switch (user.kycStatus) {
      case 'verified':
        return (
          <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
            <CheckCircle size={12} />
            <span>Vérifié</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
            <Clock size={12} />
            <span>En cours</span>
          </div>
        );
      case 'not_submitted':
        return (
          <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
            <AlertCircle size={12} />
            <span>À vérifier</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Fonction pour obtenir le texte de rôle en français
  const getRoleText = (role: string): string => {
    switch (role) {
      case 'student':
        return 'Étudiant en médecine';
      case 'professional':
        return 'Professionnel de santé';
      default:
        return 'Utilisateur';
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center animate-pulse">
            <User size={20} className="text-gray-400" />
          </div>
          <div className="space-y-1">
            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-16 h-3 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
            aria-label="Fermer le menu"
          >
            <X size={18} />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-medical-blue/5 to-medical-teal/5">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Photo de profil ou avatar avec initiales */}
        <div className="relative flex-shrink-0">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={`Photo de profil de ${user.displayName}`}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
              {user.displayName ? getUserInitials(user.displayName) : <User size={20} />}
            </div>
          )}
          
          {/* Indicateur de connexion */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        </div>

        {/* Informations utilisateur */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 truncate">
              {user.displayName || 'Utilisateur'}
            </h3>
            {getKycStatusIndicator()}
          </div>
          
          <p className="text-xs text-gray-500 truncate">
            {user.email}
          </p>
          
          <p className="text-xs text-medical-blue font-medium">
            {getRoleText(user.role)}
          </p>
        </div>
      </div>

      {/* Bouton de fermeture */}
      {onClose && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="rounded-full p-2 hover:bg-gray-100 flex-shrink-0 ml-2"
          aria-label="Fermer le menu"
        >
          <X size={18} />
        </Button>
      )}
    </div>
  );
};
