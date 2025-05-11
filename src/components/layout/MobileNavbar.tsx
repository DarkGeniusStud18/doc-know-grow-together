
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Book, BookOpen, Calendar, FileText, LayoutGrid, LogOut, Menu, MessageSquare, Settings, Wrench, TrendingUp, Users } from 'lucide-react';
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
    { path: '/dashboard', label: 'Accueil', icon: Book },
    { path: '/resources', label: 'Ressources', icon: BookOpen },
    { path: '/community', label: 'Communauté', icon: Users },
    { path: '/calendar', label: 'Calendrier', icon: Calendar },
  ];
  
  // Add role-specific items
  const studentItems = [
    { path: '/notes', label: 'Mes cours', icon: FileText },
    { path: '/study-groups', label: 'Groupes d\'étude', icon: Users },
    { path: '/tools', label: 'Outils de productivité', icon: Wrench },
    { path: '/exam-simulator', label: 'Simulateur d\'examen', icon: LayoutGrid },
  ];
  
  const professionalItems = [
    { path: '/clinical-cases', label: 'Cas cliniques', icon: MessageSquare },
    { path: '/continuing-education', label: 'Formation continue', icon: TrendingUp },
  ];
  
  const roleSpecificItems = user.role === 'student' ? studentItems : professionalItems;
  const allItems = [...navItems, ...roleSpecificItems, { path: '/settings', label: 'Paramètres', icon: Settings }];
  
  // Discord-style Nav Item for mobile menu
  const NavIcon = ({ path, label, icon: Icon }: { path: string; label: string; icon: React.ElementType }) => {
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
          <Icon size={20} className="transition-transform group-hover:scale-110" />
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
                      <NavIcon key={item.path} path={item.path} label={item.label} icon={item.icon} />
                    ))}
                    
                    <div className="w-8 h-0.5 bg-gray-300 rounded-full my-2"></div>
                    
                    {roleSpecificItems.map((item) => (
                      <NavIcon key={item.path} path={item.path} label={item.label} icon={item.icon} />
                    ))}
                    
                    <div className="w-8 h-0.5 bg-gray-300 rounded-full my-2"></div>
                    
                    <NavIcon path="/settings" label="Paramètres" icon={Settings} />
                    
                    {/* Logout button */}
                    <button 
                      onClick={logout} 
                      className="w-full"
                    >
                      <div className="relative group w-12 h-12 flex items-center justify-center rounded-full mb-2 mx-auto transition-all duration-300 bg-gray-200 text-red-500 hover:bg-red-500 hover:text-white hover:rounded-2xl">
                        <LogOut size={20} className="transition-transform group-hover:scale-110" />
                      </div>
                      <p className="text-xs text-center text-red-500">
                        Déconnexion
                      </p>
                    </button>
                  </div>
                </div>

                {/* Main content area - keep this empty as we're only using the discord-style sidebar */}
              </div>
            </SheetContent>
          </Sheet>
          
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-medical-blue text-white flex items-center justify-center font-bold transition-transform hover:scale-110">M</div>
          </Link>
        </div>
        
        {/* Page title in the center */}
        <div className="text-center">
          <h1 className="text-lg font-semibold text-medical-navy">
            {location.pathname === '/dashboard' && 'Accueil'}
            {location.pathname === '/resources' && 'Ressources'}
            {location.pathname === '/community' && 'Communauté'}
            {location.pathname === '/calendar' && 'Calendrier'}
            {location.pathname === '/notes' && 'Mes cours'}
            {location.pathname === '/study-groups' && 'Groupes d\'étude'}
            {location.pathname === '/tools' && 'Outils'}
            {location.pathname === '/exam-simulator' && 'Examens'}
            {location.pathname === '/clinical-cases' && 'Cas cliniques'}
            {location.pathname === '/continuing-education' && 'Formation'}
            {location.pathname === '/settings' && 'Paramètres'}
          </h1>
        </div>
        
        {/* User avatar on the right */}
        <div className="flex items-center">
          <Avatar className="h-8 w-8 transition-transform hover:scale-110">
            <AvatarImage src={user.profileImage || "/placeholder.svg"} alt={user.displayName} />
            <AvatarFallback className="bg-medical-teal text-white">
              {user.displayName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default MobileNavbar;
