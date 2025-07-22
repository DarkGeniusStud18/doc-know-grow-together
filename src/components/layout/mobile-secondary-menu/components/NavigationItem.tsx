
/**
 * Composant d'élément de navigation individuel pour le menu mobile
 * 
 * Affiche une carte interactive pour chaque fonctionnalité
 * avec icône, titre et indication d'état actif
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { NavigationItemProps } from '../types';

/**
 * Élément de navigation avec design optimisé pour mobile
 * 
 * Fonctionnalités :
 * - Carte interactive avec feedback visuel
 * - Indicateur d'état actif
 * - Animation de hover et de clic
 * - Design accessible et responsive
 * - Icônes et texte optimisés pour la lisibilité
 */
export const NavigationItem: React.FC<NavigationItemProps> = ({
  item,
  isActive,
  onClick
}) => {
  // 🔗 Navigation avec React Router pour les liens valides
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick();
  };

  return (
    <Link
      to={item.href || '#'}
      onClick={handleClick}
      className={`
        group relative block w-full p-4 rounded-2xl text-left transition-all duration-200 no-underline
        ${isActive 
          ? 'bg-medical-teal text-white shadow-lg scale-[1.02]' 
          : 'bg-white hover:bg-gray-50 border border-gray-100 hover:border-medical-teal/30 hover:shadow-md active:scale-[0.98]'
        }
        focus:outline-none focus:ring-2 focus:ring-medical-teal focus:ring-opacity-50
      `}
      aria-label={`Accéder à ${item.label}`}
    >
      {/* Indicateur d'état actif */}
      {isActive && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full opacity-80"></div>
      )}
      
      {/* Conteneur de l'icône avec background adaptatif */}
      <div className={`
        flex items-center justify-center w-12 h-12 rounded-xl mb-3 transition-colors duration-200
        ${isActive 
          ? 'bg-white/20' 
          : 'bg-gray-100 group-hover:bg-medical-teal/10'
        }
      `}>
        <item.icon 
          size={24} 
          className={`
            transition-colors duration-200
            ${isActive 
              ? 'text-white' 
              : 'text-gray-600 group-hover:text-medical-teal'
            }
          `} 
        />
      </div>
      
      {/* Titre de l'élément */}
      <h3 className={`
        font-semibold text-sm leading-tight transition-colors duration-200
        ${isActive 
          ? 'text-white' 
          : 'text-gray-900 group-hover:text-medical-teal'
        }
      `}>
        {item.label}
      </h3>
      
      {/* Animation de ripple au clic */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-active:translate-x-full transition-transform duration-300"></div>
      </div>
    </Link>
  );
};
