
/**
 * Composant actions utilisateur pour la Navbar
 * 
 * Gestion des actions utilisateur selon l'état d'authentification
 */

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LogIn,
  UserPlus,
  User,
  Menu,
  Loader2
} from 'lucide-react';

/**
 * Interface pour les propriétés du composant NavbarUserActions
 */
interface NavbarUserActionsProps {
  user: any;
  loading: boolean;
}

/**
 * Composant des actions utilisateur avec états multiples
 * 
 * Fonctionnalités :
 * - Interface pour utilisateurs connectés et non connectés
 * - Gestion des états de chargement
 * - Menu mobile adaptatif
 * - Boutons d'action optimisés
 */
export const NavbarUserActions: React.FC<NavbarUserActionsProps> = ({ 
  user, 
  loading 
}) => {
  const navigate = useNavigate();

  /**
   * Gestionnaire optimisé de navigation
   */
  const handleNavigation = useCallback((href: string) => {
    console.log('Navbar: Navigation vers:', href);
    navigate(href);
  }, [navigate]);

  return (
    <div className="flex items-center space-x-3">
      {!loading && (
        <>
          {!user ? (
            // Interface pour les utilisateurs non connectés
            <div className="hidden sm:flex items-center space-x-2">
              <Button
                onClick={() => handleNavigation('/login')}
                variant="ghost"
                className="flex items-center space-x-2 text-medical-navy hover:bg-medical-light transition-colors"
              >
                <LogIn size={18} />
                <span>Connexion</span>
              </Button>
              <Button
                onClick={() => handleNavigation('/register')}
                className="flex items-center space-x-2 bg-medical-blue hover:bg-medical-navy transition-colors"
              >
                <UserPlus size={18} />
                <span>Inscription</span>
              </Button>
            </div>
          ) : (
            // Indicateur pour les utilisateurs connectés (desktop)
            <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-medical-light rounded-lg">
              <User size={18} className="text-medical-blue" />
              <span className="text-sm font-medium text-medical-navy truncate max-w-32">
                {user.displayName}
              </span>
            </div>
          )}

          {/* Menu hamburger mobile pour utilisateurs non connectés */}
          {!user && (
            <div className="sm:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                aria-label="Menu de navigation mobile"
              >
                <Menu size={20} className="text-medical-navy" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Indicateur de chargement durant l'authentification */}
      {loading && (
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 text-medical-blue animate-spin" />
          <span className="text-sm text-gray-600 hidden sm:inline">Chargement...</span>
        </div>
      )}
    </div>
  );
};
