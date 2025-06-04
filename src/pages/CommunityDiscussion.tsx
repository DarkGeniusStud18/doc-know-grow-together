import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/sonner';
import { Edit, Trash2, Send, MoreVertical, Clock, Users, AlertTriangle, Pin, PinOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Type définitions pour les données de la discussion
type CommunityTopic = {
  id: string;
  user_id: string; // Use user_id instead of author_id
  title: string;
  content: string;
  category: string;
  created_at: string;
  updated_at: string;
  is_pinned?: boolean; // Make optional
  author_name?: string;
}

type CommunityResponse = {
  id: string;
  user_id: string; // Use user_id instead of author_id
  topic_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_expert_response?: boolean; // Make optional
  author_name?: string;
  author_role?: string;
  author_image?: string;
}

const CommunityDiscussion = () => {
  // Récupération des paramètres d'URL et initialisation des hooks
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const responseRef = useRef<HTMLDivElement>(null);
  
  // États locaux pour la gestion du formulaire et des interactions
  const [newResponse, setNewResponse] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    content: '',
    category: ''
  });
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  // Récupération des données du sujet
  const { data: topic, isLoading: topicLoading, error: topicError } = useQuery({
    queryKey: ['communityTopic', id],
    queryFn: async () => {
      // Requête pour obtenir les détails du sujet
      const { data: topicData, error: topicError } = await supabase
        .from('community_topics')
        .select('*')
        .eq('id', id)
        .single();
        
      if (topicError) throw topicError;
      
      // Récupération des informations de l'auteur
      const { data: authorData } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', topicData.user_id) // Use user_id instead of author_id
        .single();
        
      // Préparation des données pour l'édition
      setEditData({
        title: topicData.title,
        content: topicData.content,
        category: topicData.category
      });
        
      // Retourne les données du sujet avec le nom de l'auteur
      return {
        ...topicData,
        author_name: authorData?.display_name || 'Utilisateur',
        is_pinned: topicData.is_pinned ?? false
      };
    },
    enabled: !!id
  });
  
  // Récupération des réponses au sujet
  const { data: responses = [], isLoading: responsesLoading } = useQuery({
    queryKey: ['communityResponses', id],
    queryFn: async () => {
      // Requête pour obtenir les réponses au sujet
      const { data: responsesData, error: responsesError } = await supabase
        .from('community_responses')
        .select('*')
        .eq('topic_id', id)
        .order('created_at', { ascending: true });
        
      if (responsesError) throw responsesError;
      
      // Enrichissement des données avec les informations des auteurs
      const enrichedResponses = await Promise.all(responsesData.map(async (response) => {
        // Récupération des informations de l'auteur
        const { data: authorData } = await supabase
          .from('profiles')
          .select('display_name, profile_image, role')
          .eq('id', response.user_id) // Use user_id instead of author_id
          .single();
          
        // Retourne les données de la réponse avec les informations de l'auteur
        return {
          ...response,
          author_name: authorData?.display_name || 'Utilisateur',
          author_image: authorData?.profile_image,
          author_role: authorData?.role,
          is_expert_response: response.is_expert_response ?? false
        };
      }));
      
      return enrichedResponses;
    },
    enabled: !!id
  });
  
  // Mutation pour ajouter une nouvelle réponse
  const addResponseMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error('Non authentifié');
      
      const { data, error } = await supabase
        .from('community_responses')
        .insert({
          topic_id: id,
          user_id: user.id, // Use user_id instead of author_id
          content
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Réinitialisation et rafraîchissement des données après succès
      setNewResponse('');
      queryClient.invalidateQueries({
        queryKey: ['communityResponses', id]
      });
      
      // Scroll vers la dernière réponse
      setTimeout(() => {
        responseRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
      toast.success('Réponse publiée avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la publication de la réponse');
    }
  });
  
  // Mutation pour mettre à jour un sujet
  const updateTopicMutation = useMutation({
    mutationFn: async (data: { title: string, content: string, category: string }) => {
      if (!user || !topic) throw new Error('Non authentifié ou sujet introuvable');
      
      // Vérification que l'utilisateur est l'auteur du sujet
      if (user.id !== topic.user_id) { // Use user_id instead of author_id
        throw new Error('Vous n\'êtes pas autorisé à modifier ce sujet');
      }
      
      const { error } = await supabase
        .from('community_topics')
        .update({
          title: data.title,
          content: data.content,
          category: data.category,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      // Rafraîchissement des données après succès
      queryClient.invalidateQueries({
        queryKey: ['communityTopic', id]
      });
      setEditDialogOpen(false);
      toast.success('Sujet mis à jour avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour du sujet');
    }
  });
  
  // Mutation pour supprimer un sujet
  const deleteTopicMutation = useMutation({
    mutationFn: async () => {
      if (!user || !topic) throw new Error('Non authentifié ou sujet introuvable');
      
      // Vérification que l'utilisateur est l'auteur du sujet
      if (user.id !== topic.user_id) { // Use user_id instead of author_id
        throw new Error('Vous n\'êtes pas autorisé à supprimer ce sujet');
      }
      
      const { error } = await supabase
        .from('community_topics')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      navigate('/community');
      toast.success('Sujet supprimé avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la suppression du sujet');
    }
  });
  
  // Mutation pour épingler/désépingler un sujet
  const togglePinMutation = useMutation({
    mutationFn: async () => {
      if (!user || !topic) throw new Error('Non authentifié ou sujet introuvable');
      
      // Vérification que l'utilisateur est l'auteur du sujet
      if (user.id !== topic.user_id) { // Use user_id instead of author_id
        throw new Error('Vous n\'êtes pas autorisé à modifier ce sujet');
      }
      
      const { error } = await supabase
        .from('community_topics')
        .update({
          is_pinned: !(topic.is_pinned ?? false)
        } as any)
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      // Rafraîchissement des données après succès
      queryClient.invalidateQueries({
        queryKey: ['communityTopic', id]
      });
      toast.success((topic?.is_pinned ?? false) ? 'Sujet désépinglé' : 'Sujet épinglé');
    },
    onError: () => {
      toast.error('Erreur lors de la modification du sujet');
    }
  });
  
  // Gestionnaire pour soumettre une nouvelle réponse
  const handleSubmitResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResponse.trim()) return;
    
    if (!user) {
      toast.error('Vous devez être connecté pour répondre');
      navigate('/login');
      return;
    }
    
    addResponseMutation.mutate(newResponse);
  };
  
  // Gestionnaire pour mettre à jour un sujet
  const handleUpdateTopic = () => {
    updateTopicMutation.mutate(editData);
  };
  
  // Vérifier si l'utilisateur est l'auteur du sujet (administrateur)
  const isTopicAdmin = user && topic && user.id === topic.user_id; // Use user_id instead of author_id
  
  // Effet pour détecter le défilement et afficher le bouton de défilement
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Fonction pour faire défiler vers le haut
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  if (topicLoading || responsesLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-teal"></div>
        </div>
      </MainLayout>
    );
  }
  
  if (topicError || !topic) {
    return (
      <MainLayout>
        <Card className="mb-6">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-red-500 mb-4">
              <AlertTriangle className="h-16 w-16" />
            </div>
            <h2 className="text-xl font-medium mb-2">Sujet introuvable</h2>
            <p className="text-gray-500 mb-6">Le sujet que vous cherchez n'existe pas ou a été supprimé</p>
            <Button onClick={() => navigate('/community')}>
              Retourner à la communauté
            </Button>
          </CardContent>
        </Card>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="space-y-6 pb-10">
        {/* En-tête du sujet avec titre et options d'admin */}
        <div className="flex justify-between items-start">
          <Button
            variant="outline"
            size="sm"
            className="mb-4"
            onClick={() => navigate('/community')}
          >
            &larr; Retour aux discussions
          </Button>
          
          {isTopicAdmin && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => togglePinMutation.mutate()}
              >
                {(topic.is_pinned ?? false) ? 
                  <><PinOff className="h-4 w-4 mr-1" /> Désépingler</> :
                  <><Pin className="h-4 w-4 mr-1" /> Épingler</>
                }
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setEditDialogOpen(true)}
              >
                <Edit className="h-4 w-4 mr-1" /> Modifier
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => {
                  if (window.confirm('Êtes-vous sûr de vouloir supprimer ce sujet ? Cette action est irréversible.')) {
                    deleteTopicMutation.mutate();
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Supprimer
              </Button>
            </div>
          )}
        </div>
        
        {/* Carte principale du sujet */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <Badge className="mb-2">{topic.category}</Badge>
                {(topic.is_pinned ?? false) && (
                  <Badge variant="secondary" className="ml-2">
                    <Pin className="h-3 w-3 mr-1" />
                    Épinglé
                  </Badge>
                )}
                <CardTitle className="text-2xl">{topic.title}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src="/placeholder.svg" alt={topic.author_name} />
                  <AvatarFallback>
                    {topic.author_name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{topic.author_name}</span>
              </div>
              <span>•</span>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{new Date(topic.created_at).toLocaleDateString('fr-FR', { 
                  day: 'numeric', month: 'long', year: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })}</span>
              </div>
            </div>
            
            <div className="prose max-w-none">
              {topic.content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Section des réponses */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            Réponses
            <Badge variant="outline" className="ml-2">
              {responses.length}
            </Badge>
          </h2>
          
          {responses.length > 0 ? (
            <div className="space-y-4">
              {responses.map((response) => (
                <Card key={response.id} className="border-l-4 border-l-medical-teal">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar>
                          <AvatarImage 
                            src={response.author_image || "/placeholder.svg"} 
                            alt={response.author_name} 
                          />
                          <AvatarFallback>
                            {response.author_name?.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{response.author_name}</div>
                          <div className="text-xs text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(response.created_at).toLocaleString('fr-FR', {
                              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                            })}
                            {response.author_role === 'professional' && (
                              <Badge className="ml-2 bg-blue-500">Médecin</Badge>
                            )}
                            {(response.is_expert_response ?? false) && (
                              <Badge className="ml-2 bg-green-500">Expert</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-gray-700 whitespace-pre-wrap">
                      {response.content}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                <p>Aucune réponse pour le moment. Soyez le premier à répondre !</p>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Formulaire pour ajouter une nouvelle réponse */}
        <Card ref={responseRef}>
          <CardHeader>
            <CardTitle className="text-lg">Votre réponse</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitResponse}>
              <Textarea
                placeholder="Rédigez votre réponse..."
                className="min-h-[120px]"
                value={newResponse}
                onChange={(e) => setNewResponse(e.target.value)}
                required
              />
              <div className="flex justify-end mt-4">
                <Button 
                  type="submit"
                  disabled={!user || addResponseMutation.isPending}
                  className="flex items-center"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {addResponseMutation.isPending ? 'Envoi...' : 'Envoyer ma réponse'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        {/* Bouton pour remonter en haut de la page */}
        {showScrollButton && (
          <Button
            className="fixed bottom-6 right-6 rounded-full p-3 shadow-lg"
            onClick={scrollToTop}
          >
            ↑
          </Button>
        )}
      </div>
      
      {/* Dialogue pour modifier le sujet */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier le sujet</DialogTitle>
            <DialogDescription>
              Apportez des modifications à votre sujet de discussion
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-title" className="text-sm font-medium">Titre</label>
              <Input 
                id="edit-title" 
                value={editData.title}
                onChange={(e) => setEditData({...editData, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-content" className="text-sm font-medium">Contenu</label>
              <Textarea 
                id="edit-content" 
                className="min-h-[200px]"
                value={editData.content}
                onChange={(e) => setEditData({...editData, content: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Annuler</Button>
            <Button 
              onClick={handleUpdateTopic}
              disabled={!editData.title || !editData.content || updateTopicMutation.isPending}
            >
              {updateTopicMutation.isPending ? 'Mise à jour...' : 'Mettre à jour'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default CommunityDiscussion;
