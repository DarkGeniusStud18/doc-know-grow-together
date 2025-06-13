
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { Plus, Edit, Trash2, Search, FileText } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const Notes: React.FC = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Erreur lors du chargement des notes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    if (!formData.title.trim()) {
      toast.error('Le titre est requis');
      return;
    }

    try {
      if (editingNote) {
        // Update existing note
        const { error } = await supabase
          .from('notes')
          .update({
            title: formData.title,
            content: formData.content,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingNote.id)
          .eq('user_id', user.id);

        if (error) throw error;
        toast.success('Note mise à jour avec succès');
      } else {
        // Create new note
        const { error } = await supabase
          .from('notes')
          .insert({
            user_id: user.id,
            title: formData.title,
            content: formData.content
          });

        if (error) throw error;
        toast.success('Note créée avec succès');
      }

      setShowDialog(false);
      setEditingNote(null);
      setFormData({ title: '', content: '' });
      fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content
    });
    setShowDialog(true);
  };

  const handleDelete = async (noteId: string) => {
    if (!user) return;
    
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId)
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success('Note supprimée avec succès');
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleNewNote = () => {
    setEditingNote(null);
    setFormData({ title: '', content: '' });
    setShowDialog(true);
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <MainLayout requireAuth={true}>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <p className="text-lg">Chargement des notes...</p>
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
            <h1 className="text-3xl font-bold text-medical-navy">Mes Notes</h1>
            <p className="text-gray-600 mt-2">
              Organisez vos notes d'étude et de recherche
            </p>
          </div>
          
          <Button onClick={handleNewNote}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle note
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher dans vos notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Notes Grid */}
        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <Card key={note.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(note)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(note.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    {new Date(note.updated_at).toLocaleDateString('fr-FR')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 line-clamp-4">
                    {note.content || 'Aucun contenu'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Aucune note trouvée' : 'Aucune note'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? 'Essayez avec d\'autres mots-clés' : 'Commencez par créer votre première note'}
            </p>
            {!searchTerm && (
              <Button onClick={handleNewNote}>
                <Plus className="h-4 w-4 mr-2" />
                Créer ma première note
              </Button>
            )}
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingNote ? 'Modifier la note' : 'Nouvelle note'}
              </DialogTitle>
              <DialogDescription>
                {editingNote ? 'Modifiez votre note' : 'Créez une nouvelle note pour organiser vos idées'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Titre de la note..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Contenu</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Contenu de la note..."
                  className="min-h-[300px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Annuler
              </Button>
              <Button onClick={handleSubmit} disabled={!formData.title.trim()}>
                {editingNote ? 'Mettre à jour' : 'Créer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Notes;
