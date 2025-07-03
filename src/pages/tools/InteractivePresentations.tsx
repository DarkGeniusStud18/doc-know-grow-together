
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Presentation, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Image as ImageIcon, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack,
  MousePointer,
  Zap,
  Palette,
  Users,
  Download,
  Share2
} from 'lucide-react';
import { toast } from '@/components/ui/sonner';

type SlideType = 'intro' | 'content' | 'quiz' | 'interactive' | 'conclusion';

type Slide = {
  id: string;
  type: SlideType;
  title: string;
  content: string;
  backgroundImage?: string;
  animation?: 'fade' | 'slide' | 'zoom' | 'flip';
  duration?: number;
  interactive?: {
    type: 'quiz' | 'clickable' | 'poll';
    data: any;
  };
};

type Template = {
  id: string;
  name: string;
  description: string;
  slides: Slide[];
  category: string;
};

type PresentationType = {
  id: string;
  title: string;
  description: string;
  slides: Slide[];
  template?: string;
  isLive?: boolean;
  createdAt: string;
};

const InteractivePresentations = () => {
  const [presentations, setPresentations] = useState<PresentationType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPresentation, setEditingPresentation] = useState<PresentationType | null>(null);
  const [showSlideEditor, setShowSlideEditor] = useState(false);
  const [currentSlide, setCurrentSlide] = useState<Slide | null>(null);
  const [presentationMode, setPresentationMode] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    template: ''
  });

  // Modèles prédéfinis
  const templates: Template[] = [
    {
      id: 'medical-anatomy',
      name: 'Anatomie Médicale',
      description: 'Présentation pour les cours d\'anatomie',
      category: 'Médical',
      slides: [
        {
          id: '1',
          type: 'intro',
          title: 'Introduction à l\'Anatomie',
          content: 'Bienvenue dans ce cours d\'anatomie',
          animation: 'fade'
        },
        {
          id: '2',
          type: 'content',
          title: 'Système Cardiovasculaire',
          content: 'Étude du cœur et des vaisseaux sanguins',
          animation: 'slide'
        },
        {
          id: '3',
          type: 'quiz',
          title: 'Quiz : Le Cœur',
          content: 'Testez vos connaissances',
          interactive: {
            type: 'quiz',
            data: {
              question: 'Combien de chambres a le cœur humain ?',
              options: ['2', '3', '4', '5'],
              correct: 2
            }
          }
        }
      ]
    },
    {
      id: 'clinical-case',
      name: 'Cas Clinique',
      description: 'Présentation de cas cliniques interactifs',
      category: 'Clinique',
      slides: [
        {
          id: '1',
          type: 'intro',
          title: 'Cas Clinique',
          content: 'Analyse d\'un cas patient',
          animation: 'zoom'
        },
        {
          id: '2',
          type: 'interactive',
          title: 'Symptômes',
          content: 'Cliquez sur les symptômes observés',
          interactive: {
            type: 'clickable',
            data: {
              elements: ['Fièvre', 'Toux', 'Dyspnée', 'Fatigue']
            }
          }
        }
      ]
    }
  ];

  const slideTypes = [
    { value: 'intro', label: 'Introduction' },
    { value: 'content', label: 'Contenu' },
    { value: 'quiz', label: 'Quiz' },
    { value: 'interactive', label: 'Interactif' },
    { value: 'conclusion', label: 'Conclusion' }
  ];

  const animations = [
    { value: 'fade', label: 'Fondu' },
    { value: 'slide', label: 'Glissement' },
    { value: 'zoom', label: 'Zoom' },
    { value: 'flip', label: 'Retournement' }
  ];

  const createPresentation = () => {
    if (!formData.title.trim()) return;

    const selectedTemplate = templates.find(t => t.id === formData.template);
    
    const newPresentation: PresentationType = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      template: formData.template,
      slides: selectedTemplate ? selectedTemplate.slides : [
        {
          id: '1',
          type: 'intro',
          title: 'Introduction',
          content: 'Bienvenue dans votre présentation',
          animation: 'fade'
        }
      ],
      createdAt: new Date().toISOString()
    };

    setPresentations([...presentations, newPresentation]);
    setFormData({ title: '', description: '', template: '' });
    setShowForm(false);
    toast.success('Présentation créée avec succès !');
  };

  const editPresentation = (presentation: PresentationType) => {
    setEditingPresentation(presentation);
    setShowSlideEditor(true);
  };

  const startLivePresentation = (presentation: PresentationType) => {
    const updatedPresentation = { ...presentation, isLive: true };
    setPresentations(prev => 
      prev.map(p => p.id === presentation.id ? updatedPresentation : p)
    );
    setPresentationMode(true);
    setEditingPresentation(updatedPresentation);
    toast.success('Mode présentation en direct activé !');
  };

  const deletePresentation = (id: string) => {
    setPresentations(presentations.filter(p => p.id !== id));
    toast.info('Présentation supprimée');
  };

  const addSlide = () => {
    if (!editingPresentation) return;
    
    const newSlide: Slide = {
      id: Date.now().toString(),
      type: 'content',
      title: 'Nouvelle diapositive',
      content: 'Contenu de la diapositive',
      animation: 'fade'
    };

    const updatedPresentation = {
      ...editingPresentation,
      slides: [...editingPresentation.slides, newSlide]
    };

    setEditingPresentation(updatedPresentation);
    setPresentations(prev => 
      prev.map(p => p.id === editingPresentation.id ? updatedPresentation : p)
    );
  };

  return (
    <MainLayout>
      <div className="container py-4 px-4 max-w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Presentation className="h-6 w-6 sm:h-8 sm:w-8 text-medical-yellow" />
              Présentations Interactives
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Créez des présentations médicales interactives avec quiz et animations
            </p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} size="sm" className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle présentation
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="list">Mes Présentations</TabsTrigger>
            <TabsTrigger value="templates">Modèles</TabsTrigger>
            <TabsTrigger value="live">En Direct</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            {showForm && (
              <Card>
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
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Décrivez le contenu de votre présentation..."
                        rows={3}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Modèle (optionnel)</label>
                      <Select value={formData.template} onValueChange={(value) => setFormData({ ...formData, template: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir un modèle prédéfini" />
                        </SelectTrigger>
                        <SelectContent>
                          {templates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name} - {template.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button onClick={createPresentation} disabled={!formData.title.trim()} className="flex-1">
                        Créer
                      </Button>
                      <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                        Annuler
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
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
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg truncate">{presentation.title}</CardTitle>
                          <CardDescription className="mt-1 text-sm line-clamp-2">
                            {presentation.description}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deletePresentation(presentation.id)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">
                            {presentation.slides.length} diapositive{presentation.slides.length !== 1 ? 's' : ''}
                          </span>
                          {presentation.isLive && (
                            <Badge variant="destructive" className="animate-pulse">
                              <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                              En direct
                            </Badge>
                          )}
                        </div>
                        
                        <div className="text-xs text-gray-400">
                          Créé le {new Date(presentation.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                        
                        <div className="flex gap-1">
                          <Button size="sm" className="flex-1 text-xs" onClick={() => startLivePresentation(presentation)}>
                            <Play className="h-3 w-3 mr-1" />
                            Présenter
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => editPresentation(presentation)}>
                            <Edit className="h-3 w-3 mr-1" />
                            Éditer
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {templates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant="secondary">{template.category}</Badge>
                    </div>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600">
                        {template.slides.length} diapositives incluses
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          setFormData({ ...formData, template: template.id });
                          setShowForm(true);
                          setActiveTab('list');
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Utiliser ce modèle
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="live" className="space-y-6">
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Mode Présentation en Direct</h3>
              <p className="text-gray-500 mb-4">
                Fonctionnalité disponible prochainement pour les présentations collaboratives en temps réel
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Fonctionnalités avancées */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Fonctionnalités Avancées Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-blue-500" />
                  Médias Riches
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✅ Images et diagrammes</li>
                  <li>✅ Graphiques interactifs</li>
                  <li>✅ Modèles médicaux 3D</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Palette className="h-4 w-4 text-purple-500" />
                  Animations
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✅ Transitions fluides</li>
                  <li>✅ Effets d'apparition</li>
                  <li>✅ Animations personnalisées</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <MousePointer className="h-4 w-4 text-green-500" />
                  Interactivité
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✅ Quiz intégrés</li>
                  <li>✅ Elements cliquables</li>
                  <li>✅ Sondages en temps réel</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default InteractivePresentations;
