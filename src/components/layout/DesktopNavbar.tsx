
/**
 * 🖥️ Navigation Bureau - Version avec Accès Admin Dissimulé
 * Navigation principale pour écrans desktop avec accès administrateur sécurisé
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import AdminAccessButton from '@/components/admin/AdminAccessButton';

const DesktopNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/tools', label: 'Outils', icon: '🛠️' },
    { href: '/resources', label: 'Ressources', icon: '📚' },
    { href: '/community', label: 'Communauté', icon: '👥' },
    { href: '/calendar', label: 'Calendrier', icon: '📅' }
  ];

  const isActiveRoute = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const handleLogout = async () => {
    await logout();
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="hidden lg:flex items-center justify-between px-6 py-4 bg-white shadow-sm border-b">
      {/* Logo et titre */}
      <div className="flex items-center space-x-4">
        <Link to="/dashboard" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-medical-blue to-medical-teal rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="text-xl font-bold text-gray-800">MedCollab</span>
        </Link>
        
        {/* Bouton admin dissimulé (à droite du logo) */}
        <AdminAccessButton />
      </div>

      {/* Navigation principale */}
      <div className="flex items-center space-x-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2",
              "hover:bg-gray-100 hover:text-medical-blue",
              isActiveRoute(item.href)
                ? "bg-medical-blue text-white shadow-md"
                : "text-gray-600"
            )}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Actions utilisateur */}
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-600">
          Bonjour, <span className="font-semibold">{user.displayName}</span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          Déconnexion
        </Button>
      </div>
    </nav>
  );
};

export default DesktopNavbar;
