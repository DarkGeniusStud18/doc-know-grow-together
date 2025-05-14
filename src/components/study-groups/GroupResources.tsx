
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { FileText, Link as LinkIcon, Upload, FileSpreadsheet, File, FileImage, Download, Trash2 } from 'lucide-react';

type GroupResourcesProps = {
  groupId: string;
  userRole: string;
};

type Resource = {
  id: string;
  title: string;
  type: 'file' | 'link';
  url: string;
  fileType?: string;
  uploadedBy: string;
  uploadDate: string;
};

const GroupResources: React.FC<GroupResourcesProps> = ({ groupId, userRole }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [showAddFileDialog, setShowAddFileDialog] = useState(false);
  const [showAddLinkDialog, setShowAddLinkDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const canModerate = userRole === 'admin' || userRole === 'moderator';
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setTitle(e.target.files[0].name);
    }
  };
  
  const uploadFile = async () => {
    if (!selectedFile || !title) return;
    
    try {
      // In a real application, this would upload to storage
      // For now, simulate adding resource
      const newResource: Resource = {
        id: `file-${Date.now()}`,
        title,
        type: 'file',
        url: URL.createObjectURL(selectedFile), // This URL is temporary and for demo purposes
        fileType: selectedFile.type,
        uploadedBy: 'Moi',
        uploadDate: new Date().toISOString()
      };
      
      setResources([...resources, newResource]);
      toast.success('Fichier ajouté avec succès');
      setShowAddFileDialog(false);
      setTitle('');
      setSelectedFile(null);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Erreur lors de l\'ajout du fichier');
    }
  };
  
  const addLink = () => {
    if (!title || !url) return;
    
    try {
      // Validate URL
      new URL(url);
      
      // Add link to resources
      const newResource: Resource = {
        id: `link-${Date.now()}`,
        title,
        type: 'link',
        url,
        uploadedBy: 'Moi',
        uploadDate: new Date().toISOString()
      };
      
      setResources([...resources, newResource]);
      toast.success('Lien ajouté avec succès');
      setShowAddLinkDialog(false);
      setTitle('');
      setUrl('');
      
    } catch (error) {
      console.error('Error adding link:', error);
      toast.error('URL invalide');
    }
  };
  
  const deleteResource = (id: string) => {
    setResources(resources.filter(resource => resource.id !== id));
    toast.success('Ressource supprimée avec succès');
  };
  
  const getFileIcon = (fileType?: string) => {
    if (!fileType) return <File />;
    
    if (fileType.includes('image')) {
      return <FileImage />;
    } else if (fileType.includes('pdf')) {
      return <FileText />;
    } else if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
      return <FileSpreadsheet />;
    } else {
      return <File />;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Ressources</CardTitle>
        <div className="flex gap-2">
          <Dialog open={showAddFileDialog} onOpenChange={setShowAddFileDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Upload size={16} className="mr-2" />
                Ajouter un fichier
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un fichier</DialogTitle>
                <DialogDescription>
                  Téléchargez un fichier à partager avec le groupe.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="fileUpload">Fichier</Label>
                  <Input
                    id="fileUpload"
                    type="file"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="title">Titre</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Titre du fichier"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddFileDialog(false)}>Annuler</Button>
                <Button onClick={uploadFile} disabled={!selectedFile || !title}>Upload</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showAddLinkDialog} onOpenChange={setShowAddLinkDialog}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <LinkIcon size={16} className="mr-2" />
                Ajouter un lien
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un lien</DialogTitle>
                <DialogDescription>
                  Partagez un lien vers une ressource externe.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="linkTitle">Titre</Label>
                  <Input
                    id="linkTitle"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Titre du lien"
                  />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="linkUrl">URL</Label>
                  <Input
                    id="linkUrl"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddLinkDialog(false)}>Annuler</Button>
                <Button onClick={addLink} disabled={!title || !url}>Ajouter</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {resources.length > 0 ? (
          <div className="space-y-2">
            {resources.map((resource) => (
              <div 
                key={resource.id} 
                className="flex items-center justify-between p-3 rounded-md border hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  {resource.type === 'file' ? (
                    getFileIcon(resource.fileType)
                  ) : (
                    <LinkIcon />
                  )}
                  <div>
                    <p className="font-medium">{resource.title}</p>
                    <p className="text-xs text-gray-500">
                      Ajouté par {resource.uploadedBy} le {formatDate(resource.uploadDate)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {resource.type === 'file' ? (
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => window.open(resource.url)}
                    >
                      <Download size={16} />
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => window.open(resource.url, '_blank')}
                    >
                      <LinkIcon size={16} />
                    </Button>
                  )}
                  {canModerate && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => deleteResource(resource.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-gray-100 rounded-full p-6 mb-4">
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium">Aucune ressource</h3>
            <p className="text-gray-500 mt-2 text-center">
              Ajoutez des fichiers ou des liens pour partager des ressources avec le groupe.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GroupResources;
