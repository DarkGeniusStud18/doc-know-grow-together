
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Presentation, Plus, Eye, Edit, Trash2, Image, Play, MousePointer, Zap, Layers, Users } from 'lucide-react';
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
      <div className="container py-4 px-4 space-y-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Presentation className="h-6 w-6 sm:h-8 sm:w-8 text-medical-yellow" />
              Présentations interactives
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Créez des présentations pour expliquer des concepts médicaux</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle présentation
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Créer une nouvelle présentation</CardTitle>
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
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={createPresentation} disabled={!formData.title.trim()} className="flex-1 sm:flex-none">
                    Créer
                  </Button>
                  <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1 sm:flex-none">
                    Annuler
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {presentations.length === 0 ? (
            <div className="col-span-full text-center py-8 sm:py-12">
              <Presentation className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
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
                      <CardTitle className="text-base sm:text-lg">{presentation.title}</CardTitle>
                      <CardDescription className="mt-1 text-sm">
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
                    
                    <div className="flex flex-col sm:flex-row gap-2">
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

        {/* Fonctionnalités maintenant disponibles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Layers className="h-5 w-5" />
                Édition avancée
              </CardTitle>
              <CardDescription className="text-blue-700">Outils professionnels pour créer des présentations exceptionnelles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                  <Image className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-blue-800">Images et diagrammes</h4>
                    <p className="text-sm text-blue-600">Ajoutez des visuels médicaux interactifs</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-blue-800">Animations et transitions</h4>
                    <p className="text-sm text-blue-600">Transitions fluides et animations médicales</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                  <Layers className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-blue-800">Modèles prédéfinis</h4>
                    <p className="text-sm text-blue-600">Templates spécialisés pour la médecine</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <MousePointer className="h-5 w-5" />
                Interactivité avancée
              </CardTitle>
              <CardDescription className="text-green-700">Engagez votre audience avec des fonctionnalités interactives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                  <Play className="h-5 w-5 text-green-600" />
                  <div>
                    <h4 className="font-medium text-green-800">Quiz intégrés</h4>
                    <p className="text-sm text-green-600">Questions interactives en temps réel</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                  <MousePointer className="h-5 w-5 text-green-600" />
                  <div>
                    <h4 className="font-medium text-green-800">Éléments cliquables</h4>
                    <p className="text-sm text-green-600">Interaction directe avec le contenu</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                  <div>
                    <h4 className="font-medium text-green-800">Mode présentation en direct</h4>
                    <p className="text-sm text-green-600">Présentations collaboratives en temps réel</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to action pour les fonctionnalités */}
        <Card className="bg-gradient-to-r from-medical-blue to-medical-teal text-white">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Fonctionnalités Premium</h3>
            <p className="mb-4 opacity-90">
              Débloquez toutes les fonctionnalités avancées pour créer des présentations médicales exceptionnelles
            </p>
            <Button variant="secondary" size="lg">
              Découvrir Premium
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default InteractivePresentations;
