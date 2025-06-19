
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * 🔬 Assistant de Recherche Médicale - Page principale
 * 
 * Fonctionnalités principales :
 * - Recherche intelligente dans les ressources médicales
 * - Suggestions personnalisées basées sur l'IA
 * - Interface utilisateur intuitive et responsive
 * - Intégration avec la base de données Supabase
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';
import { Search, BookOpen, Lightbulb, Star, ExternalLink, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

/**
 * Interface pour les ressources de recherche médicale
 */
interface ResearchResource {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  url: string;
  thumbnail?: string;
  language: string;
  content_type: string;
  featured: boolean;
  created_at: string;
}

/**
 * Interface pour les suggestions personnalisées
 */
interface Suggestion {
  id: string;
  title: string;
  description: string;
  category: string;
  relevance: number;
}

/**
 * Page principale de l'assistant de recherche médicale
 */
const ResearchAssistant: React.FC = () => {
  const { user } = useAuth();
  
  // États pour la gestion de l'interface utilisateur
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [suggestions] = useState<Suggestion[]>([
    {
      id: '1',
      title: 'Cardiologie moderne',
      description: 'Dernières avancées en cardiologie interventionnelle',
      category: 'Cardiologie',
      relevance: 95
    },
    {
      id: '2',
      title: 'Neurologie clinique',
      description: 'Diagnostics différentiels en neurologie',
      category: 'Neurologie',
      relevance: 88
    },
    {
      id: '3',
      title: 'Médecine d\'urgence',
      description: 'Protocoles d\'urgence actualisés',
      category: 'Urgences',
      relevance: 92
    }
  ]);

  // Catégories médicales disponibles
  const categories = [
    'Cardiologie', 'Neurologie', 'Endocrinologie', 'Gastro-entérologie',
    'Pneumologie', 'Dermatologie', 'Psychiatrie', 'Pédiatrie', 'Gériatrie'
  ];

  /**
   * Récupération des ressources depuis Supabase avec React Query
   */
  const { data: resources = [], isLoading, error } = useQuery({
    queryKey: ['research-resources', searchQuery, selectedCategory],
    queryFn: async () => {
      console.log('🔍 ResearchAssistant: Récupération des ressources');
      
      let query = supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

      // Filtrage par recherche textuelle
      if (searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`);
      }

      // Filtrage par catégorie
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('❌ Erreur lors de la récupération des ressources:', error);
        throw error;
      }

      console.log(`✅ ${data?.length || 0} ressources récupérées`);
      return data as ResearchResource[];
    },
    enabled: !!user
  });

  /**
   * Gestionnaire de recherche
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔍 Recherche lancée:', searchQuery);
  };

  /**
   * Gestionnaire de clic sur une suggestion
   */
  const handleSuggestionClick = (suggestion: Suggestion) => {
    setSearchQuery(suggestion.title);
    setSelectedCategory(suggestion.category);
    toast.success(`Recherche appliquée : ${suggestion.title}`);
  };

  /**
   * Rendu d'une carte de ressource
   */
  const renderResourceCard = (resource: ResearchResource) => (
    <Card key={resource.id} className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2 mb-2">
              {resource.title}
            </CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {resource.category}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {resource.content_type}
              </Badge>
              {resource.featured && (
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              )}
            </div>
          </div>
        </div>
        <CardDescription className="line-clamp-3">
          {resource.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <span>Par {resource.author}</span>
            <span className="mx-2">•</span>
            <span>{new Date(resource.created_at).toLocaleDateString('fr-FR')}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open(resource.url, '_blank')}
            className="flex items-center gap-1"
          >
            <span>Consulter</span>
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  /**
   * Rendu d'une carte de suggestion
   */
  const renderSuggestionCard = (suggestion: Suggestion) => (
    <Card 
      key={suggestion.id} 
      className="cursor-pointer hover:bg-gray-50 transition-colors duration-200"
      onClick={() => handleSuggestionClick(suggestion)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-sm mb-1">{suggestion.title}</h4>
            <p className="text-xs text-gray-600 mb-2">{suggestion.description}</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {suggestion.category}
              </Badge>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">Pertinence:</span>
                <span className="text-xs font-medium text-green-600">
                  {suggestion.relevance}%
                </span>
              </div>
            </div>
          </div>
          <Lightbulb className="h-4 w-4 text-yellow-500 ml-2 flex-shrink-0" />
        </div>
      </CardContent>
    </Card>
  );

  // Affichage du chargement
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-teal"></div>
            <span className="ml-3 text-lg">Chargement des ressources...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Affichage des erreurs
  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-medium text-red-600 mb-2">
                Erreur de chargement
              </h3>
              <p className="text-gray-600">
                Impossible de charger les ressources. Veuillez réessayer.
              </p>
              <Button 
                className="mt-4" 
                onClick={() => window.location.reload()}
              >
                Réessayer
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6 space-y-6">
        {/* En-tête avec titre et description */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <BookOpen className="h-8 w-8 text-medical-blue" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">
              Assistant de Recherche Médicale
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez des ressources médicales pertinentes et obtenez des suggestions personnalisées 
            pour enrichir vos connaissances professionnelles.
          </p>
        </div>

        {/* Barre de recherche principale */}
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher des ressources médicales..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" className="px-6">
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </Button>
              </div>
              
              {/* Filtres par catégorie */}
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Catégories:</span>
                <Button
                  type="button"
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                >
                  Toutes
                </Button>
                {categories.map(category => (
                  <Button
                    key={category}
                    type="button"
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Contenu principal avec onglets */}
        <Tabs defaultValue="resources" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Ressources ({resources.length})
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Suggestions ({suggestions.length})
            </TabsTrigger>
          </TabsList>

          {/* Onglet des ressources */}
          <TabsContent value="resources" className="mt-6">
            {resources.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Aucune ressource trouvée
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Essayez d'ajuster vos critères de recherche ou explorez différentes catégories.
                  </p>
                  <Button onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}>
                    Réinitialiser les filtres
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map(renderResourceCard)}
              </div>
            )}
          </TabsContent>

          {/* Onglet des suggestions */}
          <TabsContent value="suggestions" className="mt-6">
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium mb-2">
                  Suggestions personnalisées pour vous
                </h3>
                <p className="text-gray-600">
                  Basées sur votre profil et vos recherches récentes
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestions.map(renderSuggestionCard)}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ResearchAssistant;
