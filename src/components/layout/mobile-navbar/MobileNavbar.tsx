
/**
 * 📱 Navigation Mobile MedCollab - Version Optimisée Fixe
 * 
 * Fonctionnalités principales :
 * - Navigation fixe en bas d'écran (toujours visible)
 * - Menu principal avec 4 éléments + bouton menu secondaire
 * - Menu secondaire déployable avec animation fluide
 * - Design médical cohérent avec animations
 * - Optimisation pour tous les écrans mobiles et tablettes
 */

import React, { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Home, 
  BookOpen, 
  Users, 
  GraduationCap,
  Menu,
  X,
  Wrench,
  FileText,
  Music,
  Calendar
} from 'lucide-react';

/**
 * Interface pour les éléments de navigation
 */
interface NavItem {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  href: string;
  badge?: string;
}

/**
 * Configuration de la navigation principale (4 éléments)
 * Ordre spécifique requis par l'utilisateur
 */
const primaryNavItems: NavItem[] = [
  {
    id: 'dashboard',
    icon: Home,
    label: 'Dashboard',
    href: '/dashboard'
  },
  {
    id: 'resources',
    icon: BookOpen,
    label: 'Ressources',
    href: '/resources'
  },
  {
    id: 'community',
    icon: Users,
    label: 'Communauté',
    href: '/community'
  },
  {
    id: 'study-groups',
    icon: GraduationCap,
    label: 'Groupes',
    href: '/study-groups'
  }
];

/**
 * Configuration du menu secondaire
 * Ordre spécifique requis par l'utilisateur
 */
const secondaryNavItems: NavItem[] = [
  {
    id: 'tools',
    icon: Wrench,
    label: 'Outils de productivité',
    href: '/tools'
  },
  {
    id: 'notes',
    icon: FileText,
    label: 'Mes notes',
    href: '/notes'
  },
  {
    id: 'music',
    icon: Music,
    label: 'Bibliothèque musicale',
    href: '/music'
  },
  {
    id: 'calendar',
    icon: Calendar,
    label: 'Calendrier',
    href: '/calendar'
  }
];

/**
 * Composant principal de navigation mobile
 */
const MobileNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSecondaryMenuOpen, setIsSecondaryMenuOpen] = useState(false);

  /**
   * 🎯 Fonction pour déterminer si un élément est actif
   */
  const isActive = useCallback((href: string): boolean => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  }, [location.pathname]);

  /**
   * 🚀 Gestionnaire de navigation optimisé
   */
  const handleNavigation = useCallback((href: string) => {
    console.log('📱 Navigation mobile vers:', href);
    navigate(href);
    
    // Fermer le menu secondaire après navigation
    if (isSecondaryMenuOpen) {
      setIsSecondaryMenuOpen(false);
    }
  }, [navigate, isSecondaryMenuOpen]);

  /**
   * 📋 Gestionnaire du menu secondaire
   */
  const toggleSecondaryMenu = useCallback(() => {
    setIsSecondaryMenuOpen(prev => !prev);
  }, []);

  return (
    <>
      {/* Overlay pour le menu secondaire */}
      {isSecondaryMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
          onClick={() => setIsSecondaryMenuOpen(false)}
        />
      )}

      {/* Menu secondaire déployable */}
      <div className={cn(
        "fixed bottom-20 left-0 right-0 z-50 mx-4 transition-all duration-300 ease-out",
        isSecondaryMenuOpen 
          ? "translate-y-0 opacity-100 pointer-events-auto" 
          : "translate-y-full opacity-0 pointer-events-none"
      )}>
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 p-4">
          <div className="grid grid-cols-2 gap-3">
            {secondaryNavItems.map((item) => {
              const IconComponent = item.icon;
              const itemIsActive = isActive(item.href);
              
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={cn(
                    "h-16 flex-col space-y-1 text-xs font-medium transition-all duration-200",
                    "hover:bg-medical-light/50 hover:scale-105 active:scale-95",
                    "rounded-xl border border-transparent",
                    itemIsActive 
                      ? "bg-medical-blue text-white shadow-md border-medical-blue/20" 
                      : "text-gray-600 hover:text-medical-navy"
                  )}
                  onClick={() => handleNavigation(item.href)}
                >
                  <IconComponent 
                    className={cn(
                      "w-5 h-5 transition-colors",
                      itemIsActive ? "text-white" : "text-medical-blue"
                    )} 
                  />
                  <span className="text-center leading-tight">
                    {item.label}
                  </span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs ml-1">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Barre de navigation principale fixe */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-t border-gray-200/50">
        <div className="flex items-center justify-around px-2 py-3 max-w-md mx-auto">
          
          {/* Éléments de navigation principaux */}
          {primaryNavItems.map((item) => {
            const IconComponent = item.icon;
            const itemIsActive = isActive(item.href);
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "flex-1 flex-col space-y-1 h-14 text-xs font-medium transition-all duration-200",
                  "hover:bg-medical-light/50 hover:scale-105 active:scale-95",
                  "rounded-xl mx-1",
                  itemIsActive 
                    ? "bg-medical-blue text-white shadow-md" 
                    : "text-gray-600 hover:text-medical-navy"
                )}
                onClick={() => handleNavigation(item.href)}
              >
                <IconComponent 
                  className={cn(
                    "w-5 h-5 transition-colors",
                    itemIsActive ? "text-white" : "text-medical-blue"
                  )} 
                />
                <span className="text-center leading-tight">
                  {item.label}
                </span>
                {item.badge && (
                  <Badge variant="secondary" className="text-xs ml-1">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            );
          })}

          {/* Bouton du menu secondaire */}
          <Button
            variant="ghost"
            className={cn(
              "flex-1 flex-col space-y-1 h-14 text-xs font-medium transition-all duration-200",
              "hover:bg-medical-light/50 hover:scale-105 active:scale-95",
              "rounded-xl mx-1",
              isSecondaryMenuOpen 
                ? "bg-medical-teal text-white shadow-md" 
                : "text-gray-600 hover:text-medical-navy"
            )}
            onClick={toggleSecondaryMenu}
          >
            {isSecondaryMenuOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-medical-blue" />
            )}
            <span className="text-center leading-tight">
              {isSecondaryMenuOpen ? 'Fermer' : 'Plus'}
            </span>
          </Button>
        </div>
      </nav>
    </>
  );
};

export default MobileNavbar;
