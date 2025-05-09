
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/context/AuthContext';
import { Home, BookOpen, Users, Calendar, FileText, MessageSquare, Settings } from 'lucide-react';

const DiscordSidebar: React.FC = () => {
  const { user } = useAuth();
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
                    ? "bg-medical-blue text-white rounded-2xl" 
                    : "bg-gray-200 text-gray-500 hover:bg-medical-teal hover:text-white hover:rounded-2xl"
                )}
              >
                {active && (
                  <div className="absolute -left-2 w-1.5 h-10 bg-white rounded-r-full transition-all duration-300"></div>
                )}
                <Icon size={24} className="transition-transform group-hover:scale-110" />
              </div>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // Navigation icons based on user role
  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Accueil' },
    { path: '/resources', icon: BookOpen, label: 'Ressources' },
    { path: '/community', icon: Users, label: 'Communauté' },
    { path: '/calendar', icon: Calendar, label: 'Calendrier' },
  ];
  
  // Add role-specific items
  const roleSpecificItems = user.role === 'student' 
    ? [
        { path: '/notes', icon: FileText, label: 'Mes cours' },
        { path: '/study-groups', icon: Users, label: 'Groupes d\'étude' },
      ]
    : [
        { path: '/clinical-cases', icon: MessageSquare, label: 'Cas cliniques' },
      ];

  return (
    <div className="hidden md:flex flex-col items-center w-[72px] bg-gray-100 h-screen py-4 border-r">
      {/* User avatar */}
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-12 h-12 bg-medical-blue text-white rounded-full mb-4 flex items-center justify-center hover:shadow-md transition-all duration-300">
              <span className="font-semibold">{user.displayName.substring(0, 2).toUpperCase()}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            MedCollab
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <div className="w-8 h-0.5 bg-gray-300 rounded-full my-2"></div>
      
      {/* Navigation Icons */}
      <div className="flex flex-col items-center space-y-1 flex-1 overflow-y-auto py-2 px-3 w-full">
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
    </div>
  );
};

export default DiscordSidebar;
