/**
 * 🌙 Bouton de basculement de thème - Interface élégante et accessible
 * 
 * Fonctionnalités :
 * - Support des 3 modes : light, dark, system
 * - Animations fluides et icônes adaptées
 * - Menu déroulant avec options claires
 * - Design responsive pour mobile/desktop
 */

import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  size = 'default',
  variant = 'ghost'
}) => {
  const { theme, setTheme } = useTheme();
  
  // Calculer si le mode sombre est actif
  const isDark = theme === 'dark' || (theme === 'system' && 
    window.matchMedia('(prefers-color-scheme: dark)').matches);

  const themeOptions = [
    {
      value: 'light' as const,
      label: 'Clair',
      icon: Sun,
      description: 'Thème clair permanent'
    },
    {
      value: 'dark' as const,
      label: 'Sombre',
      icon: Moon,
      description: 'Thème sombre permanent'
    },
    {
      value: 'system' as const,
      label: 'Système',
      icon: Monitor,
      description: 'Suit les préférences système'
    }
  ];

  const getCurrentIcon = () => {
    if (theme === 'system') return Monitor;
    return isDark ? Moon : Sun;
  };

  const CurrentIcon = getCurrentIcon();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`relative ${className}`}
          aria-label="Changer le thème"
          title="Sélectionner le thème"
        >
          <CurrentIcon className="h-4 w-4 transition-all duration-300" />
          <span className="sr-only">Basculer le thème</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-background/95 backdrop-blur-md border shadow-lg"
      >
        {themeOptions.map((option) => {
          const Icon = option.icon;
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={`
                flex items-center gap-3 p-3 cursor-pointer transition-colors
                ${theme === option.value ? 'bg-accent text-accent-foreground' : ''}
                hover:bg-accent/50
              `}
            >
              <Icon className="h-4 w-4" />
              <div className="flex-1">
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-muted-foreground">
                  {option.description}
                </div>
              </div>
              {theme === option.value && (
                <div className="w-2 h-2 bg-primary rounded-full" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};