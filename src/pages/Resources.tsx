
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, Filter, BookOpen, FileText, Video, 
  Download, Eye, Heart, Share2, Plus,
  Grid, List, SortAsc, SortDesc
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/hooks/useAuth';

const Resources = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Récupération des ressources depuis Supabase
  const { data: resources, isLoading, error } = useQuery({
    queryKey: ['resources', searchTerm, selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: sortOrder === 'asc' });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const categories = [
    { id: 'all', label: 'Toutes les ressources', count: resources?.length || 0 },
    { id: 'anatomy', label: 'Anatomie', count: resources?.filter(r => r.category === 'anatomy').length || 0 },
    { id: 'physiology', label: 'Physiologie', count: resources?.filter(r => r.category === 'physiology').length || 0 },
    { id: 'pathology', label: 'Pathologie', count: resources?.filter(r => r.category === 'pathology').length || 0 },
    { id: 'pharmacology', label: 'Pharmacologie', count: resources?.filter(r => r.category === 'pharmacology').length || 0 },
  ];

  const ResourceCard = ({ resource }: { resource: any }) => (
    <Card className={`group hover:shadow-lg transition-all duration-300 h-full ${
      viewMode === 'list' ? 'flex flex-row' : 'flex flex-col'
    }`}>
      <div className={`${viewMode === 'list' ? 'w-24 sm:w-32 flex-shrink-0' : 'w-full h-32 sm:h-40'} relative overflow-hidden rounded-t-lg ${viewMode === 'list' ? 'rounded-l-lg rounded-t-none' : ''}`}>
        {resource.thumbnail_url ? (
          <img 
            src={resource.thumbnail_url} 
            alt={resource.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-medical-blue to-medical-teal flex items-center justify-center">
            <BookOpen className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
          </div>
        )}
      </div>
      
      <div className={`${viewMode === 'list' ? 'flex-1 p-3 sm:p-4' : 'p-3 sm:p-4 flex-1 flex flex-col'}`}>
        <div className="flex items-start justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            {resource.category}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Eye className="h-3 w-3" />
            <span className="hidden sm:inline">{resource.views || 0}</span>
          </div>
        </div>
        
        <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2 line-clamp-2 group-hover:text-medical-blue transition-colors">
          {resource.title}
        </h3>
        
        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2 flex-1">
          {resource.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-7 sm:h-8 px-2 sm:px-3 text-xs">
              <Eye className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Voir</span>
            </Button>
            <Button size="sm" variant="ghost" className="h-7 sm:h-8 px-2 text-xs">
              <Heart className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" className="h-7 sm:h-8 px-2 text-xs">
              <Share2 className="h-3 w-3" />
            </Button>
          </div>
          
          {resource.file_url && (
            <Button size="sm" className="h-7 sm:h-8 px-2 sm:px-3 text-xs">
              <Download className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Télécharger</span>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur de chargement</h1>
          <p className="text-gray-600">Impossible de charger les ressources. Veuillez réessayer.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
        {/* Header responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-medical-navy mb-2">
              Ressources Médicales
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Découvrez une collection complète de ressources médicales
            </p>
          </div>
          
          {user && (
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une ressource
            </Button>
          )}
        </div>

        {/* Contrôles de recherche et filtres - Responsive */}
        <div className="bg-white rounded-lg border p-4 mb-6 space-y-4">
          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher des ressources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          {/* Filtres et options d'affichage */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className="text-xs h-8"
                >
                  {cat.label}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {cat.count}
                  </Badge>
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="h-8"
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
              
              <div className="hidden sm:flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-32 sm:h-40 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : resources && resources.length > 0 ? (
          <div className={`grid gap-4 sm:gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune ressource trouvée
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Essayez de modifier vos critères de recherche'
                : 'Aucune ressource disponible pour le moment'
              }
            </p>
            {user && (
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter la première ressource
              </Button>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Resources;
