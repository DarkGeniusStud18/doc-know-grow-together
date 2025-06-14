
/**
 * Composant menu mobile pour la Navbar
 * 
 * Menu déployable pour les utilisateurs non connectés sur mobile
 */

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';

/**
 * Interface pour les propriétés du composant NavbarMobileMenu
 */
interface NavbarMobileMenuProps {
  user: any;
  loading: boolean;
}

/**
 * Composant menu mobile avec boutons d'authentification
 * 
 * Fonctionnalités :
 * - Affichage conditionnel selon l'état d'authentification
 * - Boutons pleine largeur optimisés pour mobile
 * - Design cohérent avec le reste de l'interface
 */
export const NavbarMobileMenu: React.FC<NavbarMobileMenuProps> = ({ 
  user, 
  loading 
}) => {
  const navigate = useNavigate();

  /**
   * Gestionnaire optimisé de navigation
   */
  const handleNavigation = useCallback((href: string) => {
    console.log('Navbar: Navigation mobile vers:', href);
    navigate(href);
  }, [navigate]);

  // Affichage seulement pour utilisateurs non connectés
  if (user || loading) {
    return null;
  }

  return (
    <div className="sm:hidden border-t border-gray-100 bg-gray-50">
      <div className="px-4 py-3 space-y-2">
        <Button
          onClick={() => handleNavigation('/login')}
          variant="ghost"
          className="w-full justify-start text-medical-navy hover:bg-medical-light"
        >
          <LogIn size={18} className="mr-2" />
          Connexion à votre compte
        </Button>
        <Button
          onClick={() => handleNavigation('/register')}
          className="w-full justify-start bg-medical-blue hover:bg-medical-navy"
        >
          <UserPlus size={18} className="mr-2" />
          Créer un compte
        </Button>
      </div>
    </div>
  );
};
