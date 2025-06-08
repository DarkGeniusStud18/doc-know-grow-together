
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Presentation, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

type Slide = {
  id: string;
  title: string;
  content: string;
};

type PresentationType = {
  id: string;
  title: string;
  description: string;
  slides: Slide[];
  createdAt: string;
};

const InteractivePresentations = () => {
  const [presentations, setPresentations] = useState<PresentationType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [currentPresentation, setCurrentPresentation] = useState<PresentationType | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  const createPresentation = () => {
    if (!formData.title.trim()) return;

    const newPresentation: PresentationType = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      slides: [
        {
          id: '1',
          title: 'Introduction',
          content: 'Bienvenue dans votre présentation'
        }
      ],
      createdAt: new Date().toISOString()
    };

    setPresentations([...presentations, newPresentation]);
    setFormData({ title: '', description: '' });
    setShowForm(false);
    toast.success('Présentation créée avec succès !');
  };

  const deletePresentation = (id: string) => {
    setPresentations(presentations.filter(p => p.id !== id));
    toast.info('Présentation supprimée');
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Presentation className="h-8 w-8 text-medical-yellow" />
              Présentations interactives
            </h1>
            <p className="text-gray-600 mt-2">Créez des présentations pour expliquer des concepts médicaux</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle présentation
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Créer une nouvelle présentation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Titre</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Anatomie du cœur"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Décrivez le contenu de votre présentation..."
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={createPresentation} disabled={!formData.title.trim()}>
                    Créer
                  </Button>
                  <Button variant="outline" onClick={() => setShowForm(false)}>
                    Annuler
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {presentations.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Presentation className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucune présentation</h3>
              <p className="text-gray-500 mb-4">Créez votre première présentation interactive</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Commencer
              </Button>
            </div>
          ) : (
            presentations.map((presentation) => (
              <Card key={presentation.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{presentation.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {presentation.description}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deletePresentation(presentation.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-500">
                      {presentation.slides.length} diapositive{presentation.slides.length !== 1 ? 's' : ''}
                    </div>
                    
                    <div className="text-xs text-gray-400">
                      Créé le {new Date(presentation.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Éditer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {presentations.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Fonctionnalités à venir</CardTitle>
              <CardDescription>Ces fonctionnalités seront bientôt disponibles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-medium">Édition avancée</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Ajout d'images et de diagrammes</li>
                    <li>• Animations et transitions</li>
                    <li>• Modèles prédéfinis</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Interactivité</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Quiz intégrés</li>
                    <li>• Éléments cliquables</li>
                    <li>• Mode présentation en direct</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default InteractivePresentations;
