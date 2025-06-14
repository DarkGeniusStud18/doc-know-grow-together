
/**
 * Composant logo pour la Navbar
 * 
 * Logo interactif avec navigation adaptative selon l'état d'authentification
 */

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Interface pour les propriétés du composant NavbarLogo
 */
interface NavbarLogoProps {
  isAuthenticated: boolean;
}

/**
 * Composant logo avec navigation intelligente et design moderne
 * 
 * Fonctionnalités :
 * - Navigation adaptée selon l'état d'authentification
 * - Design moderne avec gradient et effets visuels
 * - Responsive avec masquage du texte sur petits écrans
 * - Effets de survol et transitions fluides
 */
export const NavbarLogo: React.FC<NavbarLogoProps> = ({ isAuthenticated }) => {
  return (
    <Link 
      to={isAuthenticated ? '/dashboard' : '/'}
      className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
    >
      {/* Logo avec gradient et design moderne */}
      <div className="w-10 h-10 bg-gradient-to-br from-medical-blue to-medical-teal rounded-xl flex items-center justify-center shadow-lg">
        <span className="text-white font-bold text-lg">M</span>
      </div>
      
      {/* Informations de branding masquées sur petits écrans */}
      <div className="hidden sm:block">
        <span className="text-xl font-bold text-medical-navy">MedCollab</span>
        <p className="text-xs text-gray-600 -mt-1">Plateforme d'apprentissage médical</p>
      </div>
    </Link>
  );
};
