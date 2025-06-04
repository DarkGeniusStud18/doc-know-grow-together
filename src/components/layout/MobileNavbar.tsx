
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Book, BookOpen, Calendar, FileText, LayoutGrid, LogOut, MessageSquare, Settings, Wrench, TrendingUp, Users, Menu, Search, Music, Stethoscope, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';

const MobileNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
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
    { path: '/music-library', label: 'Musique', icon: Music },
  ];
  
  // Add role-specific items
  const studentItems = [
    { path: '/my-courses', label: 'Mes cours', icon: GraduationCap },
    { path: '/notes', label: 'Mes notes', icon: FileText },
    { path: '/study-groups', label: 'Groupes d\'étude', icon: Users },
    { path: '/tools', label: 'Outils', icon: Wrench },
    { path: '/exam-simulator', label: 'Simulateur', icon: LayoutGrid },
  ];
  
  const professionalItems = [
    { path: '/clinical-cases', label: 'Cas cliniques', icon: Stethoscope },
    { path: '/continuing-education', label: 'Formation continue', icon: TrendingUp },
    { path: '/study-groups', label: 'Groupes d\'étude', icon: Users },
  ];
  
  const roleSpecificItems = user.role === 'student' ? studentItems : professionalItems;
  
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

  // Search drawer for mobile
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Recherche:", searchQuery);
    setSearchOpen(false);
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
      '/tools': 'Outils',
      '/exam-simulator': 'Simulateur',
      '/clinical-cases': 'Cas cliniques',
      '/continuing-education': 'Formation',
      '/settings': 'Paramètres',
      '/profile': 'Mon Profil',
      '/music-library': 'Musique',
      '/subscription': 'Abonnement'
    };
    return titleMap[path] || 'MedCollab';
  };
  
  return (
    <header className="md:hidden sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="container px-4 py-3 flex justify-between items-center">
        {/* Left: Menu button that opens the sheet */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setOpen(true)}
            className="hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-medical-blue text-white flex items-center justify-center font-bold transition-transform hover:scale-110">M</div>
          </Link>
        </div>
        
        {/* The side sheet with Discord-style sidebar */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="w-[180px] p-0">
            <div className="flex h-full">
              <div className="w-full bg-gray-100 h-full flex flex-col items-center overflow-hidden">
                {/* User avatar */}
                <Link 
                  to="/profile" 
                  onClick={() => setOpen(false)}
                  className="w-12 h-12 bg-medical-blue text-white rounded-full mt-4 mb-4 flex items-center justify-center hover:shadow-md transition-all duration-300 hover:scale-105"
                >
                  <span className="font-semibold">{user.displayName.substring(0, 2).toUpperCase()}</span>
                </Link>
                
                <div className="w-8 h-0.5 bg-gray-300 rounded-full my-2"></div>
                
                {/* Navigation Icons - With scrollbar */}
                <ScrollArea className="flex-1 w-full px-3">
                  <div className="grid grid-cols-2 gap-2 py-2">
                    {navItems.map((item) => (
                      <NavIcon key={item.path} path={item.path} label={item.label} icon={item.icon} />
                    ))}
                  </div>
                  
                  <div className="w-full h-0.5 bg-gray-300 rounded-full my-2"></div>
                  
                  <div className="grid grid-cols-2 gap-2 py-2">
                    {roleSpecificItems.map((item) => (
                      <NavIcon key={item.path} path={item.path} label={item.label} icon={item.icon} />
                    ))}
                  </div>
                  
                  <div className="w-full h-0.5 bg-gray-300 rounded-full my-2"></div>
                  
                  <div className="flex justify-center">
                    <NavIcon path="/settings" label="Paramètres" icon={Settings} />
                  </div>
                </ScrollArea>
                
                {/* Logout button */}
                <button 
                  onClick={() => {
                    logout('/');
                    setOpen(false);
                  }}
                  className="w-full mt-2 mb-4"
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
          </SheetContent>
        </Sheet>
        
        {/* Page title in the center */}
        <div className="text-center">
          <h1 className="text-lg font-semibold text-medical-navy">
            {getPageTitle()}
          </h1>
        </div>
        
        {/* User avatar and Search on the right */}
        <div className="flex items-center gap-2">
          <Drawer open={searchOpen} onOpenChange={setSearchOpen}>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <Search className="h-5 w-5" />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="p-4">
                <h3 className="text-lg font-medium mb-2">Rechercher</h3>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-medical-blue"
                    placeholder="Que recherchez-vous?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <Button type="submit">Rechercher</Button>
                </form>
              </div>
            </DrawerContent>
          </Drawer>

          <Link to="/profile">
            <Avatar className="h-8 w-8 transition-transform hover:scale-110">
              <AvatarImage src={user.profileImage || "/placeholder.svg"} alt={user.displayName} />
              <AvatarFallback className="bg-medical-teal text-white">
                {user.displayName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default MobileNavbar;
