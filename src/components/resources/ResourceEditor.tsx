
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';
import { Edit, Save } from 'lucide-react';

interface ResourceEditorProps {
  resource: any;
  type: 'article' | 'resource';
  onEditComplete: () => void;
}

const ResourceEditor: React.FC<ResourceEditorProps> = ({ resource, type, onEditComplete }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editSummary, setEditSummary] = useState('');
  
  const [editData, setEditData] = useState({
    title: resource.title || '',
    content: resource.content || '',
    description: resource.description || '',
    category: resource.category || ''
  });

  // Vérifier si l'utilisateur est un professionnel de santé
  const canEdit = user?.role === 'professional';

  if (!canEdit) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const changes = {};
      const originalData = {
        title: resource.title,
        content: resource.content,
        description: resource.description,
        category: resource.category
      };

      // Détecter les changements
      Object.keys(editData).forEach(key => {
        if (editData[key] !== originalData[key]) {
          changes[key] = {
            old: originalData[key],
            new: editData[key]
          };
        }
      });

      if (Object.keys(changes).length === 0) {
        toast.info('Aucune modification détectée');
        setIsOpen(false);
        return;
      }

      // Mettre à jour la ressource/article
      const table = type === 'article' ? 'articles' : 'resources';
      const { error: updateError } = await supabase
        .from(table)
        .update({
          ...editData,
          last_edited_by: user.id,
          last_edited_at: new Date().toISOString(),
          ...(type === 'resource' && { edit_count: (resource.edit_count || 0) + 1 })
        })
        .eq('id', resource.id);

      if (updateError) throw updateError;

      // Enregistrer l'historique de l'édition
      const { error: editError } = await supabase
        .from('resource_edits')
        .insert({
          [type === 'article' ? 'article_id' : 'resource_id']: resource.id,
          editor_id: user.id,
          original_author_id: resource.author_id || resource.created_by,
          edit_type: 'content',
          changes,
          edit_summary: editSummary
        });

      if (editError) throw editError;

      toast.success('Modifications enregistrées avec succès !');
      setIsOpen(false);
      onEditComplete();
    } catch (error: any) {
      console.error('Error editing resource:', error);
      toast.error('Erreur lors de la modification', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Éditer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Éditer {type === 'article' ? 'l\'article' : 'la ressource'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Titre"
            value={editData.title}
            onChange={(e) => setEditData({...editData, title: e.target.value})}
            required
          />

          <Input
            placeholder="Catégorie"
            value={editData.category}
            onChange={(e) => setEditData({...editData, category: e.target.value})}
          />

          {type === 'resource' && (
            <Textarea
              placeholder="Description"
              value={editData.description}
              onChange={(e) => setEditData({...editData, description: e.target.value})}
              rows={3}
            />
          )}

          {type === 'article' && (
            <Textarea
              placeholder="Contenu de l'article"
              value={editData.content}
              onChange={(e) => setEditData({...editData, content: e.target.value})}
              rows={15}
              required
            />
          )}

          <Textarea
            placeholder="Résumé des modifications (optionnel)"
            value={editSummary}
            onChange={(e) => setEditSummary(e.target.value)}
            rows={2}
          />

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceEditor;
