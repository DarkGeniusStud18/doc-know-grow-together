
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';
import { createResource, ContentType } from '@/models/Resource';

interface AddResourceFormProps {
  onResourceAdded: () => void;
  onCancel: () => void;
}

const AddResourceForm: React.FC<AddResourceFormProps> = ({ onResourceAdded, onCancel }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    content_type: 'article' as ContentType,
    category: '',
    author: '',
    language: 'fr',
    thumbnail: '',
    featured: false,
    requires_verification: false,
    is_premium: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Vous devez être connecté pour ajouter une ressource');
      return;
    }

    if (!formData.title.trim() || !formData.url.trim()) {
      toast.error('Le titre et l\'URL sont obligatoires');
      return;
    }

    setLoading(true);

    try {
      const resource = await createResource({
        ...formData,
        created_by: user.id,
      });

      if (resource) {
        toast.success('Ressource ajoutée avec succès !');
        onResourceAdded();
        setFormData({
          title: '',
          description: '',
          url: '',
          content_type: 'article',
          category: '',
          author: '',
          language: 'fr',
          thumbnail: '',
          featured: false,
          requires_verification: false,
          is_premium: false,
        });
      } else {
        toast.error('Erreur lors de l\'ajout de la ressource');
      }
    } catch (error) {
      console.error('Error adding resource:', error);
      toast.error('Erreur lors de l\'ajout de la ressource');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajouter une nouvelle ressource</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              placeholder="Titre de la ressource"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Description de la ressource"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="url">URL *</Label>
            <Input
              id="url"
              placeholder="https://..."
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="content_type">Type de contenu</Label>
              <Select 
                value={formData.content_type} 
                onValueChange={(value) => setFormData({ ...formData, content_type: value as ContentType })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type de contenu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="video">Vidéo</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="book">Livre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Input
                id="category"
                placeholder="Ex: Cardiologie, Anatomie..."
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="author">Auteur</Label>
              <Input
                id="author"
                placeholder="Nom de l'auteur"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="language">Langue</Label>
              <Select 
                value={formData.language} 
                onValueChange={(value) => setFormData({ ...formData, language: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Langue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">Anglais</SelectItem>
                  <SelectItem value="es">Espagnol</SelectItem>
                  <SelectItem value="de">Allemand</SelectItem>
                  <SelectItem value="it">Italien</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="thumbnail">Image de couverture</Label>
            <Input
              id="thumbnail"
              placeholder="URL de l'image (optionnel)"
              type="url"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
              />
              <Label htmlFor="featured">Ressource à la une</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_premium"
                checked={formData.is_premium}
                onCheckedChange={(checked) => setFormData({ ...formData, is_premium: checked })}
              />
              <Label htmlFor="is_premium">Ressource premium</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="requires_verification"
                checked={formData.requires_verification}
                onCheckedChange={(checked) => setFormData({ ...formData, requires_verification: checked })}
              />
              <Label htmlFor="requires_verification">Nécessite une vérification</Label>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Ajout en cours...' : 'Ajouter la ressource'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddResourceForm;
