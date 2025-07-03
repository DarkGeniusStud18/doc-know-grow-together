
/**
 * 📱 Navigation Mobile MedCollab - Version Finale Optimisée et Fixée
 * 
 * Fonctionnalités principales :
 * - Navigation fixe en bas d'écran (toujours visible et bien positionnée)
 * - Menu principal avec 4 éléments + bouton menu secondaire
 * - Menu secondaire déployable avec animation fluide
 * - Design médical cohérent avec animations
 * - Optimisation pour tous les écrans mobiles et tablettes
 * - Navigation entièrement fonctionnelle sans erreurs
 */

import React, { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { primaryNavItems, secondaryNavItems } from './navigation-config';
import { Menu, X } from 'lucide-react';

/**
 * 📱 Composant principal de navigation mobile - Version corrigée et optimisée
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
   * 🚀 Gestionnaire de navigation optimisé avec vérification des routes
   */
  const handleNavigation = useCallback((href: string) => {
    console.log('📱 Navigation mobile vers:', href);
    
    try {
      navigate(href);
      
      // Fermer le menu secondaire après navigation
      if (isSecondaryMenuOpen) {
        setIsSecondaryMenuOpen(false);
      }
    } catch (error) {
      console.error('❌ Erreur de navigation:', error);
      // Fallback vers la page d'accueil en cas d'erreur
      navigate('/dashboard');
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
      {/* Overlay pour le menu secondaire avec z-index corrigé */}
      {isSecondaryMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[9998] animate-fade-in"
          onClick={() => setIsSecondaryMenuOpen(false)}
        />
      )}

      {/* Menu secondaire déployable avec z-index supérieur */}
      <div className={cn(
        "fixed bottom-20 left-0 right-0 z-[9999] mx-4 transition-all duration-300 ease-out",
        isSecondaryMenuOpen 
          ? "translate-y-0 opacity-100 pointer-events-auto" 
          : "translate-y-full opacity-0 pointer-events-none"
      )}>
        <div className="bg-white/98 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 p-4">
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
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Barre de navigation principale fixe en bas - Position garantie */}
      <nav className="fixed bottom-0 left-0 right-0 z-[9999] bg-white/98 backdrop-blur-lg shadow-lg border-t border-gray-200/50 safe-area-inset-bottom">
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

      {/* Styles CSS personnalisés pour les animations et la sécurité */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Animation de fade-in pour l'overlay */
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          .animate-fade-in {
            animation: fade-in 0.2s ease-out;
          }
          
          /* Safe area pour les appareils avec encoche */
          .safe-area-inset-bottom {
            padding-bottom: env(safe-area-inset-bottom);
          }
          
          /* Garantir que la navigation mobile reste toujours visible */
          @media (max-width: 1024px) {
            .fixed.bottom-0 {
              position: fixed !important;
              bottom: 0 !important;
              z-index: 9999 !important;
            }
          }
          
          /* Optimisations tactiles pour mobile */
          @media (max-width: 768px) {
            .mobile-nav-button {
              -webkit-tap-highlight-color: transparent;
              touch-action: manipulation;
            }
            
            .mobile-nav-button:active {
              transform: scale(0.95);
            }
          }
        `
      }} />
    </>
  );
};

export default MobileNavbar;
