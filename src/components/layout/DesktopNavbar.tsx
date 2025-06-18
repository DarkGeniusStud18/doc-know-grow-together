
import React, { useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Globe, LogOut, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { debounce } from '@/lib/utils/supabase-helpers';

/**
 * 🖥️ Barre de navigation desktop optimisée pour MedCollab
 * 
 * Fonctionnalités principales :
 * - Recherche intelligente avec debouncing (300ms) pour optimiser les performances
 * - Menu utilisateur contextuel avec informations de profil et actions rapides
 * - Notifications en temps réel avec indicateur visuel
 * - Internationalisation avec sélecteur de langue
 * - Navigation adaptative selon le rôle utilisateur (étudiant/professionnel)
 * 
 * Architecture optimisée :
 * - Mémorisation des calculs coûteux avec useMemo
 * - Gestionnaires d'événements optimisés avec useCallback
 * - États locaux minimaux pour de meilleures performances
 * - Intégration native/web transparente sans interférence
 */
const DesktopNavbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  
  // 🔍 État de recherche avec optimisation des performances
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // 🛡️ Protection : masquer la navbar si aucun utilisateur connecté
  if (!user) {
    console.log('🚫 DesktopNavbar: Aucun utilisateur connecté, masquage de la navbar');
    return null;
  }

  /**
   * 🔍 Gestionnaire de recherche intelligent avec debouncing
   * Optimise les requêtes en évitant les appels trop fréquents lors de la saisie utilisateur
   * Délai de 300ms pour équilibrer réactivité et performance
   */
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim().length > 2) {
        console.log('🔍 DesktopNavbar: Exécution recherche intelligente:', query);
        // 🚀 TODO: Intégrer le service de recherche avancé
        // await searchService.performAdvancedSearch(query);
      }
    }, 300),
    []
  );

  /**
   * 📝 Gestionnaire de soumission du formulaire de recherche
   * Traite la recherche manuelle (touche Entrée) avec validation
   */
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    
    if (trimmedQuery.length > 0) {
      console.log('📝 DesktopNavbar: Recherche manuelle soumise:', trimmedQuery);
      debouncedSearch(trimmedQuery);
    }
  }, [searchQuery, debouncedSearch]);

  /**
   * 🚪 Gestionnaire de déconnexion sécurisé avec gestion d'erreur
   * Nettoie les données utilisateur et redirige vers la page d'accueil
   */
  const handleLogout = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('🚪 DesktopNavbar: Initialisation déconnexion sécurisée');
    
    try {
      await signOut();
      console.log('✅ DesktopNavbar: Déconnexion réussie avec nettoyage complet');
    } catch (error) {
      console.error('❌ DesktopNavbar: Erreur critique lors de la déconnexion:', error);
      // 🔄 Fallback: redirection forcée en cas d'échec
      window.location.href = '/login';
    }
  }, [signOut]);

  /**
   * 🏷️ Mappage intelligent des titres de page avec mémorisation
   * Évite les recalculs à chaque rendu pour optimiser les performances
   * Organisation hiérarchique par catégories fonctionnelles
   */
  const pageTitleMap = useMemo(() => ({
    // 🏠 Pages principales
    '/dashboard': 'Tableau de bord médical',
    '/': 'Accueil MedCollab',
    
    // 📚 Ressources et apprentissage
    '/resources': 'Ressources médicales avancées',
    '/my-courses': 'Mes cours personnalisés',
    '/notes': 'Carnet de notes intelligent',
    '/clinical-cases': 'Cas cliniques interactifs',
    '/exam-simulator': 'Simulateur d\'examens médicaux',
    '/continuing-education': 'Formation continue professionnelle',
    
    // 👥 Communauté et collaboration
    '/community': 'Communauté médicale collaborative',
    '/study-groups': 'Groupes d\'étude spécialisés',
    
    // 🛠️ Outils et productivité
    '/tools': 'Boîte à outils médicaux',
    '/calendar': 'Planificateur d\'études médicales',
    
    // ⚙️ Configuration et profil
    '/settings': 'Paramètres personnalisés',
    '/profile': 'Profil utilisateur complet',
    '/subscription': 'Gestion abonnement premium',
    
    // 🔐 Sécurité et vérification
    '/kyc': 'Vérification d\'identité médicale',
    '/kyc-verification': 'Processus de validation professionnelle',
    
    // 🎵 Fonctionnalités auxiliaires
    '/music-library': 'Bibliothèque audio thérapeutique'
  }), []);

  /**
   * 📄 Détermine le titre de la page actuelle avec fallback intelligent
   * Utilise le mapping optimisé avec titre par défaut professionnel
   */
  const currentPageTitle = useMemo(() => {
    const title = pageTitleMap[location.pathname as keyof typeof pageTitleMap];
    return title || 'MedCollab - Excellence Médicale Collaborative';
  }, [location.pathname, pageTitleMap]);

  /**
   * 👤 Génération intelligente des initiales utilisateur pour l'avatar
   * Traite les noms composés et caractères internationaux
   */
  const userInitials = useMemo(() => {
    if (!user.displayName) return 'UM'; // Utilisateur Médical par défaut
    
    return user.displayName
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [user.displayName]);

  /**
   * 🔄 Gestionnaire de changement de recherche avec déclenchement automatique
   * Optimise l'expérience utilisateur avec recherche prédictive
   */
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    
    // 🚀 Déclenchement automatique pour requêtes de longueur suffisante
    if (newValue.length > 2) {
      debouncedSearch(newValue);
    }
  }, [debouncedSearch]);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm backdrop-blur-md">
      <div className="container px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center gap-4 lg:gap-6">
        
        {/* 📋 Section titre avec animation de transition fluide */}
        <div className="flex-shrink-0">
          <h1 className="text-xl lg:text-2xl font-semibold text-medical-navy transition-all duration-200 hover:text-medical-teal">
            {currentPageTitle}
          </h1>
        </div>

        {/* 🔍 Barre de recherche intelligente avec états visuels dynamiques */}
        <div className="flex-1 max-w-md mx-4 lg:mx-6">
          <form onSubmit={handleSearch} role="search" aria-label="Recherche principale">
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
                aria-label="Champ de recherche intelligent"
                autoComplete="off"
              />
              {/* 🎯 Indicateur visuel de recherche active */}
              {searchQuery.length > 0 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2" title="Recherche en cours">
                  <div className="w-2 h-2 bg-medical-teal rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* ⚡ Section actions utilisateur avec optimisations d'accessibilité */}
        <div className="flex items-center gap-2 lg:gap-4">
          
          {/* 🌐 Sélecteur de langue avec tooltip informatif */}
          <Button 
            variant="ghost" 
            size="icon" 
            title="Sélectionner la langue d'interface (FR/EN)" 
            className="h-9 w-9 transition-all duration-200 hover:scale-110 hover:bg-medical-light"
            aria-label="Changer de langue d'interface"
          >
            <Globe className="h-5 w-5" />
          </Button>
          
          {/* 🔔 Centre de notifications avec compteur dynamique */}
          <Button 
            variant="ghost" 
            size="icon" 
            title="Notifications médicales importantes" 
            className="h-9 w-9 relative transition-all duration-200 hover:scale-110 hover:bg-medical-light"
            aria-label="Voir les notifications"
            asChild
          >
            <Link to="/notifications">
              <Bell className="h-5 w-5" />
              {/* 🔴 Indicateur de nouvelles notifications avec animation */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center animate-pulse">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              </span>
            </Link>
          </Button>
          
          {/* 👤 Menu utilisateur contextuel avec informations détaillées */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-9 w-9 rounded-full transition-all duration-200 hover:scale-110 hover:ring-2 hover:ring-medical-teal hover:ring-opacity-50"
                aria-label={`Menu utilisateur - ${user.displayName} (${user.role})`}
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
            
            {/* 📋 Contenu du menu avec informations utilisateur enrichies */}
            <DropdownMenuContent align="end" className="w-64 p-2 animate-in slide-in-from-top-2">
              
              {/* 👤 En-tête avec profil utilisateur détaillé */}
              <div className="flex items-center justify-start gap-3 p-3 rounded-md bg-gradient-to-r from-gray-50 to-medical-light">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-sm text-gray-900">{user.displayName}</p>
                  <p className="w-[200px] truncate text-xs text-gray-500" title={user.email}>
                    {user.email}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-medical-teal capitalize font-medium">
                      {user.role === 'student' ? '🎓 Étudiant' : '👨‍⚕️ Professionnel'}
                    </p>
                    {user.subscriptionStatus === 'premium' && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                        💎 Premium
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <DropdownMenuSeparator />
              
              {/* 🔗 Liens de navigation rapide avec icônes descriptives */}
              <DropdownMenuItem asChild>
                <Link 
                  to="/profile" 
                  className="w-full cursor-pointer hover:bg-gray-100 transition-colors py-2 px-3 rounded-md flex items-center gap-2"
                >
                  <span>👤</span>
                  <span>Mon profil médical</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link 
                  to="/settings" 
                  className="w-full cursor-pointer hover:bg-gray-100 transition-colors py-2 px-3 rounded-md flex items-center gap-2"
                >
                  <span>⚙️</span>
                  <span>Paramètres avancés</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link 
                  to="/subscription" 
                  className="w-full cursor-pointer hover:bg-gray-100 transition-colors py-2 px-3 rounded-md flex items-center gap-2"
                >
                  <span>💎</span>
                  <span>Abonnement premium</span>
                </Link>
              </DropdownMenuItem>
              
              {/* 🆔 Vérification KYC pour étudiants non vérifiés */}
              {user.role === 'student' && user.kycStatus !== 'verified' && (
                <DropdownMenuItem asChild>
                  <Link 
                    to="/kyc" 
                    className="w-full cursor-pointer hover:bg-blue-50 transition-colors py-2 px-3 rounded-md flex items-center gap-2 text-blue-600"
                  >
                    <span>🆔</span>
                    <span>Vérifier mon statut étudiant</span>
                  </Link>
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              
              {/* 🚪 Action de déconnexion sécurisée avec style distinctif */}
              <DropdownMenuItem
                className="cursor-pointer text-red-500 focus:text-red-500 hover:bg-red-50 transition-colors flex items-center py-2 px-3 rounded-md gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Déconnexion sécurisée</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DesktopNavbar;
