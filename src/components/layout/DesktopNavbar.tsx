
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Globe, LogOut, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const DesktopNavbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  
  if (!user) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Recherche:", searchQuery);
    // Future search functionality implementation
  };

  // Handler to logout and redirect to home
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Desktop navbar logout clicked');
    await signOut();
  };

  // Page title mapping
  const getPageTitle = () => {
    const path = location.pathname;
    const titleMap: { [key: string]: string } = {
      '/dashboard': 'Accueil',
      '/resources': 'Ressources',
      '/community': 'Communauté',
      '/calendar': 'Calendrier',
      '/my-courses': 'Mes cours',
      '/notes': 'Mes notes',
      '/study-groups': 'Groupes d\'étude',
      '/tools': 'Outils de productivité',
      '/exam-simulator': 'Simulateur d\'examen',
      '/clinical-cases': 'Cas cliniques',
      '/continuing-education': 'Formation continue',
      '/settings': 'Paramètres',
      '/profile': 'Mon Profil',
      '/music-library': 'Bibliothèque Musicale',
      '/subscription': 'Abonnement',
      '/kyc': 'Vérification d\'identité',
      '/kyc-verification': 'Vérification d\'identité'
    };
    return titleMap[path] || 'MedCollab';
  };

  return (
    <header className="hidden md:block sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="container px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center gap-4 lg:gap-6">
        {/* Page title */}
        <div className="flex-shrink-0">
          <h1 className="text-xl lg:text-2xl font-semibold text-medical-navy">
            {getPageTitle()}
          </h1>
        </div>

        {/* Search bar */}
        <div className="flex-1 max-w-md mx-4 lg:mx-6">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Rechercher des cours, ressources, groupes d'étude..."
                className="pl-10 py-2.5 pr-4 rounded-lg border border-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-medical-teal focus:border-transparent transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>

        {/* Right side - user menu & notifications */}
        <div className="flex items-center gap-2 lg:gap-4">
          <Button variant="ghost" size="icon" title="Traduction" className="h-9 w-9 transition-transform hover:scale-110">
            <Globe className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" title="Notifications" className="h-9 w-9 transition-transform hover:scale-110">
            <Bell className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full transition-transform hover:scale-110">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.profileImage || "/placeholder.svg"} alt={user.displayName} />
                  <AvatarFallback className="bg-medical-teal text-white text-sm">
                    {user.displayName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2">
              <div className="flex items-center justify-start gap-3 p-3 rounded-md">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-sm">{user.displayName}</p>
                  <p className="w-[200px] truncate text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="w-full cursor-pointer hover:bg-gray-100 transition-colors py-2 px-3 rounded-md">
                  Mon profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="w-full cursor-pointer hover:bg-gray-100 transition-colors py-2 px-3 rounded-md">
                  Paramètres
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/subscription" className="w-full cursor-pointer hover:bg-gray-100 transition-colors py-2 px-3 rounded-md">
                  Abonnement
                </Link>
              </DropdownMenuItem>
              {user.role === 'student' && user.kycStatus !== 'verified' && (
                <DropdownMenuItem asChild>
                  <Link to="/kyc" className="w-full cursor-pointer hover:bg-gray-100 transition-colors py-2 px-3 rounded-md">
                    Vérifier mon identité
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-500 focus:text-red-500 hover:bg-red-50 transition-colors flex items-center py-2 px-3 rounded-md"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DesktopNavbar;
