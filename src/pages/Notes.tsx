
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
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Clock, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type Note = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string | null;
  created_at: string;
  updated_at: string;
};

// Categories for notes
const NOTE_CATEGORIES = [
  'Cours',
  'Examens',
  'Clinique',
  'Recherche',
  'Bibliographie',
  'Personnel',
  'Autre'
];

const Notes: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const queryClient = useQueryClient();
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  
  const [noteForm, setNoteForm] = useState({
    title: '',
    content: '',
    category: ''
  });

  const fetchNotes = async () => {
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });
      
    if (error) {
      throw new Error(`Error fetching notes: ${error.message}`);
    }
    
    return data as Note[];
  };

  const { data: notes = [], isLoading, error } = useQuery({
    queryKey: ['notes', user?.id],
    queryFn: fetchNotes,
    enabled: !!user
  });

  const createNoteMutation = useMutation({
    mutationFn: async (note: { title: string, content: string, category: string }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('notes')
        .insert({
          user_id: user.id,
          title: note.title,
          content: note.content,
          category: note.category || null
        });
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', user?.id] });
      toast.success('Note créée avec succès');
      setShowCreateDialog(false);
      resetForm();
    },
    onError: (error) => {
      console.error('Error creating note:', error);
      toast.error('Erreur lors de la création de la note');
    }
  });

  const updateNoteMutation = useMutation({
    mutationFn: async (note: { id: string, title: string, content: string, category: string }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('notes')
        .update({
          title: note.title,
          content: note.content,
          category: note.category || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', note.id)
        .eq('user_id', user.id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', user?.id] });
      toast.success('Note mise à jour avec succès');
      setShowEditDialog(false);
      resetForm();
    },
    onError: (error) => {
      console.error('Error updating note:', error);
      toast.error('Erreur lors de la mise à jour de la note');
    }
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId)
        .eq('user_id', user.id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', user?.id] });
      toast.success('Note supprimée avec succès');
    },
    onError: (error) => {
      console.error('Error deleting note:', error);
      toast.error('Erreur lors de la suppression de la note');
    }
  });

  const filteredNotes = notes.filter(note => {
    const matchesQuery = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = activeCategory === 'all' || note.category === activeCategory;
    
    return matchesQuery && matchesCategory;
  });

  const handleCreateNote = () => {
    createNoteMutation.mutate({
      title: noteForm.title,
      content: noteForm.content,
      category: noteForm.category
    });
  };

  const handleUpdateNote = () => {
    if (!currentNote) return;
    
    updateNoteMutation.mutate({
      id: currentNote.id,
      title: noteForm.title,
      content: noteForm.content,
      category: noteForm.category
    });
  };

  const handleDeleteNote = (noteId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      deleteNoteMutation.mutate(noteId);
    }
  };

  const openEditDialog = (note: Note) => {
    setCurrentNote(note);
    setNoteForm({
      title: note.title,
      content: note.content || '',
      category: note.category || ''
    });
    setShowEditDialog(true);
  };

  const resetForm = () => {
    setNoteForm({
      title: '',
      content: '',
      category: ''
    });
    setCurrentNote(null);
  };
  
  if (!user) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-semibold mb-4">Connexion requise</h1>
          <p className="text-gray-600 mb-6">Veuillez vous connecter pour accéder à vos notes.</p>
          <Button onClick={() => navigate('/login')}>Se connecter</Button>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-medical-navy">Mes Notes</h1>
            <p className="text-gray-500 mt-1">
              Gérez vos notes personnelles et professionnelles
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher dans vos notes..."
                className="pl-9 w-full sm:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Dialog open={showCreateDialog} onOpenChange={(open) => {
              setShowCreateDialog(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle note
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Créer une nouvelle note</DialogTitle>
                  <DialogDescription>
                    Ajoutez une note personnelle ou professionnelle
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre</Label>
                    <Input 
                      id="title" 
                      placeholder="Titre de votre note"
                      value={noteForm.title}
                      onChange={(e) => setNoteForm({...noteForm, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie (optionnelle)</Label>
                    <Select value={noteForm.category} onValueChange={(value) => setNoteForm({...noteForm, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {NOTE_CATEGORIES.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Contenu</Label>
                    <Textarea 
                      id="content" 
                      placeholder="Contenu de votre note..."
                      className="min-h-[200px]"
                      value={noteForm.content}
                      onChange={(e) => setNoteForm({...noteForm, content: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Annuler</Button>
                  <Button 
                    onClick={handleCreateNote}
                    disabled={!noteForm.title || createNoteMutation.isPending}
                  >
                    {createNoteMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={showEditDialog} onOpenChange={(open) => {
              setShowEditDialog(open);
              if (!open) resetForm();
            }}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Modifier la note</DialogTitle>
                  <DialogDescription>
                    Mettez à jour les informations de votre note
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Titre</Label>
                    <Input 
                      id="edit-title" 
                      placeholder="Titre de votre note"
                      value={noteForm.title}
                      onChange={(e) => setNoteForm({...noteForm, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-category">Catégorie (optionnelle)</Label>
                    <Select value={noteForm.category} onValueChange={(value) => setNoteForm({...noteForm, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {NOTE_CATEGORIES.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-content">Contenu</Label>
                    <Textarea 
                      id="edit-content" 
                      placeholder="Contenu de votre note..."
                      className="min-h-[200px]"
                      value={noteForm.content}
                      onChange={(e) => setNoteForm({...noteForm, content: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowEditDialog(false)}>Annuler</Button>
                  <Button 
                    onClick={handleUpdateNote}
                    disabled={!noteForm.title || updateNoteMutation.isPending}
                  >
                    {updateNoteMutation.isPending ? 'Mise à jour...' : 'Mettre à jour'}
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
                {NOTE_CATEGORIES.map(category => {
                  const categoryNotes = notes.filter(note => note.category === category);
                  if (categoryNotes.length === 0) return null;
                  
                  return (
                    <Button 
                      key={category}
                      variant={activeCategory === category ? "default" : "ghost"}
                      className="w-full justify-between text-sm h-9"
                      onClick={() => setActiveCategory(category)}
                    >
                      <span>{category}</span>
                      <span className="bg-gray-100 text-gray-700 px-2 rounded-full text-xs">
                        {categoryNotes.length}
                      </span>
                    </Button>
                  );
                })}
                {notes.filter(note => !note.category).length > 0 && (
                  <Button 
                    variant={activeCategory === 'null' ? "default" : "ghost"}
                    className="w-full justify-between text-sm h-9"
                    onClick={() => setActiveCategory('null')}
                  >
                    <span>Non classées</span>
                    <span className="bg-gray-100 text-gray-700 px-2 rounded-full text-xs">
                      {notes.filter(note => !note.category).length}
                    </span>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-teal"></div>
              </div>
            ) : error ? (
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
                  <h3 className="text-xl font-medium">Erreur lors du chargement des notes</h3>
                  <p className="text-gray-500 mt-2">Veuillez réessayer plus tard</p>
                </CardContent>
              </Card>
            ) : filteredNotes.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="bg-gray-100 rounded-full p-6 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium">Aucune note trouvée</h3>
                  <p className="text-gray-500 mt-2">
                    {searchQuery || activeCategory !== 'all' 
                      ? "Aucune note ne correspond à vos critères de recherche." 
                      : "Vous n'avez pas encore créé de notes."}
                  </p>
                  <Button className="mt-6" onClick={() => setShowCreateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer votre première note
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredNotes.map((note) => (
                  <Card key={note.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        {note.category && (
                          <Badge variant="outline" className="mb-2">
                            <Tag className="h-3 w-3 mr-1" />
                            {note.category}
                          </Badge>
                        )}
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => openEditDialog(note)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteNote(note.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{note.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p className="text-gray-700 line-clamp-3">{note.content}</p>
                    </CardContent>
                    <CardFooter className="pt-0 text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        Modifié le {new Date(note.updated_at).toLocaleString('fr-FR')}
                      </span>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Notes;
