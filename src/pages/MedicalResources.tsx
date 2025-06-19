/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ResourceCreator from '@/components/resources/ResourceCreator';
import ResourceEditor from '@/components/resources/ResourceEditor';
import EditNotifications from '@/components/notifications/EditNotifications';
import { Search, ExternalLink, FileText, BookOpen, Filter, Eye } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MedicalResources: React.FC = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewType, setViewType] = useState<'all' | 'resources' | 'articles'>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch external resources
      const { data: resourcesData, error: resourcesError } = await supabase
        .from('resources')
        .select(`
          *,
          profiles:created_by (display_name)
        `)
        .order('created_at', { ascending: false });

      if (resourcesError) throw resourcesError;

      // Fetch articles
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select(`
          *,
          profiles:author_id (display_name)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (articlesError) throw articlesError;

      setResources(resourcesData || []);
      setArticles(articlesData || []);
    } catch (error: any) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewArticle = async (articleId: string) => {
    try {
      // Increment view count using RPC or direct update
      const { data: currentArticle } = await supabase
        .from('articles')
        .select('views_count')
        .eq('id', articleId)
        .single();

      if (currentArticle) {
        await supabase
          .from('articles')
          .update({ views_count: (currentArticle.views_count || 0) + 1 })
          .eq('id', articleId);
      }

      fetchData(); // Refresh to show updated view count
    } catch (error) {
      console.error('Error updating view count:', error);
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'cardiologie', label: 'Cardiologie' },
    { value: 'neurologie', label: 'Neurologie' },
    { value: 'pediatrie', label: 'Pédiatrie' },
    { value: 'chirurgie', label: 'Chirurgie' },
    { value: 'medecine_generale', label: 'Médecine générale' },
    { value: 'pharmacologie', label: 'Pharmacologie' },
    { value: 'anatomie', label: 'Anatomie' },
    { value: 'autre', label: 'Autre' }
  ];

  if (loading) {
    return (
      <MainLayout requireAuth={true}>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <p className="text-lg">Chargement des ressources...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout requireAuth={true}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-medical-navy">Ressources Médicales</h1>
            <p className="text-gray-600 mt-2">
              Découvrez et partagez des ressources médicales de qualité
            </p>
          </div>
          {user && <EditNotifications />}
        </div>

        {user && <ResourceCreator onResourceCreated={fetchData} />}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher des ressources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={viewType} onValueChange={(value: any) => setViewType(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tout voir</SelectItem>
              <SelectItem value="resources">Ressources externes</SelectItem>
              <SelectItem value="articles">Articles</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* External Resources */}
          {(viewType === 'all' || viewType === 'resources') && filteredResources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ExternalLink className="h-5 w-5 text-medical-teal" />
                    {resource.title}
                  </CardTitle>
                  {user?.role === 'professional' && (
                    <ResourceEditor
                      resource={resource}
                      type="resource"
                      onEditComplete={fetchData}
                    />
                  )}
                </div>
                <CardDescription>{resource.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {resource.category && (
                    <Badge variant="secondary">
                      {categories.find(c => c.value === resource.category)?.label || resource.category}
                    </Badge>
                  )}
                  
                  {resource.author && (
                    <p className="text-sm text-gray-600">
                      <strong>Auteur:</strong> {resource.author}
                    </p>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    Ajouté par {resource.profiles?.display_name} le{' '}
                    {new Date(resource.created_at).toLocaleDateString('fr-FR')}
                    {resource.edit_count > 0 && (
                      <span className="ml-2">• {resource.edit_count} modification(s)</span>
                    )}
                  </div>
                  
                  <Button asChild className="w-full">
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Accéder à la ressource
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Articles */}
          {(viewType === 'all' || viewType === 'articles') && filteredArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-medical-blue" />
                    {article.title}
                  </CardTitle>
                  {user?.role === 'professional' && (
                    <ResourceEditor
                      resource={article}
                      type="article"
                      onEditComplete={fetchData}
                    />
                  )}
                </div>
                <CardDescription>{article.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {article.category && (
                    <Badge variant="secondary">
                      {categories.find(c => c.value === article.category)?.label || article.category}
                    </Badge>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {article.reading_time && (
                      <span>{article.reading_time} min de lecture</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {article.views_count || 0}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Par {article.profiles?.display_name} le{' '}
                    {new Date(article.created_at).toLocaleDateString('fr-FR')}
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => handleViewArticle(article.id)}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Lire l'article
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredResources.length === 0 && filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune ressource trouvée
            </h3>
            <p className="text-gray-500">
              Essayez de modifier vos filtres ou ajoutez une nouvelle ressource.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MedicalResources;
