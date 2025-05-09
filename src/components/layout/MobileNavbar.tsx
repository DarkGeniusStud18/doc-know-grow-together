
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Globe, Menu, Search, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  
  // Discord-style Nav Item for mobile menu
  const NavIcon = ({ path, label }: { path: string; label: string }) => {
    const active = isActive(path);
    
    return (
      <Link
        to={path}
        onClick={() => setOpen(false)}
        className="block w-full"
      >
        <div 
          className={cn(
            "relative group w-12 h-12 flex items-center justify-center rounded-full mb-2 mx-auto transition-all duration-300",
            active 
              ? "bg-medical-blue text-white rounded-2xl" 
              : "bg-gray-200 text-gray-500 hover:bg-medical-teal hover:text-white hover:rounded-2xl"
          )}
        >
          {active && (
            <div className="absolute -left-2 w-1.5 h-10 bg-white rounded-r-full transition-all duration-300"></div>
          )}
          <span className="font-semibold">{label.substring(0, 1).toUpperCase()}</span>
        </div>
        <p className={cn(
          "text-xs text-center",
          active ? "text-medical-blue font-medium" : "text-gray-500"
        )}>
          {label}
        </p>
      </Link>
    );
  };
  
  return (
    <header className="md:hidden sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="container px-4 py-3 flex justify-between items-center">
        {/* Left: Menu button and logo */}
        <div className="flex items-center gap-3">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="transition-transform hover:scale-110">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <div className="flex h-full">
                {/* Discord-style sidebar */}
                <div className="w-[72px] bg-gray-100 h-full py-4 border-r flex flex-col items-center">
                  {/* User avatar */}
                  <div className="w-12 h-12 bg-medical-blue text-white rounded-full mb-4 flex items-center justify-center hover:shadow-md transition-all duration-300">
                    <span className="font-semibold">{user.displayName.substring(0, 2).toUpperCase()}</span>
                  </div>
                  
                  <div className="w-8 h-0.5 bg-gray-300 rounded-full my-2"></div>
                  
                  {/* Navigation Icons */}
                  <div className="flex flex-col items-center gap-3 flex-1 overflow-y-auto py-2 px-3 w-full">
                    {navItems.map((item) => (
                      <NavIcon key={item.path} path={item.path} label={item.label} />
                    ))}
                    
                    <div className="w-8 h-0.5 bg-gray-300 rounded-full my-2"></div>
                    
                    {roleSpecificItems.map((item) => (
                      <NavIcon key={item.path} path={item.path} label={item.label} />
                    ))}
                    
                    <div className="w-8 h-0.5 bg-gray-300 rounded-full my-2"></div>
                    
                    <NavIcon path="/settings" label="Paramètres" />
                  </div>
                </div>

                {/* Main content area */}
                <div className="flex-1 py-4 px-3">
                  {/* User info */}
                  <div className="pb-4 border-b">
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
                  
                  {/* Navigation links with labels */}
                  <nav className="pt-3">
                    <h3 className="text-xs uppercase font-semibold text-gray-500 mb-2 px-1">Menu</h3>
                    <ul className="space-y-1">
                      {allItems.map((item) => (
                        <li key={item.path}>
                          <Link
                            to={item.path}
                            className={cn(
                              "flex w-full rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                              isActive(item.path) 
                                ? "bg-medical-blue text-white" 
                                : "text-gray-700 hover:bg-gray-100 hover:translate-x-1"
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
                  <div className="pt-4 border-t mt-6">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                    >
                      Déconnexion
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-medical-blue text-white flex items-center justify-center font-bold transition-transform hover:scale-110">M</div>
          </Link>
        </div>
        
        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="transition-transform hover:scale-110">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="transition-transform hover:scale-110">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="transition-transform hover:scale-110">
            <Globe className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default MobileNavbar;
