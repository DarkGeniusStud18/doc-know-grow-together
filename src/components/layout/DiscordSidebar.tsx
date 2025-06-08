
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/context/AuthContext';
import { Book, BookOpen, Calendar, FileText, LayoutGrid, LogOut, Settings, Wrench, TrendingUp, Users, Music, Stethoscope, GraduationCap } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const DiscordSidebar: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  
  if (!user) return null;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Handler for logout button
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Logout button clicked');
    await signOut();
  };

  // Base navigation icon component
  const NavIcon = ({ path, icon: Icon, label }: { path: string; icon: React.ElementType; label: string }) => {
    const active = isActive(path);
    
    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to={path} className="block">
              <div 
                className={cn(
                  "relative group w-12 h-12 flex items-center justify-center rounded-full mb-3 transition-all duration-300",
                  active 
                    ? "bg-medical-blue text-white rounded-2xl transform scale-105 shadow-lg" 
                    : "bg-gray-200 text-gray-500 hover:bg-medical-teal hover:text-white hover:rounded-2xl hover:scale-105 hover:shadow-md"
                )}
              >
                {active && (
                  <div className="absolute -left-3 w-1.5 h-10 bg-white rounded-r-full transition-all duration-300"></div>
                )}
                <Icon size={24} className="transition-transform group-hover:scale-110" />
              </div>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-gray-800 text-white border-gray-700 ml-2">
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // Navigation items based on user role
  const navItems = [
    { path: '/dashboard', icon: Book, label: 'Accueil' },
    { path: '/resources', icon: BookOpen, label: 'Ressources' },
    { path: '/community', icon: Users, label: 'Communauté' },
    { path: '/calendar', icon: Calendar, label: 'Calendrier' },
    { path: '/music-library', icon: Music, label: 'Bibliothèque Musicale' },
  ];
  
  // Role-specific items
  const studentItems = [
    { path: '/my-courses', icon: GraduationCap, label: 'Mes cours' },
    { path: '/notes', icon: FileText, label: 'Mes notes' },
    { path: '/study-groups', icon: Users, label: 'Groupes d\'étude' },
    { path: '/tools', icon: Wrench, label: 'Outils' },
    { path: '/exam-simulator', icon: LayoutGrid, label: 'Simulateur' },
  ];
  
  const professionalItems = [
    { path: '/clinical-cases', icon: Stethoscope, label: 'Cas cliniques' },
    { path: '/continuing-education', icon: TrendingUp, label: 'Formation continue' },
    { path: '/study-groups', icon: Users, label: 'Groupes d\'étude' },
  ];
  
  const roleSpecificItems = user.role === 'student' ? studentItems : professionalItems;

  return (
    <div className="hidden md:flex flex-col items-center w-[80px] bg-gray-100 h-screen border-r shadow-sm">
      {/* User avatar - link to profile */}
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to="/profile" className="w-14 h-14 bg-medical-blue text-white rounded-full mt-6 mb-6 flex items-center justify-center hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
              <span className="font-semibold text-lg">{user.displayName.substring(0, 2).toUpperCase()}</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-gray-800 text-white border-gray-700 ml-2">
            Mon Profil
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <div className="w-10 h-0.5 bg-gray-300 rounded-full my-3"></div>
      
      {/* Navigation icons with scrollbar */}
      <ScrollArea className="h-[calc(100vh-220px)] w-full py-3 px-4">
        <div className="flex flex-col items-center space-y-2 w-full">
          {navItems.map((item) => (
            <NavIcon key={item.path} path={item.path} icon={item.icon} label={item.label} />
          ))}
          
          <div className="w-10 h-0.5 bg-gray-300 rounded-full my-3"></div>
          
          {roleSpecificItems.map((item) => (
            <NavIcon key={item.path} path={item.path} icon={item.icon} label={item.label} />
          ))}
          
          <div className="w-10 h-0.5 bg-gray-300 rounded-full my-3"></div>
          
          <NavIcon path="/settings" icon={Settings} label="Paramètres" />
        </div>
      </ScrollArea>
      
      {/* Logout button */}
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={handleLogout}
              className="w-12 h-12 flex items-center justify-center rounded-full mb-6 mt-auto transition-all duration-300 bg-gray-200 text-red-500 hover:bg-red-500 hover:text-white hover:rounded-2xl hover:scale-105 hover:shadow-md"
            >
              <LogOut size={24} className="transition-transform hover:scale-110" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-gray-800 text-white border-gray-700 ml-2">
            Déconnexion
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default DiscordSidebar;
