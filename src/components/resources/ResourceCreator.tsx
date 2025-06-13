import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import { Plus, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { createResource } from '@/models/Resource';

const ResourceCreator: React.FC<{ onResourceCreated: () => void }> = ({ onResourceCreated }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    category: '',
    author: '',
    language: 'fr'
  });

  const createNewResource = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour créer une ressource');
      return;
    }

    if (!formData.title.trim() || !formData.url.trim()) {
      toast.error('Veuillez remplir au moins le titre et l\'URL');
      return;
    }

    setCreating(true);

    try {
      const resource = await createResource({
        title: formData.title,
        description: formData.description,
        content_type: 'document', // Changed from 'external_link' to 'document'
        category: formData.category || 'Général',
        author: formData.author || user.displayName,
        language: formData.language,
        url: formData.url,
        featured: false,
        requires_verification: false,
        is_premium: false,
        created_by: user.id
      });

      if (resource) {
        toast.success('Ressource créée avec succès');
        setOpen(false);
        setFormData({
          title: '',
          description: '',
          url: '',
          category: '',
          author: '',
          language: 'fr'
        });
        onResourceCreated();
      }
    } catch (error) {
      console.error('Error creating resource:', error);
      toast.error('Erreur lors de la création de la ressource');
    } finally {
      setCreating(false);
    }
  };

  const categories = [
    'Anatomie',
    'Physiologie',
    'Pathologie',
    'Pharmacologie',
    'Chirurgie',
    'Médecine interne',
    'Pédiatrie',
    'Gynécologie',
    'Cardiologie',
    'Neurologie',
    'Autre'
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un lien
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle ressource</DialogTitle>
          <DialogDescription>
            Partagez un lien vers une ressource médicale externe (site web, document en ligne, etc.).
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Titre de la ressource"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <div className="relative">
              <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://example.com/resource"
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description de la ressource..."
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="author">Auteur</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                placeholder="Nom de l'auteur"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={createNewResource} disabled={!formData.title || !formData.url || creating}>
            {creating ? 'Création...' : 'Créer la ressource'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceCreator;
