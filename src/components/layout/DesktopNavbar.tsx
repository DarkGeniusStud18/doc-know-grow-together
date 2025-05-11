
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Globe, LogOut, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const DesktopNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  
  if (!user) return null;

  return (
    <header className="hidden md:block sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="container px-6 py-3 flex justify-between items-center">
        {/* Channel/Page title */}
        <div>
          <h1 className="text-xl font-semibold text-medical-navy">
            {window.location.pathname === '/dashboard' && 'Accueil'}
            {window.location.pathname === '/resources' && 'Ressources'}
            {window.location.pathname === '/community' && 'Communauté'}
            {window.location.pathname === '/calendar' && 'Calendrier'}
            {window.location.pathname === '/notes' && 'Mes cours'}
            {window.location.pathname === '/study-groups' && 'Groupes d\'étude'}
            {window.location.pathname === '/clinical-cases' && 'Cas cliniques'}
            {window.location.pathname === '/tools' && 'Outils de productivité'}
            {window.location.pathname === '/exam-simulator' && 'Simulateur d\'examen'}
            {window.location.pathname === '/continuing-education' && 'Formation continue'}
            {window.location.pathname === '/settings' && 'Paramètres'}
          </h1>
        </div>

        {/* Search bar */}
        <div className="flex-1 max-w-md mx-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Rechercher..."
              className="pl-9 py-2 pr-4 rounded-md border border-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-medical-teal focus:border-transparent transition-all"
            />
          </div>
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
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Standalone logout button */}
          <Button 
            variant="ghost" 
            size="icon" 
            title="Déconnexion" 
            onClick={logout}
            className="transition-transform hover:scale-110 text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DesktopNavbar;
