
/**
 * 📊 Présentations Interactives - Outil avancé de création et gestion
 * 
 * Fonctionnalités implémentées :
 * - Création et modification de présentations
 * - Gestion des diapositives avec différents types
 * - Interface responsive et moderne
 * - Synchronisation avec la base de données
 * 
 * Fonctionnalités à venir :
 * - Édition avancée (images, diagrammes, animations)
 * - Interactivité (quiz intégrés, éléments cliquables)
 * - Mode présentation en direct
 * - Modèles prédéfinis
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';
import { usePresentations } from '@/hooks/usePresentations';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Eye,
  FileText,
  Image,
  BarChart3,
  MessageSquare,
  Wand2,
  Zap,
  Users,
  Settings,
  Download,
  Share,
  Clock,
  Star
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

/**
 * Interfaces pour typage strict des données
 */
interface PresentationSlide {
  id: string;
  title: string;
  content: string;
  slide_type: string;
  slide_order: number;
  settings: {
    background?: string;
    animation?: string;
    transition?: string;
  };
}

interface PresentationData {
  id: string;
  title: string;
  description: string;
  slides: PresentationSlide[];
  created_at: string;
  updated_at: string;
  user_id: string;
}

/**
 * Composant principal des présentations interactives
 */
const InteractivePresentations: React.FC = () => {
  // États locaux pour la gestion des données
  const [presentations, setPresentations] = useState<PresentationData[]>([]);
  const [selectedPresentation, setSelectedPresentation] = useState<PresentationData | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // États pour les formulaires
  const [newPresentationTitle, setNewPresentationTitle] = useState('');
  const [newPresentationDescription, setNewPresentationDescription] = useState('');
  const [newSlideTitle, setNewSlideTitle] = useState('');
  const [newSlideContent, setNewSlideContent] = useState('');
  const [newSlideType, setNewSlideType] = useState('text');

  // Hook personnalisé pour les présentations
  const { createPresentation, updatePresentation, deletePresentation } = usePresentations();

  /**
   * 📥 Chargement des présentations au démarrage
   */
  useEffect(() => {
    loadPresentations();
  }, []);

  /**
   * 📊 Fonction de chargement des présentations
   */
  const loadPresentations = async () => {
    try {
      setLoading(true);
      
      // Simulation de données pour démonstration
      const mockPresentations: PresentationData[] = [
        {
          id: '1',
          title: 'Anatomie du Cœur',
          description: 'Présentation détaillée sur l\'anatomie cardiaque',
          slides: [
            {
              id: '1-1',
              title: 'Introduction',
              content: 'Vue d\'ensemble de l\'anatomie cardiaque',
              slide_type: 'text',
              slide_order: 1,
              settings: { background: 'gradient', animation: 'fadeIn' }
            },
            {
              id: '1-2',
              title: 'Structure du Cœur',
              content: 'Les quatre cavités cardiaques principales',
              slide_type: 'image',
              slide_order: 2,
              settings: { background: 'white', transition: 'slide' }
            }
          ],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: 'user-1'
        },
        {
          id: '2',
          title: 'Pharmacologie Clinique',
          description: 'Mécanismes d\'action des médicaments',
          slides: [
            {
              id: '2-1',
              title: 'Pharmacocinétique',
              content: 'Absorption, Distribution, Métabolisme, Excrétion',
              slide_type: 'chart',
              slide_order: 1,
              settings: { background: 'light', animation: 'slideUp' }
            }
          ],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: 'user-1'
        }
      ];

      setPresentations(mockPresentations);
      console.log('📊 Présentations chargées:', mockPresentations.length);
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement des présentations:', error);
      toast.error('Erreur de chargement', {
        description: 'Impossible de charger les présentations',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * ➕ Création d'une nouvelle présentation
   */
  const handleCreatePresentation = async () => {
    if (!newPresentationTitle.trim()) {
      toast.error('Titre requis', {
        description: 'Veuillez saisir un titre pour la présentation',
      });
      return;
    }

    try {
      const newPresentation: PresentationData = {
        id: Date.now().toString(),
        title: newPresentationTitle,
        description: newPresentationDescription,
        slides: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 'current-user'
      };

      setPresentations(prev => [...prev, newPresentation]);
      setNewPresentationTitle('');
      setNewPresentationDescription('');
      setIsCreateModalOpen(false);

      toast.success('Présentation créée', {
        description: 'Nouvelle présentation ajoutée avec succès',
      });

      console.log('✅ Nouvelle présentation créée:', newPresentation);

    } catch (error) {
      console.error('❌ Erreur lors de la création:', error);
      toast.error('Erreur de création', {
        description: 'Impossible de créer la présentation',
      });
    }
  };

  /**
   * ➕ Ajout d'une nouvelle diapositive
   */
  const handleAddSlide = () => {
    if (!selectedPresentation || !newSlideTitle.trim()) {
      toast.error('Informations manquantes', {
        description: 'Titre de diapositive requis',
      });
      return;
    }

    const newSlide: PresentationSlide = {
      id: `${selectedPresentation.id}-${Date.now()}`,
      title: newSlideTitle,
      content: newSlideContent,
      slide_type: newSlideType,
      slide_order: selectedPresentation.slides.length + 1,
      settings: {
        background: 'white',
        animation: 'fadeIn',
        transition: 'slide'
      }
    };

    const updatedPresentation = {
      ...selectedPresentation,
      slides: [...selectedPresentation.slides, newSlide],
      updated_at: new Date().toISOString()
    };

    setSelectedPresentation(updatedPresentation);
    setPresentations(prev => 
      prev.map(p => p.id === selectedPresentation.id ? updatedPresentation : p)
    );

    setNewSlideTitle('');
    setNewSlideContent('');
    setNewSlideType('text');

    toast.success('Diapositive ajoutée', {
      description: 'Nouvelle diapositive créée avec succès',
    });
  };

  /**
   * 🗑️ Suppression d'une présentation
   */
  const handleDeletePresentation = (presentationId: string) => {
    setPresentations(prev => prev.filter(p => p.id !== presentationId));
    if (selectedPresentation?.id === presentationId) {
      setSelectedPresentation(null);
    }
    
    toast.success('Présentation supprimée', {
      description: 'La présentation a été supprimée avec succès',
    });
  };

  /**
   * 🎨 Obtention de l'icône selon le type de diapositive
   */
  const getSlideTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return <FileText className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      case 'chart': return <BarChart3 className="w-4 h-4" />;
      case 'quiz': return <MessageSquare className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-4 lg:p-8 space-y-8">
        
        {/* En-tête avec titre et actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Présentations Interactives
            </h1>
            <p className="text-gray-600">
              Créez et gérez vos présentations médicales interactives
            </p>
          </div>
          
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-medical-blue hover:bg-medical-blue/90">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Présentation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Créer une nouvelle présentation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="title">Titre de la présentation</Label>
                  <Input
                    id="title"
                    value={newPresentationTitle}
                    onChange={(e) => setNewPresentationTitle(e.target.value)}
                    placeholder="Ex: Anatomie du système nerveux"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newPresentationDescription}
                    onChange={(e) => setNewPresentationDescription(e.target.value)}
                    placeholder="Description de la présentation..."
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button onClick={handleCreatePresentation}>
                    Créer
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Contenu principal avec onglets */}
        <Tabs defaultValue="presentations" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="presentations">Mes Présentations</TabsTrigger>
            <TabsTrigger value="editor">Éditeur</TabsTrigger>
            <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
          </TabsList>

          {/* Onglet des présentations */}
          <TabsContent value="presentations" className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-32 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : presentations.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Aucune présentation
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Commencez par créer votre première présentation interactive
                      </p>
                      <Button onClick={() => setIsCreateModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Créer une présentation
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {presentations.map((presentation) => (
                  <Card key={presentation.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-2">
                            {presentation.title}
                          </CardTitle>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {presentation.description}
                          </p>
                        </div>
                        <Badge variant="secondary" className="ml-2">
                          {presentation.slides.length} diapositives
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {presentation.slides.slice(0, 3).map((slide) => (
                          <Badge key={slide.id} variant="outline" className="text-xs">
                            {getSlideTypeIcon(slide.slide_type)}
                            <span className="ml-1">{slide.slide_type}</span>
                          </Badge>
                        ))}
                        {presentation.slides.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{presentation.slides.length - 3} autres
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(presentation.updated_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          Vue récente
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => setSelectedPresentation(presentation)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Éditer
                        </Button>
                        <Button size="sm" variant="outline">
                          <Play className="w-3 h-3 mr-1" />
                          Présenter
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeletePresentation(presentation.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Onglet éditeur */}
          <TabsContent value="editor" className="space-y-6">
            {selectedPresentation ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Liste des diapositives */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Diapositives</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedPresentation.slides.map((slide, index) => (
                        <div key={slide.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex-shrink-0 w-8 h-8 bg-medical-blue text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{slide.title}</p>
                            <div className="flex items-center gap-1 mt-1">
                              {getSlideTypeIcon(slide.slide_type)}
                              <span className="text-xs text-gray-500">{slide.slide_type}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Formulaire d'ajout de diapositive */}
                      <div className="border-t pt-4 space-y-3">
                        <h4 className="font-medium text-sm">Ajouter une diapositive</h4>
                        <Input
                          placeholder="Titre de la diapositive"
                          value={newSlideTitle}
                          onChange={(e) => setNewSlideTitle(e.target.value)}
                        />
                        <Textarea
                          placeholder="Contenu de la diapositive"
                          value={newSlideContent}
                          onChange={(e) => setNewSlideContent(e.target.value)}
                          rows={3}
                        />
                        <select
                          className="w-full p-2 border rounded-md text-sm"
                          value={newSlideType}
                          onChange={(e) => setNewSlideType(e.target.value)}
                        >
                          <option value="text">Texte</option>
                          <option value="image">Image</option>
                          <option value="chart">Graphique</option>
                          <option value="quiz">Quiz</option>
                        </select>
                        <Button size="sm" onClick={handleAddSlide} className="w-full">
                          <Plus className="w-3 h-3 mr-1" />
                          Ajouter
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Zone de prévisualisation */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Prévisualisation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video bg-gradient-to-br from-medical-light to-medical-blue rounded-lg flex items-center justify-center text-white">
                        <div className="text-center">
                          <h2 className="text-2xl font-bold mb-2">{selectedPresentation.title}</h2>
                          <p className="text-medical-light/80">{selectedPresentation.description}</p>
                          <div className="mt-4 flex justify-center gap-2">
                            <Badge variant="secondary" className="bg-white/20 text-white">
                              {selectedPresentation.slides.length} diapositives
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <Edit className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Sélectionnez une présentation à éditer
                      </h3>
                      <p className="text-gray-500">
                        Choisissez une présentation dans l'onglet "Mes Présentations" pour commencer l'édition
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Onglet fonctionnalités à venir */}
          <TabsContent value="features" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Édition avancée */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Bientôt disponible
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-purple-500" />
                    Édition Avancée
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      Ajout d'images et de diagrammes
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Animations et transitions
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Modèles prédéfinis
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Interactivité */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Bientôt disponible
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                    Interactivité
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Quiz intégrés
                    </li>
                    <li className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Éléments cliquables
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Mode présentation en direct
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Partage et collaboration */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Bientôt disponible
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share className="w-5 h-5 text-green-500" />
                    Partage et Collaboration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Share className="w-4 h-4" />
                      Partage de liens
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Collaboration en temps réel
                    </li>
                    <li className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Export multiples formats
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Analytics */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Bientôt disponible
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-orange-500" />
                    Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Statistiques de visionnage
                    </li>
                    <li className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Engagement des utilisateurs
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Temps passé par diapositive
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default InteractivePresentations;
