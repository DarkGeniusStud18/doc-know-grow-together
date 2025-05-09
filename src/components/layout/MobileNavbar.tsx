
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Globe, Menu, Search, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const MobileNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  
  if (!user) return null;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Navigation items based on user role
  const navItems = [
    { path: '/dashboard', label: 'Accueil' },
    { path: '/resources', label: 'Ressources' },
    { path: '/community', label: 'Communauté' },
    { path: '/calendar', label: 'Calendrier' },
  ];
  
  // Add role-specific items
  const roleSpecificItems = user.role === 'student' 
    ? [
        { path: '/notes', label: 'Mes cours' },
        { path: '/study-groups', label: 'Groupes d\'étude' },
      ]
    : [
        { path: '/clinical-cases', label: 'Cas cliniques' },
      ];
  
  const allItems = [...navItems, ...roleSpecificItems, { path: '/settings', label: 'Paramètres' }];
  
  return (
    <header className="md:hidden sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="container px-4 py-3 flex justify-between items-center">
        {/* Left: Menu button and logo */}
        <div className="flex items-center gap-3">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] p-0">
              <div className="p-4 border-b">
                <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                  <div className="h-8 w-8 rounded-md bg-medical-blue text-white flex items-center justify-center font-bold">M</div>
                  <span className="text-xl font-bold text-medical-navy">MedCollab</span>
                </Link>
              </div>
              
              {/* User info */}
              <div className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg" alt={user.displayName} />
                    <AvatarFallback className="bg-medical-teal text-white">
                      {user.displayName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.displayName}</p>
                    <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>
              </div>
              
              {/* Navigation links */}
              <nav className="p-2">
                <ul className="space-y-1">
                  {allItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={cn(
                          "flex w-full rounded-md px-3 py-2 text-sm font-medium",
                          isActive(item.path) 
                            ? "bg-medical-blue text-white" 
                            : "text-gray-700 hover:bg-gray-100"
                        )}
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              
              {/* Logout button */}
              <div className="p-4 border-t mt-auto">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                >
                  Déconnexion
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-medical-blue text-white flex items-center justify-center font-bold">M</div>
          </Link>
        </div>
        
        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Globe className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default MobileNavbar;
