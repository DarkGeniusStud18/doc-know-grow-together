
/**
 * Barre supérieure mobile optimisée pour MedCollab
 * 
 * Composant de navigation supérieure spécialement conçu pour les appareils mobiles.
 * Fournit un accès rapide aux fonctionnalités principales tout en maintenant
 * une interface claire et responsive.
 * 
 * Fonctionnalités principales :
 * - Logo et branding MedCollab
 * - Indicateur de connexion utilisateur
 * - Boutons d'actions rapides (notifications, profil)
 * - Design adaptatif selon la taille d'écran
 * - Animations fluides et accessibilité optimisée
 */

import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

/**
 * Composant principal de la barre supérieure mobile
 * Optimisé pour les écrans tactiles et la navigation rapide
 */
const MobileTopBar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  /**
   * Génération optimisée des initiales utilisateur
   * Utilise useMemo pour éviter le recalcul à chaque rendu
   */
  const userInitials = useMemo(() => {
    if (!user?.displayName) return 'U';
    return user.displayName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [user?.displayName]);

  /**
   * Détermination intelligente du titre de page
   * Affiche un titre contextuel basé sur la route actuelle
   */
  const pageTitle = useMemo(() => {
    const path = location.pathname;
    
    // Mapping des routes vers des titres français
    const titleMap: Record<string, string> = {
      '/': 'Accueil',
      '/dashboard': 'Tableau de bord',
      '/courses': 'Cours',
      '/resources': 'Ressources',
      '/community': 'Communauté',
      '/clinical-cases': 'Cas cliniques',
      '/tools': 'Outils',
      '/study-groups': 'Groupes d\'étude',
      '/calendar': 'Calendrier',
      '/profile': 'Mon profil',
      '/settings': 'Paramètres',
      '/subscription': 'Abonnement'
    };

    return titleMap[path] || 'MedCollab';
  }, [location.pathname]);

  /**
   * Indicateur de statut premium utilisateur
   * Affiche visuellement le niveau d'abonnement
   */
  const isPremiumUser = useMemo(() => {
    return user?.subscriptionStatus === 'premium' || user?.subscriptionStatus === 'trial';
  }, [user?.subscriptionStatus]);

  // Masquage pour les utilisateurs non connectés
  if (!user) {
    return null;
  }

  return (
    <>
      {/* Barre de navigation fixe avec zone de sécurité iOS */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 safe-area-inset-top">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          
          {/* Section gauche : Logo et titre de page */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Link 
              to="/" 
              className="flex-shrink-0 transition-transform duration-200 hover:scale-105 active:scale-95"
              aria-label="Retour à l'accueil MedCollab"
            >
              {/* Logo MedCollab optimisé pour mobile */}
              <div className="w-8 h-8 bg-gradient-to-br from-medical-blue to-medical-teal rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">M</span>
              </div>
            </Link>
            
            {/* Titre de page responsive */}
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-semibold text-gray-900 truncate">
                {pageTitle}
              </h1>
              
              {/* Indicateur de statut utilisateur */}
              {isPremiumUser && (
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300"
                >
                  Premium
                </Badge>
              )}
            </div>
          </div>

          {/* Section droite : Actions utilisateur */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            
            {/* Bouton notifications avec badge de compteur */}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "relative p-2 rounded-full transition-all duration-200",
                "hover:bg-gray-100 active:scale-95",
                "focus-visible:ring-2 focus-visible:ring-medical-blue focus-visible:ring-offset-2"
              )}
              asChild
            >
              <Link to="/notifications" aria-label="Voir les notifications">
                <Bell size={20} className="text-gray-700" />
                
                {/* Badge de notification (exemple statique - à connecter avec le système de notifications) */}
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
              </Link>
            </Button>

            {/* Bouton paramètres rapides */}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "p-2 rounded-full transition-all duration-200",
                "hover:bg-gray-100 active:scale-95",
                "focus-visible:ring-2 focus-visible:ring-medical-blue focus-visible:ring-offset-2"
              )}
              asChild
            >
              <Link to="/settings" aria-label="Ouvrir les paramètres">
                <Settings size={20} className="text-gray-700" />
              </Link>
            </Button>

            {/* Avatar utilisateur avec lien vers le profil */}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "p-1 rounded-full transition-all duration-200",
                "hover:bg-gray-100 active:scale-95",
                "focus-visible:ring-2 focus-visible:ring-medical-blue focus-visible:ring-offset-2"
              )}
              asChild
            >
              <Link to="/profile" aria-label="Voir mon profil">
                <Avatar className="h-8 w-8 border-2 border-transparent hover:border-medical-blue transition-colors">
                  <AvatarImage 
                    src={user.profileImage || undefined} 
                    alt={`Photo de profil de ${user.displayName}`}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-medical-blue to-medical-teal text-white text-sm font-medium">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </Button>
          </div>
        </div>

        {/* Indicateur de rôle utilisateur (subtil) */}
        {user.role === 'professional' && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-green-400 to-green-600" />
        )}
        {user.role === 'student' && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600" />
        )}
      </div>

      {/* Espaceur pour compenser la hauteur de la barre fixe */}
      <div className="md:hidden h-16 safe-area-inset-top" />
    </>
  );
};

export default MobileTopBar;
