
/**
 * 📝 Page des Notes - Système de prise de notes personnalisées
 * Interface complète pour créer, modifier, organiser et rechercher des notes
 */

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, Search, Edit, Trash2, BookOpen, Filter,
  Calendar, Tag, FileText, Star, Archive
} from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// Interface basée sur la structure réelle de la base de données
interface Note {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Interface étendue pour l'affichage avec des propriétés virtuelles
interface ExtendedNote extends Note {
  category?: string;
  tags?: string[];
  is_favorite?: boolean;
}

const Notes: React.FC = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<ExtendedNote[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<ExtendedNote[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<ExtendedNote | null>(null);
  const [loading, setLoading] = useState(true);

  // États du formulaire
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: ''
  });

  const categories = [
    { value: 'general', label: '📋 Général', color: 'bg-gray-100' },
    { value: 'medical', label: '🏥 Médical', color: 'bg-blue-100' },
    { value: 'anatomy', label: '🫀 Anatomie', color: 'bg-red-100' },
    { value: 'pharmacology', label: '💊 Pharmacologie', color: 'bg-green-100' },
    { value: 'pathology', label: '🔬 Pathologie', color: 'bg-purple-100' },
    { value: 'surgery', label: '🔪 Chirurgie', color: 'bg-orange-100' },
    { value: 'exam', label: '📚 Examens', color: 'bg-yellow-100' }
  ];

  /**
   * 📥 Chargement des notes depuis Supabase
   */
  const loadNotes = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      // Transformation des données pour ajouter les propriétés virtuelles
      const extendedNotes: ExtendedNote[] = (data || []).map(note => ({
        ...note,
        category: 'general', // Valeur par défaut
        tags: [], // Valeur par défaut
        is_favorite: false // Valeur par défaut
      }));
      
      setNotes(extendedNotes);
      setFilteredNotes(extendedNotes);
    } catch (error) {
      console.error('Erreur lors du chargement des notes:', error);
      toast.error('Erreur lors du chargement des notes');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🔍 Filtrage et recherche des notes
   */
  const filterNotes = () => {
    let filtered = notes;

    // Filtrage par recherche
    if (searchTerm) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    // Filtrage par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(note => note.category === selectedCategory);
    }

    setFilteredNotes(filtered);
  };

  /**
   * 💾 Sauvegarde d'une note (création ou modification)
   */
  const saveNote = async () => {
    if (!user || !formData.title.trim()) {
      toast.error('Le titre est obligatoire');
      return;
    }

    try {
      const noteData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        user_id: user.id
      };

      if (editingNote) {
        // Modification d'une note existante
        const { error } = await supabase
          .from('notes')
          .update(noteData)
          .eq('id', editingNote.id);

        if (error) throw error;
        toast.success('Note modifiée avec succès');
      } else {
        // Création d'une nouvelle note
        const { error } = await supabase
          .from('notes')
          .insert([noteData]);

        if (error) throw error;
        toast.success('Note créée avec succès');
      }

      // Réinitialisation du formulaire
      setFormData({ title: '', content: '', category: 'general', tags: '' });
      setIsCreateDialogOpen(false);
      setEditingNote(null);
      loadNotes();

    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  /**
   * 🗑️ Suppression d'une note
   */
  const deleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
      
      toast.success('Note supprimée');
      loadNotes();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  /**
   * ⭐ Basculer le statut favori d'une note (simulation)
   */
  const toggleFavorite = async (noteId: string, currentStatus: boolean | undefined) => {
    // Simulation - dans une vraie implémentation, vous pourriez ajouter une colonne is_favorite
    const updatedNotes = notes.map(note => 
      note.id === noteId ? { ...note, is_favorite: !currentStatus } : note
    );
    setNotes(updatedNotes);
    setFilteredNotes(updatedNotes.filter(note => 
      selectedCategory === 'all' || note.category === selectedCategory
    ));
    toast.success(currentStatus ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  /**
   * ✏️ Préparer l'édition d'une note
   */
  const startEditing = (note: ExtendedNote) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content || '',
      category: note.category || 'general',
      tags: note.tags ? note.tags.join(', ') : ''
    });
    setIsCreateDialogOpen(true);
  };

  // Effets
  useEffect(() => {
    loadNotes();
  }, [user]);

  useEffect(() => {
    filterNotes();
  }, [searchTerm, selectedCategory, notes]);

  return (
    <MainLayout requireAuth={true}>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-medical-navy flex items-center gap-3">
              <FileText className="h-8 w-8 text-medical-blue" />
              Mes Notes
            </h1>
            <p className="text-gray-600 mt-2">
              Organisez vos notes d'étude et de recherche
            </p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-medical-blue hover:bg-medical-blue/90">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Note
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingNote ? 'Modifier la note' : 'Créer une nouvelle note'}
                </DialogTitle>
                <DialogDescription>
                  Organisez vos connaissances avec des notes structurées
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Titre de la note"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Contenu</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Contenu de votre note..."
                    rows={8}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsCreateDialogOpen(false);
                      setEditingNote(null);
                      setFormData({ title: '', content: '', category: 'general', tags: '' });
                    }}
                  >
                    Annuler
                  </Button>
                  <Button onClick={saveNote}>
                    {editingNote ? 'Modifier' : 'Créer'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher dans vos notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Liste des notes */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-teal"></div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {searchTerm ? 'Aucune note trouvée' : 'Aucune note créée'}
              </h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Commencez par créer votre première note'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => {
              const category = categories.find(cat => cat.value === note.category);
              
              return (
                <Card key={note.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2 mb-2">
                          {note.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className={category?.color}>
                            {category?.label || '📋 Général'}
                          </Badge>
                          {note.is_favorite && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(note.id, note.is_favorite)}
                        >
                          <Star className={`h-4 w-4 ${note.is_favorite ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditing(note)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNote(note.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                      {note.content || 'Aucun contenu'}
                    </p>
                    
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {note.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(note.updated_at).toLocaleDateString('fr-FR')}
                      </span>
                      <span>
                        {note.content ? note.content.length : 0} caractères
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Notes;
