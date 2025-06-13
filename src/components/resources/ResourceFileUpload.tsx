
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import { Upload, FileText, Video, Image, File } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { createResource } from '@/models/Resource';

const ResourceFileUpload: React.FC<{ onResourceAdded: () => void }> = ({ onResourceAdded }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    author: '',
    language: 'fr'
  });

  const contentTypes = {
    'application/pdf': 'document',
    'video/mp4': 'video',
    'video/avi': 'video',
    'video/mov': 'video',
    'image/jpeg': 'image',
    'image/png': 'image',
    'image/gif': 'image',
    'application/vnd.ms-powerpoint': 'presentation',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'presentation',
    'text/plain': 'document',
    'application/msword': 'document',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'document'
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('video')) return <Video className="h-8 w-8 text-blue-500" />;
    if (fileType.includes('image')) return <Image className="h-8 w-8 text-green-500" />;
    if (fileType.includes('pdf') || fileType.includes('document')) return <FileText className="h-8 w-8 text-red-500" />;
    return <File className="h-8 w-8 text-gray-500" />;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!formData.title) {
        setFormData(prev => ({
          ...prev,
          title: selectedFile.name.split('.').slice(0, -1).join('.')
        }));
      }
    }
  };

  const uploadFile = async () => {
    if (!file || !user) {
      toast.error('Veuillez sélectionner un fichier');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Veuillez saisir un titre');
      return;
    }

    setUploading(true);

    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resource-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resource-files')
        .getPublicUrl(fileName);

      // Create resource record
      const contentType = contentTypes[file.type as keyof typeof contentTypes] || 'document';
      
      const resource = await createResource({
        title: formData.title,
        description: formData.description,
        content_type: contentType as any,
        category: formData.category || 'Général',
        author: formData.author || user.displayName,
        language: formData.language,
        url: publicUrl,
        featured: false,
        requires_verification: false,
        is_premium: false,
        created_by: user.id
      });

      if (resource) {
        // Create file record
        await supabase.from('resource_files').insert({
          user_id: user.id,
          resource_id: resource.id,
          filename: file.name,
          file_path: fileName,
          file_size: file.size,
          mime_type: file.type
        });

        toast.success('Ressource ajoutée avec succès');
        setOpen(false);
        setFile(null);
        setFormData({
          title: '',
          description: '',
          category: '',
          author: '',
          language: 'fr'
        });
        onResourceAdded();
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Erreur lors de l\'ajout de la ressource');
    } finally {
      setUploading(false);
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
          <Upload className="h-4 w-4" />
          Ajouter une ressource
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle ressource</DialogTitle>
          <DialogDescription>
            Téléchargez un document médical, une présentation, une vidéo ou toute autre ressource éducative.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="file">Fichier</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.avi,.mov,.jpg,.jpeg,.png,.gif,.txt"
            />
            {file && (
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                {getFileIcon(file.type)}
                <span className="text-sm">{file.name}</span>
                <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
            )}
          </div>
          
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
          <Button onClick={uploadFile} disabled={!file || !formData.title || uploading}>
            {uploading ? 'Téléchargement...' : 'Ajouter la ressource'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceFileUpload;
