
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Globe, LogOut, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const DesktopNavbar: React.FC = () => {
  const { user, logout } = useAuth();
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
    await logout('/');
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
      <div className="container px-6 py-3 flex justify-between items-center">
        {/* Page title */}
        <div>
          <h1 className="text-xl font-semibold text-medical-navy">
            {getPageTitle()}
          </h1>
        </div>

        {/* Search bar */}
        <div className="flex-1 max-w-md mx-6">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Rechercher des cours, ressources, groupes d'étude..."
                className="pl-9 py-2 pr-4 rounded-md border border-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-medical-teal focus:border-transparent transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>

        {/* Right side - user menu & notifications */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" title="Traduction" className="transition-transform hover:scale-110">
            <Globe className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" title="Notifications" className="transition-transform hover:scale-110">
            <Bell className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full transition-transform hover:scale-110">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.profileImage || "/placeholder.svg"} alt={user.displayName} />
                  <AvatarFallback className="bg-medical-teal text-white">
                    {user.displayName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user.displayName}</p>
                  <p className="w-[200px] truncate text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="w-full cursor-pointer hover:bg-gray-100 transition-colors">
                  Mon profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="w-full cursor-pointer hover:bg-gray-100 transition-colors">
                  Paramètres
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/subscription" className="w-full cursor-pointer hover:bg-gray-100 transition-colors">
                  Abonnement
                </Link>
              </DropdownMenuItem>
              {user.role === 'student' && user.kycStatus !== 'verified' && (
                <DropdownMenuItem asChild>
                  <Link to="/kyc" className="w-full cursor-pointer hover:bg-gray-100 transition-colors">
                    Vérifier mon identité
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-500 focus:text-red-500 hover:bg-red-50 transition-colors flex items-center"
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
