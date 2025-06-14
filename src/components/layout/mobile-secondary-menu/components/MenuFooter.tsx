
/**
 * Composant Footer pour le menu secondaire mobile
 * 
 * Affiche les informations de version et les liens utiles
 * Design cohérent avec le thème médical de l'application
 */

import React from 'react';
import { Heart, Info } from 'lucide-react';

/**
 * Footer du menu mobile avec informations de version
 * 
 * Fonctionnalités :
 * - Affichage de la version de l'application
 * - Message de copyright avec design attrayant
 * - Liens vers les informations importantes
 * - Style cohérent avec le design médical
 */
export const MenuFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="p-4 space-y-3">
      {/* Informations de version avec icône */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <Info size={14} />
        <span>MedCollab v1.0.0</span>
      </div>
      
      {/* Message de copyright avec cœur animé */}
      <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
        <span>Fait avec</span>
        <Heart 
          size={12} 
          className="text-red-500 animate-pulse fill-current" 
        />
        <span>pour les professionnels de santé</span>
      </div>
      
      {/* Copyright */}
      <div className="text-center text-xs text-gray-400">
        © {currentYear} MedCollab. Tous droits réservés.
      </div>
      
      {/* Ligne décorative */}
      <div className="w-16 h-0.5 bg-gradient-to-r from-medical-teal to-medical-blue mx-auto rounded-full opacity-50"></div>
    </div>
  );
};
