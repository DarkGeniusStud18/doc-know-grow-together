
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Bell, Globe, Search, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavbarProps {
  simplified?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ simplified = false }) => {
  const { user, logout } = useAuth();

  // Handler for logout button
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout('/dashboard');
  };

  // Public navbar (not logged in or simplified mode)
  if (simplified) {
    return (
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-medical-blue text-white flex items-center justify-center font-bold text-lg">M</div>
            <span className="text-xl sm:text-2xl font-bold text-medical-navy">MedCollab</span>
          </Link>

          {!user && (
            <div className="flex items-center gap-3 sm:gap-4">
              <Link to="/login">
                <Button variant="outline" className="px-4 py-2 sm:px-6 sm:py-2.5">Connexion</Button>
              </Link>
              <Link to="/register">
                <Button className="px-4 py-2 sm:px-6 sm:py-2.5">S'inscrire</Button>
              </Link>
            </div>
          )}
        </div>
      </header>
    );
  }

  // Full navbar for authenticated users
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center gap-4">
        <div className="lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-medical-blue text-white flex items-center justify-center font-bold">M</div>
          </Link>
        </div>

        {/* Barre de recherche */}
        <div className="hidden md:flex items-center max-w-md w-full relative">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="Rechercher..."
            className="pl-10 py-2.5 pr-4 rounded-lg border border-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-medical-teal focus:border-transparent transition-all"
          />
        </div>

        {/* Icône de recherche mobile */}
        <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
          <Search className="h-5 w-5" />
        </Button>

        {/* Côté droit - menu utilisateur & notifications */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="icon" title="Traduction" className="h-9 w-9">
            <Globe className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" title="Notifications" className="h-9 w-9">
            <Bell className="h-5 w-5" />
          </Button>
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/placeholder.svg" alt={user.displayName} />
                    <AvatarFallback className="bg-medical-teal text-white">
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
                  <Link to="/profile" className="w-full cursor-pointer py-2 px-3 rounded-md">
                    Mon profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="w-full cursor-pointer py-2 px-3 rounded-md">
                    Paramètres
                  </Link>
                </DropdownMenuItem>
                {user.role === 'student' && user.kycStatus !== 'verified' && (
                  <DropdownMenuItem asChild>
                    <Link to="/kyc" className="w-full cursor-pointer py-2 px-3 rounded-md">
                      Vérifier mon identité
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-500 focus:text-red-500 py-2 px-3 rounded-md"
                  onClick={handleLogout}
                >
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
