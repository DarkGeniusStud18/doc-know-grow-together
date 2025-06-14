
import React, { useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Globe, LogOut, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { debounce } from '@/lib/utils/supabase-helpers';

/**
 * Composant de barre de navigation pour desktop optimisé
 * Fournit une interface de navigation riche avec recherche, notifications et menu utilisateur
 * Optimisé pour les performances avec mémorisation et debouncing
 */
const DesktopNavbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  
  // État local pour la recherche avec optimisation
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Si aucun utilisateur connecté, ne pas afficher la navbar
  if (!user) {
    console.log('DesktopNavbar: Aucun utilisateur connecté, masquage de la navbar');
    return null;
  }

  /**
   * Gestionnaire de recherche avec debouncing optimisé
   * Évite les requêtes trop fréquentes lors de la saisie
   */
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim()) {
        console.log('DesktopNavbar: Exécution de la recherche pour:', query);
        // TODO: Implémenter la logique de recherche réelle
        // searchService.performSearch(query);
      }
    }, 300),
    []
  );

  /**
   * Gestionnaire d'événement de soumission de recherche
   * @param e - Événement de formulaire
   */
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    
    if (trimmedQuery) {
      console.log('DesktopNavbar: Recherche soumise:', trimmedQuery);
      debouncedSearch(trimmedQuery);
    }
  }, [searchQuery, debouncedSearch]);

  /**
   * Gestionnaire optimisé pour la déconnexion
   * Gère la redirection et le nettoyage des données
   */
  const handleLogout = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('DesktopNavbar: Tentative de déconnexion');
    
    try {
      await signOut();
      console.log('DesktopNavbar: Déconnexion réussie');
    } catch (error) {
      console.error('DesktopNavbar: Erreur lors de la déconnexion:', error);
    }
  }, [signOut]);

  /**
   * Mapping optimisé des titres de page avec mémorisation
   * Évite les recalculs à chaque rendu
   */
  const pageTitleMap = useMemo(() => ({
    '/dashboard': 'Tableau de bord',
    '/resources': 'Ressources médicales',
    '/community': 'Communauté médicale',
    '/calendar': 'Calendrier des études',
    '/my-courses': 'Mes cours',
    '/notes': 'Mes notes d\'étude',
    '/study-groups': 'Groupes d\'étude',
    '/tools': 'Outils de productivité',
    '/exam-simulator': 'Simulateur d\'examen',
    '/clinical-cases': 'Cas cliniques',
    '/continuing-education': 'Formation continue',
    '/settings': 'Paramètres de l\'application',
    '/profile': 'Mon profil utilisateur',
    '/music-library': 'Bibliothèque musicale',
    '/subscription': 'Gestion de l\'abonnement',
    '/kyc': 'Vérification d\'identité',
    '/kyc-verification': 'Processus de vérification'
  }), []);

  /**
   * Détermine le titre de page actuel avec fallback
   */
  const currentPageTitle = useMemo(() => {
    const title = pageTitleMap[location.pathname as keyof typeof pageTitleMap];
    return title || 'MedCollab - Plateforme médicale';
  }, [location.pathname, pageTitleMap]);

  /**
   * Génère les initiales de l'utilisateur pour l'avatar
   */
  const userInitials = useMemo(() => {
    return user.displayName.substring(0, 2).toUpperCase();
  }, [user.displayName]);

  /**
   * Gestionnaire de changement de recherche avec debouncing
   */
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    
    // Déclencher la recherche automatique après un délai
    if (newValue.length > 2) {
      debouncedSearch(newValue);
    }
  }, [debouncedSearch]);

  return (
    <header className="hidden md:block sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="container px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center gap-4 lg:gap-6">
        {/* Section titre de page avec animation */}
        <div className="flex-shrink-0">
          <h1 className="text-xl lg:text-2xl font-semibold text-medical-navy transition-all duration-200 hover:text-medical-teal">
            {currentPageTitle}
          </h1>
        </div>

        {/* Barre de recherche optimisée avec états visuels */}
        <div className="flex-1 max-w-md mx-4 lg:mx-6">
          <form onSubmit={handleSearch}>
            <div className={`relative transition-all duration-200 ${
              isSearchFocused 
                ? 'ring-2 ring-medical-teal ring-opacity-50 shadow-md' 
                : 'hover:shadow-sm'
            }`}>
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${
                isSearchFocused 
                  ? 'text-medical-teal' 
                  : 'text-gray-400'
              }`} />
              <input
                type="search"
                placeholder="Rechercher des cours, ressources, groupes d'étude..."
                className="pl-10 py-2.5 pr-4 rounded-lg border border-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-medical-teal focus:border-transparent transition-all text-sm bg-white"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                aria-label="Barre de recherche principale"
              />
              {/* Indicateur de recherche active */}
              {searchQuery.length > 0 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-2 h-2 bg-medical-teal rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Section droite - actions utilisateur optimisées */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Bouton de traduction avec tooltip */}
          <Button 
            variant="ghost" 
            size="icon" 
            title="Sélectionner la langue d'interface" 
            className="h-9 w-9 transition-all duration-200 hover:scale-110 hover:bg-medical-light"
            aria-label="Changer de langue"
          >
            <Globe className="h-5 w-5" />
          </Button>
          
          {/* Bouton de notifications avec indicateur */}
          <Button 
            variant="ghost" 
            size="icon" 
            title="Voir les notifications" 
            className="h-9 w-9 relative transition-all duration-200 hover:scale-110 hover:bg-medical-light"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {/* Indicateur de nouvelles notifications */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            </span>
          </Button>
          
          {/* Menu utilisateur avec avatar optimisé */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-9 w-9 rounded-full transition-all duration-200 hover:scale-110 hover:ring-2 hover:ring-medical-teal hover:ring-opacity-50"
                aria-label={`Menu utilisateur - ${user.displayName}`}
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage 
                    src={user.profileImage || "/placeholder.svg"} 
                    alt={`Photo de profil de ${user.displayName}`}
                  />
                  <AvatarFallback className="bg-medical-teal text-white text-sm font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            
            {/* Contenu du menu avec animations */}
            <DropdownMenuContent align="end" className="w-56 p-2 animate-in slide-in-from-top-2">
              {/* En-tête du menu avec informations utilisateur */}
              <div className="flex items-center justify-start gap-3 p-3 rounded-md bg-gray-50">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-sm text-gray-900">{user.displayName}</p>
                  <p className="w-[200px] truncate text-xs text-gray-500" title={user.email}>
                    {user.email}
                  </p>
                  <p className="text-xs text-medical-teal capitalize font-medium">
                    {user.role === 'student' ? 'Étudiant' : 'Professionnel'}
                  </p>
                </div>
              </div>
              
              <DropdownMenuSeparator />
              
              {/* Liens de navigation du menu */}
              <DropdownMenuItem asChild>
                <Link 
                  to="/profile" 
                  className="w-full cursor-pointer hover:bg-gray-100 transition-colors py-2 px-3 rounded-md flex items-center gap-2"
                >
                  <span>👤</span>
                  Mon profil utilisateur
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link 
                  to="/settings" 
                  className="w-full cursor-pointer hover:bg-gray-100 transition-colors py-2 px-3 rounded-md flex items-center gap-2"
                >
                  <span>⚙️</span>
                  Paramètres de l'application
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link 
                  to="/subscription" 
                  className="w-full cursor-pointer hover:bg-gray-100 transition-colors py-2 px-3 rounded-md flex items-center gap-2"
                >
                  <span>💎</span>
                  Gestion de l'abonnement
                </Link>
              </DropdownMenuItem>
              
              {/* Lien de vérification KYC pour les étudiants non vérifiés */}
              {user.role === 'student' && user.kycStatus !== 'verified' && (
                <DropdownMenuItem asChild>
                  <Link 
                    to="/kyc" 
                    className="w-full cursor-pointer hover:bg-blue-50 transition-colors py-2 px-3 rounded-md flex items-center gap-2 text-blue-600"
                  >
                    <span>🆔</span>
                    Vérifier mon identité
                  </Link>
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              
              {/* Bouton de déconnexion avec style distinctif */}
              <DropdownMenuItem
                className="cursor-pointer text-red-500 focus:text-red-500 hover:bg-red-50 transition-colors flex items-center py-2 px-3 rounded-md gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DesktopNavbar;
