import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Book, Calendar, FileText, Home, MessageSquare, Settings, Users, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User, Settings2 } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Éléments de menu communs pour tous les utilisateurs
  const commonMenuItems = [
    {
      icon: Home,
      label: 'Accueil',
      path: '/dashboard',
    },
    {
      icon: Book,
      label: 'Ressources',
      path: '/resources',
    },
    {
      icon: Users,
      label: 'Communauté',
      path: '/community',
    },
    {
      icon: Calendar,
      label: 'Calendrier',
      path: '/calendar',
    }
  ];

  // Éléments de menu spécifiques aux étudiants
  const studentMenuItems = [
    {
      icon: Book,
      label: 'Mes cours',
      path: '/my-courses',
    },
    {
      icon: FileText,
      label: 'Mes notes',
      path: '/notes',
    },
    {
      icon: Video,
      label: 'Groupes d\'étude',
      path: '/study-groups',
    },
  ];

  // Éléments de menu spécifiques aux professionnels
  const professionalMenuItems = [
    {
      icon: MessageSquare,
      label: 'Cas cliniques',
      path: '/clinical-cases',
    },
    {
      icon: FileText,
      label: 'Formation continue',
      path: '/continuing-education',
    },
    {
      icon: Video,
      label: 'Groupes d\'étude',
      path: '/study-groups',
    },
  ];

  // Déterminer quels éléments de menu spécifiques utiliser en fonction du rôle de l'utilisateur
  let roleSpecificMenuItems = [];
  if (user?.role === 'student') {
    roleSpecificMenuItems = studentMenuItems;
  } else if (user?.role === 'professional') {
    roleSpecificMenuItems = professionalMenuItems;
  }

  // Combiner les éléments de menu communs et spécifiques au rôle
  const menuItems = [...commonMenuItems, ...roleSpecificMenuItems, {
    icon: Settings,
    label: 'Paramètres',
    path: '/settings',
  }];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-medical-blue text-white flex items-center justify-center font-bold">M</div>
          <span className="text-xl font-bold text-medical-navy">MedCollab</span>
        </Link>
      </div>

      {/* Infos utilisateur */}
      <div className="px-6 pb-6 border-b border-gray-200">
        <div className="flex flex-col">
          <span className="font-medium text-medical-navy">{user?.displayName}</span>
          <span className="text-sm text-gray-500 capitalize">{user?.role}</span>
          {user?.kycStatus === 'verified' ? (
            <span className="mt-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full inline-flex items-center w-fit">
              <span className="mr-1 h-1.5 w-1.5 rounded-full bg-green-500"></span>
              Vérifié
            </span>
          ) : (
            <Link to="/kyc" className="mt-1 text-xs text-medical-teal hover:underline">
              Vérifier mon identité →
            </Link>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive(item.path)
                    ? "bg-medical-blue text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 text-center">
        <span className="text-xs text-gray-500">MedCollab v1.0.0</span>
      </div>

      {/* Add the subscription link near the bottom of your sidebar navigation */}
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Mon Compte
        </h2>
        <div className="space-y-1">
          <Button
            variant={location.pathname.includes("/profile") ? "default" : "ghost"}
            className="w-full justify-start"
            asChild
          >
            <Link to="/profile">
              <User className="mr-2 h-4 w-4" />
              Profil
            </Link>
          </Button>
          <Button
            variant={location.pathname.includes("/settings") ? "default" : "ghost"}
            className="w-full justify-start"
            asChild
          >
            <Link to="/settings">
              <Settings2 className="mr-2 h-4 w-4" />
              Paramètres
            </Link>
          </Button>
          <Button
            variant={location.pathname.includes("/subscription") ? "default" : "ghost"}
            className="w-full justify-start"
            asChild
          >
            <Link to="/subscription">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="m7 11 2-2-2-2"/>
                <path d="M11 13h4"/>
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
              </svg>
              Abonnement
            </Link>
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
