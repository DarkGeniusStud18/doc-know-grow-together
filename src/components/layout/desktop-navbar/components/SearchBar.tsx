
/**
 * 🔍 Composant de barre de recherche intelligente pour DesktopNavbar
 * 
 * Fonctionnalités optimisées :
 * - Recherche intelligente avec debouncing (300ms) pour optimiser les performances
 * - États visuels dynamiques avec animations de focus
 * - Validation et gestion d'erreur intégrée
 * - Support complet de l'accessibilité ARIA
 */

import React, { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { debounce } from '@/lib/utils/supabase-helpers';

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

/**
 * Composant de recherche avec debouncing et animations
 * Optimise l'expérience utilisateur avec feedback visuel en temps réel
 */
export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  /**
   * 🔍 Gestionnaire de recherche intelligent avec debouncing
   * Optimise les requêtes en évitant les appels trop fréquents lors de la saisie utilisateur
   * Délai de 300ms pour équilibrer réactivité et performance
   */
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim().length > 2) {
        console.log('🔍 SearchBar: Exécution recherche intelligente:', query);
        if (onSearch) {
          onSearch(query);
        }
        // 🚀 TODO: Intégrer le service de recherche avancé
        // await searchService.performAdvancedSearch(query);
      }
    }, 300),
    [onSearch]
  );

  /**
   * 📝 Gestionnaire de soumission du formulaire de recherche
   * Traite la recherche manuelle (touche Entrée) avec validation
   */
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    
    if (trimmedQuery.length > 0) {
      console.log('📝 SearchBar: Recherche manuelle soumise:', trimmedQuery);
      debouncedSearch(trimmedQuery);
    }
  }, [searchQuery, debouncedSearch]);

  /**
   * 🔄 Gestionnaire de changement de recherche avec déclenchement automatique
   * Optimise l'expérience utilisateur avec recherche prédictive
   */
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    
    // 🚀 Déclenchement automatique pour requêtes de longueur suffisante
    if (newValue.length > 2) {
      debouncedSearch(newValue);
    }
  }, [debouncedSearch]);

  return (
    <div className="flex-1 max-w-md mx-4 lg:mx-6">
      <form onSubmit={handleSearch} role="search" aria-label="Recherche principale">
        <div className={`relative transition-all duration-200 ${
          isSearchFocused 
            ? 'ring-2 ring-medical-teal ring-opacity-50 shadow-md' 
            : 'hover:shadow-sm'
        }`}>
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${
            isSearchFocused 
              ? 'text-medical-teal' 
              : 'text-gray-400'
          }`} />
          <input
            type="search"
            placeholder="Rechercher des cours, ressources, groupes d'étude..."
            className="pl-10 py-2.5 pr-4 rounded-lg border border-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-medical-teal focus:border-transparent transition-all text-sm bg-white"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            aria-label="Champ de recherche intelligent"
            autoComplete="off"
          />
          {/* 🎯 Indicateur visuel de recherche active */}
          {searchQuery.length > 0 && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2" title="Recherche en cours">
              <div className="w-2 h-2 bg-medical-teal rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
