/**
 * 🖥️ Sidebar Desktop - Version complète avec bouton admin caché
 * 
 * Fonctionnalités :
 * - ✅ Navigation complète pour desktop
 * - ✅ Bouton admin ultra-discret pour utilisateurs autorisés
 * - ✅ Design cohérent avec le système mobile
 * - ✅ Commentaires français détaillés
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import AdminAccessButton from '@/components/admin/AdminAccessButton';
import {
  Home,
  BookOpen,
  Users,
  FileText,
  Stethoscope,
  Calendar,
  Settings,
  User,
  Crown,
  StickyNote,
  MessageSquare,
  Wrench,
  Music
} from 'lucide-react';

// 🧭 Configuration de navigation pour desktop
const navigationItems = [
  {
    name: 'Accueil',
    href: '/',
    icon: Home,
    description: 'Page d\'accueil'
  },
  {
    name: 'Tableau de bord',
    href: '/dashboard',
    icon: BookOpen,
    description: 'Vue d\'ensemble de vos activités'
  },
  {
    name: 'Ressources',
    href: '/resources',
    icon: FileText,
    description: 'Documents et articles médicaux'
  },
  {
    name: 'Cas cliniques',
    href: '/clinical-cases',
    icon: Stethoscope,
    description: 'Études de cas pratiques'
  },
  {
    name: 'Messagerie',
    href: '/messaging',
    icon: MessageSquare,
    description: 'Discussions et groupes'
  },
  {
    name: 'Calendrier',
    href: '/calendar',
    icon: Calendar,
    description: 'Planning et événements'
  },
  {
    name: 'Outils',
    href: '/tools',
    icon: Wrench,
    description: 'Outils d\'étude et simulateurs'
  },
  {
    name: 'Musique',
    href: '/music-library',
    icon: Music,
    description: 'Bibliothèque musicale'
  },
  {
    name: 'Notes',
    href: '/notes',
    icon: StickyNote,
    description: 'Mes notes personnelles'
  }
];

// 🔽 Navigation secondaire (bas de sidebar)
const secondaryNavigation = [
  {
    name: 'Mon profil',
    href: '/profile',
    icon: User,
    description: 'Gérer mon profil'
  },
  {
    name: 'Abonnement',
    href: '/subscription',
    icon: Crown,
    description: 'Gérer mon abonnement'
  },
  {
    name: 'Paramètres',
    href: '/settings',
    icon: Settings,
    description: 'Configuration de l\'application'
  }
];

interface DesktopSidebarProps {
  className?: string;
}

/**
 * 🖥️ Composant Sidebar Desktop avec navigation complète
 */
const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ className }) => {
  const location = useLocation();
  const { user } = useAuth();

  // 🛡️ Ne pas afficher si pas d'utilisateur connecté
  if (!user) {
    return null;
  }

  return (
    <div className={cn(
      "hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200 shadow-sm",
      className
    )}>
      {/* 🎨 En-tête avec logo et titre */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-medical-blue to-medical-teal">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Stethoscope className="h-5 w-5 text-medical-teal" />
          </div>
          <span className="text-lg font-bold text-white">MedCollab</span>
        </Link>

        {/* 🔐 Bouton admin ultra-discret à droite du logo */}
        <div className="ml-auto">
          <AdminAccessButton isMobile={false} className="ml-2" />
        </div>
      </div>

      {/* 🧭 Navigation principale */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-medical-teal text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:text-medical-teal"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                    isActive ? "text-white" : "text-gray-400 group-hover:text-medical-teal"
                  )}
                />
                {item.name}
                
                {/* 🔵 Indicateur actif */}
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </div>

        {/* 📏 Séparateur */}
        <div className="border-t border-gray-200 my-6" />

        {/* 🔽 Navigation secondaire */}
        <div className="space-y-1">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Compte
          </h3>
          {secondaryNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-medical-teal text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:text-medical-teal"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                    isActive ? "text-white" : "text-gray-400 group-hover:text-medical-teal"
                  )}
                />
                {item.name}
                
                {/* 🔵 Indicateur actif */}
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* 👤 Profil utilisateur en bas */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
        <Link
          to="/profile"
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white transition-colors group"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user.displayName?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate group-hover:text-medical-teal">
              {user.displayName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user.role === 'student' ? 'Étudiant' : 'Professionnel'}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DesktopSidebar;