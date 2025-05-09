import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { Search, Plus, MessageSquare, Users, Pin, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type CommunityTopic = {
  id: string;
  author_id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  updated_at: string;
  is_pinned: boolean;
  author_name?: string;
  response_count?: number;
};

// Categories for community topics
const TOPIC_CATEGORIES = [
  'Discussion générale',
  'Questions cliniques',
  'Actualités médicales',
  'Études et formation',
  'Outils et ressources',
  'Carrière et orientation',
  'Événements'
];

const Community: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('recent');
  const [showDialog, setShowDialog] = useState(false);
  const queryClient = useQueryClient();
  
  const [topicForm, setTopicForm] = useState({
    title: '',
    content: '',
    category: ''
  });

  const fetchTopics = async () => {
    // Modified query to properly join with profiles table
    const { data, error } = await supabase
      .from('community_topics')
      .select(`
        *,
        profiles(display_name),
        responses:community_responses(id)
      `)
      .order('created_at', { ascending: false });
      
    if (error) {
      throw new Error(`Error fetching topics: ${error.message}`);
    }
    
    return data.map(topic => ({
      ...topic,
      author_name: topic.profiles?.display_name,
      response_count: topic.responses ? topic.responses.length : 0
    }));
  };

  const { data: topics = [], isLoading, error } = useQuery({
    queryKey: ['communityTopics'],
    queryFn: fetchTopics
  });

  const createTopicMutation = useMutation({
    mutationFn: async (topic: { title: string, content: string, category: string }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('community_topics')
        .insert({
          author_id: user.id,
          title: topic.title,
          content: topic.content,
          category: topic.category
        });
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityTopics'] });
      toast.success('Sujet créé avec succès');
      setShowDialog(false);
      setTopicForm({
        title: '',
        content: '',
        category: ''
      });
    },
    onError: (error) => {
      console.error('Error creating topic:', error);
      toast.error('Erreur lors de la création du sujet');
    }
  });

  const handleCreateTopic = () => {
    if (!user) {
      toast.error('Vous devez être connecté pour créer un sujet');
      navigate('/login');
      return;
    }
    
    createTopicMutation.mutate({
      title: topicForm.title,
      content: topicForm.content,
      category: topicForm.category
    });
  };

  // Filter topics based on search, category, and tab
  const filteredTopics = topics.filter(topic => {
    const matchesQuery = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        topic.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || topic.category === activeCategory;
    
    return matchesQuery && matchesCategory;
  });

  // Sort topics based on active tab
  const sortedTopics = [...filteredTopics].sort((a, b) => {
    if (activeTab === 'pinned') {
      // Show pinned topics first
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
    }
    
    if (activeTab === 'recent') {
      // Sort by created_at (most recent first)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    
    if (activeTab === 'popular') {
      // Sort by response count (most responses first)
      return (b.response_count || 0) - (a.response_count || 0);
    }
    
    return 0;
  });
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-medical-navy">Communauté</h1>
            <p className="text-gray-500 mt-1">
              Échangez avec d'autres étudiants et professionnels de santé
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher des sujets..."
                className="pl-9 w-full sm:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau sujet
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Créer un nouveau sujet</DialogTitle>
                  <DialogDescription>
                    Partagez une question ou une information avec la communauté
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre</Label>
                    <Input 
                      id="title" 
                      placeholder="Titre de votre sujet"
                      value={topicForm.title}
                      onChange={(e) => setTopicForm({...topicForm, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie</Label>
                    <Select value={topicForm.category} onValueChange={(value) => setTopicForm({...topicForm, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {TOPIC_CATEGORIES.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Contenu</Label>
                    <Textarea 
                      id="content" 
                      placeholder="Contenu de votre sujet..."
                      className="min-h-[200px]"
                      value={topicForm.content}
                      onChange={(e) => setTopicForm({...topicForm, content: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDialog(false)}>Annuler</Button>
                  <Button 
                    onClick={handleCreateTopic}
                    disabled={!topicForm.title || !topicForm.content || !topicForm.category || createTopicMutation.isPending}
                  >
                    {createTopicMutation.isPending ? 'Publication en cours...' : 'Publier'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Catégories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant={activeCategory === 'all' ? "default" : "ghost"}
                  className="w-full justify-start text-sm h-9"
                  onClick={() => setActiveCategory('all')}
                >
                  Toutes les catégories
                </Button>
                {TOPIC_CATEGORIES.map(category => {
                  const categoryTopics = topics.filter(topic => topic.category === category);
                  if (categoryTopics.length === 0) return null;
                  
                  return (
                    <Button 
                      key={category}
                      variant={activeCategory === category ? "default" : "ghost"}
                      className="w-full justify-between text-sm h-9"
                      onClick={() => setActiveCategory(category)}
                    >
                      <span>{category}</span>
                      <span className="bg-gray-100 text-gray-700 px-2 rounded-full text-xs">
                        {categoryTopics.length}
                      </span>
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>
          
          <div className="flex-1">
            <Tabs defaultValue="recent" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-between items-center mb-6">
                <TabsList>
                  <TabsTrigger value="recent" className="text-sm">Récents</TabsTrigger>
                  <TabsTrigger value="popular" className="text-sm">Populaires</TabsTrigger>
                  <TabsTrigger value="pinned" className="text-sm">Épinglés</TabsTrigger>
                </TabsList>
                
                <span className="text-sm text-gray-500">
                  {filteredTopics.length} sujet(s)
                </span>
              </div>
              
              <TabsContent value="recent" className="mt-0">
                <TopicsList 
                  topics={sortedTopics} 
                  isLoading={isLoading} 
                  error={error ? String(error) : null}
                  onCreateTopic={() => setShowDialog(true)}
                />
              </TabsContent>
              
              <TabsContent value="popular" className="mt-0">
                <TopicsList 
                  topics={sortedTopics} 
                  isLoading={isLoading} 
                  error={error ? String(error) : null}
                  onCreateTopic={() => setShowDialog(true)}
                />
              </TabsContent>
              
              <TabsContent value="pinned" className="mt-0">
                <TopicsList 
                  topics={sortedTopics} 
                  isLoading={isLoading} 
                  error={error ? String(error) : null}
                  onCreateTopic={() => setShowDialog(true)}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

interface TopicsListProps {
  topics: CommunityTopic[];
  isLoading: boolean;
  error: string | null;
  onCreateTopic: () => void;
}

const TopicsList: React.FC<TopicsListProps> = ({ topics, isLoading, error, onCreateTopic }) => {
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-teal"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h3 className="text-xl font-medium">Erreur lors du chargement des sujets</h3>
          <p className="text-gray-500 mt-2">Veuillez réessayer plus tard</p>
        </CardContent>
      </Card>
    );
  }
  
  if (topics.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="bg-gray-100 rounded-full p-6 mb-4">
            <MessageSquare className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium">Aucun sujet trouvé</h3>
          <p className="text-gray-500 mt-2">Soyez le premier à créer un sujet de discussion</p>
          <Button className="mt-6" onClick={onCreateTopic}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau sujet
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {topics.map((topic) => (
        <Card key={topic.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap justify-between items-start gap-2">
              <Badge variant="outline" className="mb-2">
                {topic.category}
              </Badge>
              
              <div className="flex items-center space-x-2">
                {topic.is_pinned && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Pin className="h-3 w-3" />
                    Épinglé
                  </Badge>
                )}
              </div>
            </div>
            <CardTitle className="text-lg">{topic.title}</CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-gray-700 line-clamp-2 mb-4">{topic.content}</p>
            
            <div className="flex flex-wrap justify-between items-center text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1 opacity-70" />
                  <span>{topic.author_name || 'Utilisateur'}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 opacity-70" />
                  <span>{new Date(topic.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
              
              <div className="flex items-center mt-2 sm:mt-0">
                <MessageSquare className="h-4 w-4 mr-1 opacity-70" />
                <span>{topic.response_count || 0} réponse{topic.response_count !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate(`/community/${topic.id}`)}
            >
              Voir la discussion
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Community;
