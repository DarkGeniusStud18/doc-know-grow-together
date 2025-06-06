
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';

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
    content_type: 'article',
    category: '',
    author: '',
    language: 'fr',
    thumbnail: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('resources')
        .insert({
          ...formData,
          created_by: user.id,
        });

      if (error) throw error;

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
      });
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
          <Input
            placeholder="Titre de la ressource"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          
          <Textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />

          <Input
            placeholder="URL de la ressource"
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select 
              value={formData.content_type} 
              onValueChange={(value) => setFormData({ ...formData, content_type: value as any })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Type de contenu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="video">Vidéo</SelectItem>
                <SelectItem value="podcast">Podcast</SelectItem>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="course">Cours</SelectItem>
                <SelectItem value="quiz">Quiz</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Catégorie"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Auteur"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            />

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

          <Input
            placeholder="URL de l'image de couverture (optionnel)"
            type="url"
            value={formData.thumbnail}
            onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
          />

          <div className="flex gap-2">
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
