
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Search, FileText, Link, Database, Plus, Trash2, Star, StarOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';

interface ResearchSource {
  id: string;
  title: string;
  authors: string[];
  publication_year?: number;
  journal?: string;
  doi?: string;
  url?: string;
  abstract?: string;
  tags: string[];
  notes?: string;
  citation_format?: string;
  is_favorite: boolean;
  created_at: string;
}

const ResearchAssistant: React.FC = () => {
  const { user } = useAuth();
  const [sources, setSources] = useState<ResearchSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newSource, setNewSource] = useState({
    title: '',
    authors: '',
    publication_year: '',
    journal: '',
    doi: '',
    url: '',
    abstract: '',
    tags: '',
    notes: '',
  });

  useEffect(() => {
    if (user) {
      loadSources();
    }
  }, [user]);

  const loadSources = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('research_sources')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading sources:', error);
      toast.error('Erreur lors du chargement des sources');
    } else {
      setSources(data || []);
    }
    setLoading(false);
  };

  const createSource = async () => {
    if (!user || !newSource.title.trim()) {
      toast.error('Veuillez remplir au moins le titre');
      return;
    }

    const sourceData = {
      user_id: user.id,
      title: newSource.title,
      authors: newSource.authors ? newSource.authors.split(',').map(a => a.trim()) : [],
      publication_year: newSource.publication_year ? parseInt(newSource.publication_year) : null,
      journal: newSource.journal || null,
      doi: newSource.doi || null,
      url: newSource.url || null,
      abstract: newSource.abstract || null,
      tags: newSource.tags ? newSource.tags.split(',').map(t => t.trim()) : [],
      notes: newSource.notes || null,
    };

    const { error } = await supabase
      .from('research_sources')
      .insert(sourceData);

    if (error) {
      console.error('Error creating source:', error);
      toast.error('Erreur lors de la création de la source');
    } else {
      toast.success('Source ajoutée !');
      setNewSource({
        title: '',
        authors: '',
        publication_year: '',
        journal: '',
        doi: '',
        url: '',
        abstract: '',
        tags: '',
        notes: '',
      });
      setShowForm(false);
      loadSources();
    }
  };

  const toggleFavorite = async (sourceId: string, currentFavorite: boolean) => {
    const { error } = await supabase
      .from('research_sources')
      .update({ is_favorite: !currentFavorite })
      .eq('id', sourceId);

    if (error) {
      console.error('Error updating favorite:', error);
      toast.error('Erreur lors de la mise à jour');
    } else {
      loadSources();
    }
  };

  const deleteSource = async (sourceId: string) => {
    const { error } = await supabase
      .from('research_sources')
      .delete()
      .eq('id', sourceId);

    if (error) {
      console.error('Error deleting source:', error);
      toast.error('Erreur lors de la suppression');
    } else {
      toast.success('Source supprimée');
      loadSources();
    }
  };

  const generateCitation = (source: ResearchSource, format: 'apa' | 'mla' = 'apa') => {
    const authors = source.authors.join(', ');
    const year = source.publication_year || 'n.d.';
    
    if (format === 'apa') {
      return `${authors} (${year}). ${source.title}. ${source.journal || 'Source inconnue'}.`;
    } else {
      return `${authors}. "${source.title}." ${source.journal || 'Source inconnue'}, ${year}.`;
    }
  };

  const filteredSources = sources.filter(source =>
    source.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    source.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase())) ||
    source.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <MainLayout requireAuth={true}>
        <div className="container mx-auto py-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Chargement...</div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout requireAuth={true}>
      <div className="container mx-auto py-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="h-8 w-8 text-medical-blue" />
          <div>
            <h1 className="text-2xl font-bold">Assistant de recherche</h1>
            <p className="text-gray-500">Gérez vos sources de recherche et générez des citations</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Rechercher dans vos sources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Source
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Ajouter une nouvelle source</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Titre de l'article/livre"
                value={newSource.title}
                onChange={(e) => setNewSource({ ...newSource, title: e.target.value })}
              />
              <Input
                placeholder="Auteurs (séparés par des virgules)"
                value={newSource.authors}
                onChange={(e) => setNewSource({ ...newSource, authors: e.target.value })}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Année de publication"
                  value={newSource.publication_year}
                  onChange={(e) => setNewSource({ ...newSource, publication_year: e.target.value })}
                />
                <Input
                  placeholder="Journal/Revue"
                  value={newSource.journal}
                  onChange={(e) => setNewSource({ ...newSource, journal: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="DOI"
                  value={newSource.doi}
                  onChange={(e) => setNewSource({ ...newSource, doi: e.target.value })}
                />
                <Input
                  placeholder="URL"
                  value={newSource.url}
                  onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                />
              </div>
              <Textarea
                placeholder="Résumé/Abstract"
                value={newSource.abstract}
                onChange={(e) => setNewSource({ ...newSource, abstract: e.target.value })}
              />
              <Input
                placeholder="Tags (séparés par des virgules)"
                value={newSource.tags}
                onChange={(e) => setNewSource({ ...newSource, tags: e.target.value })}
              />
              <Textarea
                placeholder="Notes personnelles"
                value={newSource.notes}
                onChange={(e) => setNewSource({ ...newSource, notes: e.target.value })}
              />
              <div className="flex gap-2">
                <Button onClick={createSource}>Ajouter la source</Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>Annuler</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSources.map((source) => (
            <Card key={source.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{source.title}</CardTitle>
                    <CardDescription>
                      {source.authors.join(', ')} 
                      {source.publication_year && ` (${source.publication_year})`}
                      {source.journal && ` - ${source.journal}`}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFavorite(source.id, source.is_favorite)}
                    >
                      {source.is_favorite ? 
                        <Star className="h-4 w-4 text-yellow-500 fill-current" /> : 
                        <StarOff className="h-4 w-4 text-gray-400" />
                      }
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:bg-red-50"
                      onClick={() => deleteSource(source.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {source.abstract && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 line-clamp-3">{source.abstract}</p>
                  </div>
                )}
                
                {source.tags.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {source.tags.map((tag, index) => (
                        <span key={index} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {source.notes && (
                  <div className="mb-3">
                    <p className="text-sm font-medium">Notes:</p>
                    <p className="text-sm text-gray-600">{source.notes}</p>
                  </div>
                )}

                <div className="mb-3">
                  <p className="text-sm font-medium mb-1">Citation APA:</p>
                  <p className="text-xs bg-gray-50 p-2 rounded italic">
                    {generateCitation(source, 'apa')}
                  </p>
                </div>

                <div className="flex gap-2 text-xs">
                  {source.doi && (
                    <a 
                      href={`https://doi.org/${source.doi}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      DOI
                    </a>
                  )}
                  {source.url && (
                    <a 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      URL
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSources.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-lg font-medium">
              {searchTerm ? 'Aucune source trouvée' : 'Aucune source'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {searchTerm ? 'Essayez un autre terme de recherche' : 'Commencez par ajouter votre première source de recherche !'}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ResearchAssistant;
