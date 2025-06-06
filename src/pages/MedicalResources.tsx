
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Video, FileText, Headphones, Plus, ExternalLink, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';
import AddResourceForm from '@/components/resources/AddResourceForm';

interface Resource {
  id: string;
  title: string;
  description?: string;
  category?: string;
  author?: string;
  language?: string;
  url: string;
  thumbnail?: string;
  content_type: 'article' | 'video' | 'podcast' | 'document' | 'course' | 'quiz';
  featured: boolean;
  is_premium: boolean;
  created_at: string;
  created_by?: string;
}

const MedicalResources: React.FC = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error loading resources:', error);
      toast.error('Erreur lors du chargement des ressources');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (contentType: string) => {
    switch (contentType) {
      case 'video': return <Video className="h-5 w-5" />;
      case 'podcast': return <Headphones className="h-5 w-5" />;
      case 'document': return <FileText className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (contentType: string) => {
    const labels: Record<string, string> = {
      article: 'Article',
      video: 'Vidéo',
      podcast: 'Podcast',
      document: 'Document',
      course: 'Cours',
      quiz: 'Quiz',
    };
    return labels[contentType] || contentType;
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.author?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(resources.map(r => r.category).filter(Boolean)));

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Chargement des ressources...</div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Ressources médicales</h1>
            <p className="text-gray-600">Accédez à une collection de ressources médicales de qualité</p>
          </div>
          {user && (
            <Button onClick={() => setShowAddForm(!showAddForm)} className="mt-4 md:mt-0">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une ressource
            </Button>
          )}
        </div>

        {showAddForm && user && (
          <div className="mb-6">
            <AddResourceForm 
              onResourceAdded={() => {
                loadResources();
                setShowAddForm(false);
              }}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher des ressources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Toutes les catégories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 text-blue-600">
                    {getIcon(resource.content_type)}
                    <span className="text-sm font-medium">{getTypeLabel(resource.content_type)}</span>
                  </div>
                  <div className="flex gap-1">
                    {resource.featured && (
                      <Badge variant="secondary" className="text-xs">
                        Recommandé
                      </Badge>
                    )}
                    {resource.is_premium && (
                      <Badge className="text-xs bg-gradient-to-r from-purple-500 to-pink-500">
                        Premium
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight">{resource.title}</CardTitle>
                {resource.author && (
                  <p className="text-sm text-gray-500">par {resource.author}</p>
                )}
              </CardHeader>
              
              {resource.thumbnail && (
                <div className="px-6 pb-3">
                  <img 
                    src={resource.thumbnail} 
                    alt={resource.title}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>
              )}
              
              <CardContent>
                {resource.description && (
                  <CardDescription className="mb-4 line-clamp-3">
                    {resource.description}
                  </CardDescription>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {resource.category && (
                      <Badge variant="outline" className="text-xs">
                        {resource.category}
                      </Badge>
                    )}
                    {resource.language && (
                      <Badge variant="outline" className="text-xs">
                        {resource.language.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                  <Button size="sm" asChild>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-1 h-3 w-3" />
                      Ouvrir
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-lg font-medium">Aucune ressource trouvée</h3>
            <p className="text-sm text-gray-500 mt-1">
              {searchTerm || selectedCategory ? 
                'Essayez de modifier vos critères de recherche' : 
                'Les ressources seront bientôt disponibles'
              }
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MedicalResources;
