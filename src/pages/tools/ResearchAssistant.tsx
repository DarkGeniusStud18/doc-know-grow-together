
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { Search, BookOpen, Copy, Download, Globe, ExternalLink, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Citation {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: string;
  doi: string;
  url: string;
  citation: string;
  abstract: string;
  type: string;
}

interface SavedSource {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  publication_year: number;
  doi: string;
  url: string;
  abstract: string;
  tags: string[];
  notes: string;
  citation_format: string;
  is_favorite: boolean;
  created_at: string;
}

const ResearchAssistant = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [citationFormat, setCitationFormat] = useState('apa');
  const [searchResults, setSearchResults] = useState<Citation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [tags, setTags] = useState<Record<string, string>>({});

  // Fetch saved sources
  const { data: savedSources = [], refetch } = useQuery({
    queryKey: ['research-sources', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('research_sources')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as SavedSource[];
    },
    enabled: !!user
  });

  // Search citations
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Veuillez entrer un terme de recherche');
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('research-citations', {
        body: { query: searchQuery, format: citationFormat }
      });

      if (error) throw error;

      setSearchResults(data.citations);
      toast.success(`${data.citations.length} citations trouvées`);
    } catch (error) {
      console.error('Error searching citations:', error);
      toast.error('Erreur lors de la recherche');
    } finally {
      setIsSearching(false);
    }
  };

  // Save source
  const saveMutation = useMutation({
    mutationFn: async (citation: Citation) => {
      if (!user) throw new Error('Non authentifié');

      const sourceData = {
        user_id: user.id,
        title: citation.title,
        authors: citation.authors.split(', '),
        journal: citation.journal,
        publication_year: parseInt(citation.year) || null,
        doi: citation.doi,
        url: citation.url,
        abstract: citation.abstract,
        tags: tags[citation.id]?.split(',').map(tag => tag.trim()).filter(Boolean) || [],
        notes: notes[citation.id] || '',
        citation_format: citation.citation,
        is_favorite: false
      };

      const { error } = await supabase
        .from('research_sources')
        .insert(sourceData);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['research-sources', user?.id] });
      toast.success('Source sauvegardée');
    },
    onError: () => {
      toast.error('Erreur lors de la sauvegarde');
    }
  });

  // Toggle favorite
  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({ id, isFavorite }: { id: string; isFavorite: boolean }) => {
      const { error } = await supabase
        .from('research_sources')
        .update({ is_favorite: !isFavorite })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['research-sources', user?.id] });
    }
  });

  // Copy citation
  const copyCitation = async (citation: string) => {
    try {
      await navigator.clipboard.writeText(citation);
      toast.success('Citation copiée');
    } catch {
      toast.error('Erreur lors de la copie');
    }
  };

  // Export all citations
  const exportCitations = () => {
    const citationsText = savedSources
      .map(source => source.citation_format)
      .join('\n\n');
    
    const blob = new Blob([citationsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'citations.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <MainLayout requireAuth={true}>
      <div className="container mx-auto py-6 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">
            Assistant de Recherche
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Recherchez et gérez vos sources académiques avec génération automatique de citations
          </p>
        </div>

        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">Recherche</TabsTrigger>
            <TabsTrigger value="saved">Sources Sauvegardées ({savedSources.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="space-y-6">
            {/* Search Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-medical-blue" />
                  Recherche de Citations
                </CardTitle>
                <CardDescription>
                  Recherchez des articles académiques et générez des citations automatiquement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Rechercher des articles académiques..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <Select value={citationFormat} onValueChange={setCitationFormat}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apa">APA</SelectItem>
                      <SelectItem value="mla">MLA</SelectItem>
                      <SelectItem value="chicago">Chicago</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleSearch} disabled={isSearching}>
                    <Search className="h-4 w-4 mr-2" />
                    {isSearching ? 'Recherche...' : 'Rechercher'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Résultats de recherche</h3>
                {searchResults.map((citation) => (
                  <Card key={citation.id} className="border-l-4 border-l-medical-blue">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-lg">{citation.title}</h4>
                          <p className="text-gray-600">{citation.authors}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{citation.journal}</Badge>
                            <Badge variant="outline">{citation.year}</Badge>
                            <Badge variant="outline">{citation.type}</Badge>
                          </div>
                        </div>
                        
                        {citation.abstract && (
                          <p className="text-sm text-gray-700 line-clamp-3">{citation.abstract}</p>
                        )}
                        
                        <div className="bg-gray-50 p-3 rounded border">
                          <p className="text-sm font-mono">{citation.citation}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`notes-${citation.id}`}>Notes</Label>
                            <Textarea
                              id={`notes-${citation.id}`}
                              placeholder="Ajoutez vos notes..."
                              value={notes[citation.id] || ''}
                              onChange={(e) => setNotes(prev => ({ ...prev, [citation.id]: e.target.value }))}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`tags-${citation.id}`}>Tags</Label>
                            <Input
                              id={`tags-${citation.id}`}
                              placeholder="tag1, tag2, tag3..."
                              value={tags[citation.id] || ''}
                              onChange={(e) => setTags(prev => ({ ...prev, [citation.id]: e.target.value }))}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            onClick={() => copyCitation(citation.citation)}
                            variant="outline"
                            size="sm"
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copier
                          </Button>
                          
                          {citation.url && (
                            <Button
                              onClick={() => window.open(citation.url, '_blank')}
                              variant="outline"
                              size="sm"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Voir l'article
                            </Button>
                          )}
                          
                          <Button
                            onClick={() => saveMutation.mutate(citation)}
                            disabled={saveMutation.isPending}
                            size="sm"
                          >
                            <BookOpen className="h-4 w-4 mr-1" />
                            Sauvegarder
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="saved" className="space-y-6">
            {/* Saved Sources */}
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Sources Sauvegardées</h3>
              {savedSources.length > 0 && (
                <Button onClick={exportCitations} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter tout
                </Button>
              )}
            </div>
            
            {savedSources.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Aucune source sauvegardée</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {savedSources.map((source) => (
                  <Card key={source.id} className="border-l-4 border-l-medical-teal">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg">{source.title}</h4>
                            <p className="text-gray-600">{source.authors.join(', ')}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline">{source.journal}</Badge>
                              <Badge variant="outline">{source.publication_year}</Badge>
                              {source.tags.map((tag) => (
                                <Badge key={tag} variant="secondary">{tag}</Badge>
                              ))}
                            </div>
                          </div>
                          <Button
                            onClick={() => toggleFavoriteMutation.mutate({ 
                              id: source.id, 
                              isFavorite: source.is_favorite 
                            })}
                            variant="ghost"
                            size="icon"
                          >
                            <Star className={`h-4 w-4 ${source.is_favorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                          </Button>
                        </div>
                        
                        {source.abstract && (
                          <p className="text-sm text-gray-700">{source.abstract}</p>
                        )}
                        
                        {source.notes && (
                          <div>
                            <strong>Notes:</strong>
                            <p className="text-sm text-gray-700 mt-1">{source.notes}</p>
                          </div>
                        )}
                        
                        <div className="bg-gray-50 p-3 rounded border">
                          <p className="text-sm font-mono">{source.citation_format}</p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            onClick={() => copyCitation(source.citation_format)}
                            variant="outline"
                            size="sm"
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copier
                          </Button>
                          
                          {source.url && (
                            <Button
                              onClick={() => window.open(source.url, '_blank')}
                              variant="outline"
                              size="sm"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Voir l'article
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ResearchAssistant;
