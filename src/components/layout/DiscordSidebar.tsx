
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/context/AuthContext';
import { Book, BookOpen, Calendar, FileText, LayoutGrid, LogOut, MessageSquare, Settings, Wrench, TrendingUp, Users } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const DiscordSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  if (!user) return null;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Base server/workspace icon
  const NavIcon = ({ path, icon: Icon, label }: { path: string; icon: React.ElementType; label: string }) => {
    const active = isActive(path);
    
    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to={path} className="block">
              <div 
                className={cn(
                  "relative group w-12 h-12 flex items-center justify-center rounded-full mb-2 transition-all duration-300",
                  active 
                    ? "bg-medical-blue text-white rounded-2xl transform scale-105" 
                    : "bg-gray-200 text-gray-500 hover:bg-medical-teal hover:text-white hover:rounded-2xl hover:scale-105"
                )}
              >
                {active && (
                  <div className="absolute -left-2 w-1.5 h-10 bg-white rounded-r-full transition-all duration-300"></div>
                )}
                <Icon size={24} className="transition-transform group-hover:scale-110" />
              </div>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-gray-800 text-white border-gray-700">
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // Navigation icons based on user role
  const navItems = [
    { path: '/dashboard', icon: Book, label: 'Accueil' },
    { path: '/resources', icon: BookOpen, label: 'Ressources' },
    { path: '/community', icon: Users, label: 'Communauté' },
    { path: '/calendar', icon: Calendar, label: 'Calendrier' },
  ];
  
  // Add role-specific items
  const studentItems = [
    { path: '/notes', icon: FileText, label: 'Mes cours' },
    { path: '/study-groups', icon: Users, label: 'Groupes d\'étude' },
    { path: '/tools', icon: Wrench, label: 'Outils de productivité' },
    { path: '/exam-simulator', icon: LayoutGrid, label: 'Simulateur d\'examen' },
  ];
  
  const professionalItems = [
    { path: '/clinical-cases', icon: MessageSquare, label: 'Cas cliniques' },
    { path: '/continuing-education', icon: TrendingUp, label: 'Formation continue' },
    { path: '/study-groups', icon: Users, label: 'Groupes d\'étude' },
  ];
  
  const roleSpecificItems = user.role === 'student' ? studentItems : professionalItems;

  return (
    <div className="hidden md:flex flex-col items-center w-[72px] bg-gray-100 h-screen border-r shadow-sm">
      {/* User avatar - changed to Link to profile page */}
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to="/profile" className="w-12 h-12 bg-medical-blue text-white rounded-full mt-4 mb-4 flex items-center justify-center hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer">
              <span className="font-semibold">{user.displayName.substring(0, 2).toUpperCase()}</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-gray-800 text-white border-gray-700">
            Mon Profil
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <div className="w-8 h-0.5 bg-gray-300 rounded-full my-2"></div>
      
      {/* Navigation Icons with transparent scrollbar */}
      <ScrollArea className="h-[calc(100vh-180px)] w-full py-2 px-3" style={{scrollbarWidth: 'thin', scrollbarColor: 'rgba(156, 163, 175, 0.3) transparent'}}>
        <div className="flex flex-col items-center space-y-1 w-full">
          {navItems.map((item) => (
            <NavIcon key={item.path} path={item.path} icon={item.icon} label={item.label} />
          ))}
          
          <div className="w-8 h-0.5 bg-gray-300 rounded-full my-2"></div>
          
          {roleSpecificItems.map((item) => (
            <NavIcon key={item.path} path={item.path} icon={item.icon} label={item.label} />
          ))}
          
          <div className="w-8 h-0.5 bg-gray-300 rounded-full my-2"></div>
          
          <NavIcon path="/settings" icon={Settings} label="Paramètres" />
        </div>
      </ScrollArea>
      
      {/* Logout button */}
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={logout}
              className="w-12 h-12 flex items-center justify-center rounded-full mb-4 mt-auto transition-all duration-300 bg-gray-200 text-red-500 hover:bg-red-500 hover:text-white hover:rounded-2xl hover:scale-105"
            >
              <LogOut size={24} className="transition-transform hover:scale-110" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-gray-800 text-white border-gray-700">
            Déconnexion
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default DiscordSidebar;
