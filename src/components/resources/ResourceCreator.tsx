
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { Plus, BookOpen, FileText, Link as LinkIcon } from 'lucide-react';

interface ResourceCreatorProps {
  onResourceCreated: () => void;
}

const ResourceCreator: React.FC<ResourceCreatorProps> = ({ onResourceCreated }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resourceType, setResourceType] = useState<'external' | 'article'>('external');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    category: '',
    author: '',
    content: '',
    excerpt: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      if (resourceType === 'external') {
        // Créer une ressource externe
        const { error } = await supabase
          .from('resources')
          .insert({
            title: formData.title,
            description: formData.description,
            url: formData.url,
            category: formData.category,
            author: formData.author,
            content_type: 'document', // Utiliser un type valide
            created_by: user.id
          });

        if (error) throw error;
        toast.success('Ressource ajoutée avec succès !');
      } else {
        // Créer un article
        const { error } = await supabase
          .from('articles')
          .insert({
            title: formData.title,
            content: formData.content,
            excerpt: formData.excerpt,
            category: formData.category,
            author_id: user.id,
            status: 'published',
            reading_time: Math.ceil(formData.content.split(' ').length / 200)
          });

        if (error) throw error;
        toast.success('Article publié avec succès !');
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        url: '',
        category: '',
        author: '',
        content: '',
        excerpt: ''
      });
      setIsOpen(false);
      onResourceCreated();
    } catch (error: any) {
      console.error('Error creating resource:', error);
      toast.error('Erreur lors de la création', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="mb-6">
        <Plus className="h-4 w-4 mr-2" />
        Ajouter une ressource
      </Button>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Nouvelle ressource médicale
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4 mb-4">
            <Button
              type="button"
              variant={resourceType === 'external' ? 'default' : 'outline'}
              onClick={() => setResourceType('external')}
              className="flex-1"
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              Ressource externe
            </Button>
            <Button
              type="button"
              variant={resourceType === 'article' ? 'default' : 'outline'}
              onClick={() => setResourceType('article')}
              className="flex-1"
            >
              <FileText className="h-4 w-4 mr-2" />
              Écrire un article
            </Button>
          </div>

          <Input
            placeholder="Titre de la ressource"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />

          <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cardiologie">Cardiologie</SelectItem>
              <SelectItem value="neurologie">Neurologie</SelectItem>
              <SelectItem value="pediatrie">Pédiatrie</SelectItem>
              <SelectItem value="chirurgie">Chirurgie</SelectItem>
              <SelectItem value="medecine_generale">Médecine générale</SelectItem>
              <SelectItem value="pharmacologie">Pharmacologie</SelectItem>
              <SelectItem value="anatomie">Anatomie</SelectItem>
              <SelectItem value="autre">Autre</SelectItem>
            </SelectContent>
          </Select>

          {resourceType === 'external' ? (
            <>
              <Textarea
                placeholder="Description de la ressource"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
              />
              <Input
                placeholder="URL de la ressource"
                value={formData.url}
                onChange={(e) => setFormData({...formData, url: e.target.value})}
                required
                type="url"
              />
              <Input
                placeholder="Auteur (optionnel)"
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
              />
            </>
          ) : (
            <>
              <Textarea
                placeholder="Résumé de l'article"
                value={formData.excerpt}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                rows={3}
              />
              <Textarea
                placeholder="Contenu de l'article (utilisez du Markdown)"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows={10}
                required
              />
            </>
          )}

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Création...' : (resourceType === 'external' ? 'Ajouter la ressource' : 'Publier l\'article')}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ResourceCreator;
