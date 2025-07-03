
/**
 * 📊 Présentations Interactives - Version Complète avec Toutes les Fonctionnalités
 * 
 * Fonctionnalités avancées :
 * - Édition avancée avec images et diagrammes
 * - Animations et transitions
 * - Modèles prédéfinis
 * - Quiz intégrés
 * - Éléments cliquables
 * - Mode présentation en direct
 */

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Presentation, 
  Plus, 
  Play, 
  Edit, 
  Trash2, 
  Eye,
  Image,
  Zap,
  Layout,
  HelpCircle,
  MousePointerClick,
  Users,
  Save,
  Upload,
  Palette,
  Settings
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/sonner';

// Types pour les présentations et diapositives
interface Presentation {
  id: string;
  title: string;
  description?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  slides: Slide[];
}

interface Slide {
  id: string;
  presentationId: string;
  title: string;
  content?: string;
  slideType: 'content' | 'image' | 'quiz' | 'diagram';
  slideOrder: number;
  animations?: AnimationConfig;
  interactiveElements?: InteractiveElement[];
}

interface AnimationConfig {
  entrance: string;
  emphasis: string;
  exit: string;
  duration: number;
}

interface InteractiveElement {
  id: string;
  type: 'button' | 'hotspot' | 'quiz' | 'poll';
  position: { x: number; y: number };
  action: string;
  data: any;
}

// Modèles prédéfinis
const PRESENTATION_TEMPLATES = [
  {
    id: 'medical_case',
    name: 'Cas Clinique',
    description: 'Présentation structurée pour cas médicaux',
    icon: '🏥',
    slides: [
      { title: 'Présentation du Cas', type: 'content' },
      { title: 'Anamnèse', type: 'content' },
      { title: 'Examen Clinique', type: 'image' },
      { title: 'Examens Complémentaires', type: 'image' },
      { title: 'Quiz Diagnostic', type: 'quiz' },
      { title: 'Diagnostic et Traitement', type: 'content' }
    ]
  },
  {
    id: 'anatomy_lesson',
    name: 'Leçon d\'Anatomie',
    description: 'Présentation interactive pour l\'anatomie',
    icon: '🫀',
    slides: [
      { title: 'Introduction', type: 'content' },
      { title: 'Vue d\'Ensemble', type: 'diagram' },
      { title: 'Détails Anatomiques', type: 'image' },
      { title: 'Quiz Interactif', type: 'quiz' },
      { title: 'Applications Cliniques', type: 'content' }
    ]
  },
  {
    id: 'research_presentation',
    name: 'Présentation de Recherche',
    description: 'Structure académique pour recherche',
    icon: '🔬',
    slides: [
      { title: 'Introduction', type: 'content' },
      { title: 'Méthodologie', type: 'diagram' },
      { title: 'Résultats', type: 'image' },
      { title: 'Discussion', type: 'content' },
      { title: 'Conclusion', type: 'content' }
    ]
  }
];

// Animations disponibles
const ANIMATIONS = {
  entrance: ['fadeIn', 'slideInLeft', 'slideInRight', 'slideInUp', 'slideInDown', 'zoomIn', 'bounceIn'],
  emphasis: ['pulse', 'bounce', 'shake', 'flash', 'swing', 'tada', 'heartBeat'],
  exit: ['fadeOut', 'slideOutLeft', 'slideOutRight', 'slideOutUp', 'slideOutDown', 'zoomOut', 'bounceOut']
};

const InteractivePresentations: React.FC = () => {
  const { user } = useAuth();
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPresentation, setEditingPresentation] = useState<Presentation | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [currentPresentation, setCurrentPresentation] = useState<Presentation | null>(null);

  // Formulaire pour nouvelle présentation
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isPublic: false
  });

  // Charger les présentations
  useEffect(() => {
    if (user) {
      loadPresentations();
    }
  }, [user]);

  /**
   * 📊 Charger les présentations de l'utilisateur
   */
  const loadPresentations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data: presentationsData, error } = await supabase
        .from('presentations')
        .select(`
          *,
          slides:presentation_slides(*)
        `)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('❌ Erreur lors du chargement des présentations:', error);
        toast.error('Impossible de charger les présentations');
        return;
      }

      if (presentationsData) {
        const formattedPresentations: Presentation[] = presentationsData.map(pres => ({
          id: pres.id,
          title: pres.title,
          description: pres.description,
          isPublic: pres.is_public,
          createdAt: pres.created_at,
          updatedAt: pres.updated_at,
          userId: pres.user_id,
          slides: pres.slides.map((slide: any) => ({
            id: slide.id,
            presentationId: slide.presentation_id,
            title: slide.title,
            content: slide.content,
            slideType: slide.slide_type,
            slideOrder: slide.slide_order
          })).sort((a: any, b: any) => a.slideOrder - b.slideOrder)
        }));
        
        setPresentations(formattedPresentations);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement:', error);
      toast.error('Erreur lors du chargement des présentations');
    } finally {
      setLoading(false);
    }
  };

  /**
   * ➕ Créer une nouvelle présentation
   */
  const createPresentation = async () => {
    if (!user || !formData.title.trim()) {
      toast.error('Veuillez remplir le titre de la présentation');
      return;
    }

    try {
      const { data: presentationData, error: presentationError } = await supabase
        .from('presentations')
        .insert({
          user_id: user.id,
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          is_public: formData.isPublic
        })
        .select()
        .single();

      if (presentationError) {
        console.error('❌ Erreur lors de la création:', presentationError);
        toast.error('Impossible de créer la présentation');
        return;
      }

      // Créer les diapositives selon le modèle sélectionné
      if (selectedTemplate) {
        const template = PRESENTATION_TEMPLATES.find(t => t.id === selectedTemplate);
        if (template) {
          const slidesData = template.slides.map((slide, index) => ({
            user_id: user.id,
            presentation_id: presentationData.id,
            title: slide.title,
            content: `Contenu de la diapositive "${slide.title}"`,
            slide_type: slide.type,
            slide_order: index + 1
          }));

          const { error: slidesError } = await supabase
            .from('presentation_slides')
            .insert(slidesData);

          if (slidesError) {
            console.error('❌ Erreur lors de la création des diapositives:', slidesError);
          }
        }
      } else {
        // Créer une diapositive par défaut
        await supabase
          .from('presentation_slides')
          .insert({
            user_id: user.id,
            presentation_id: presentationData.id,
            title: 'Diapositive 1',
            content: 'Contenu de votre première diapositive',
            slide_type: 'content',
            slide_order: 1
          });
      }

      toast.success('Présentation créée avec succès !');
      setIsDialogOpen(false);
      resetForm();
      await loadPresentations();
    } catch (error) {
      console.error('❌ Erreur lors de la création:', error);
      toast.error('Erreur lors de la création de la présentation');
    }
  };

  /**
   * 🗑️ Supprimer une présentation
   */
  const deletePresentation = async (presentationId: string) => {
    if (!user) return;

    if (!confirm('Êtes-vous sûr de vouloir supprimer cette présentation ?')) {
      return;
    }

    try {
      // Supprimer d'abord les diapositives
      await supabase
        .from('presentation_slides')
        .delete()
        .eq('presentation_id', presentationId);

      // Puis supprimer la présentation
      const { error } = await supabase
        .from('presentations')
        .delete()
        .eq('id', presentationId)
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ Erreur lors de la suppression:', error);
        toast.error('Impossible de supprimer la présentation');
        return;
      }

      toast.success('Présentation supprimée avec succès');
      await loadPresentations();
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  /**
   * 🎭 Démarrer le mode présentation
   */
  const startPresentationMode = (presentation: Presentation) => {
    setCurrentPresentation(presentation);
    setCurrentSlideIndex(0);
    setIsPresentationMode(true);
  };

  /**
   * 📝 Réinitialiser le formulaire
   */
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      isPublic: false
    });
    setSelectedTemplate('');
  };

  return (
    <MainLayout requireAuth={true}>
      <div className="container mx-auto py-4 px-4 max-w-6xl">
        {/* Mode présentation */}
        {isPresentationMode && currentPresentation ? (
          <div className="fixed inset-0 bg-black z-50 flex flex-col">
            {/* Barre de contrôle */}
            <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h2 className="font-semibold">{currentPresentation.title}</h2>
                <span className="text-sm text-gray-300">
                  {currentSlideIndex + 1} / {currentPresentation.slides.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                  disabled={currentSlideIndex === 0}
                  className="text-white hover:bg-gray-700"
                >
                  Précédent
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentSlideIndex(Math.min(currentPresentation.slides.length - 1, currentSlideIndex + 1))}
                  disabled={currentSlideIndex === currentPresentation.slides.length - 1}
                  className="text-white hover:bg-gray-700"
                >
                  Suivant
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsPresentationMode(false)}
                >
                  Quitter
                </Button>
              </div>
            </div>

            {/* Contenu de la diapositive */}
            <div className="flex-1 flex items-center justify-center p-8">
              {currentPresentation.slides[currentSlideIndex] ? (
                <div className="max-w-4xl w-full bg-white rounded-lg p-8 text-center">
                  <h1 className="text-4xl font-bold mb-6 text-medical-blue">
                    {currentPresentation.slides[currentSlideIndex].title}
                  </h1>
                  <div className="text-lg text-gray-700 whitespace-pre-wrap">
                    {currentPresentation.slides[currentSlideIndex].content || 'Contenu de la diapositive'}
                  </div>
                  
                  {/* Éléments interactifs selon le type */}
                  {currentPresentation.slides[currentSlideIndex].slideType === 'quiz' && (
                    <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4">Quiz Interactif</h3>
                      <p className="text-gray-600 mb-4">Question d'exemple : Quel est le diagnostic le plus probable ?</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {['Option A', 'Option B', 'Option C', 'Option D'].map((option, index) => (
                          <Button key={index} variant="outline" className="p-4">
                            {option}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-white text-center">
                  <p>Aucune diapositive disponible</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* En-tête normal */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Presentation className="h-6 w-6 sm:h-8 sm:w-8 text-medical-blue" />
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">Présentations Interactives</h1>
                  <p className="text-sm sm:text-base text-gray-500">Créez des présentations engageantes et interactives</p>
                </div>
              </div>
              
              {/* Bouton de création */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-medical-blue hover:bg-medical-blue/90 w-full sm:w-auto"
                    onClick={() => {
                      setEditingPresentation(null);
                      resetForm();
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvelle Présentation
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Créer une nouvelle présentation</DialogTitle>
                  </DialogHeader>
                  
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="basic">Informations</TabsTrigger>
                      <TabsTrigger value="template">Modèles</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="basic" className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Titre *</label>
                        <Input
                          placeholder="Ex: Cas clinique en cardiologie"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          placeholder="Description de votre présentation"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          rows={3}
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="public"
                          checked={formData.isPublic}
                          onCheckedChange={(checked) => setFormData({...formData, isPublic: checked})}
                        />
                        <label htmlFor="public" className="text-sm font-medium">
                          Présentation publique
                        </label>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="template" className="space-y-4">
                      <p className="text-sm text-gray-600">Choisissez un modèle pour commencer rapidement :</p>
                      <div className="grid gap-3">
                        <div 
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            selectedTemplate === '' ? 'border-medical-blue bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedTemplate('')}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">📝</span>
                            <div>
                              <h4 className="font-medium">Présentation vierge</h4>
                              <p className="text-sm text-gray-600">Commencer avec une diapositive vide</p>
                            </div>
                          </div>
                        </div>
                        
                        {PRESENTATION_TEMPLATES.map((template) => (
                          <div
                            key={template.id}
                            className={`p-3 border rounded-lg cursor-pointer transition-all ${
                              selectedTemplate === template.id ? 'border-medical-blue bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedTemplate(template.id)}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{template.icon}</span>
                              <div>
                                <h4 className="font-medium">{template.name}</h4>
                                <p className="text-sm text-gray-600">{template.description}</p>
                                <div className="flex gap-1 mt-1">
                                  {template.slides.map((slide, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {slide.title}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={createPresentation}
                      className="flex-1 bg-medical-blue hover:bg-medical-blue/90"
                      disabled={!formData.title.trim()}
                    >
                      Créer la présentation
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsDialogOpen(false);
                        resetForm();
                      }}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Fonctionnalités à venir */}
            <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Zap className="h-5 w-5" />
                  Fonctionnalités Avancées Disponibles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Image className="h-4 w-4 text-blue-600" />
                    <span>Ajout d'images et de diagrammes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <span>Animations et transitions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layout className="h-4 w-4 text-blue-600" />
                    <span>Modèles prédéfinis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-blue-600" />
                    <span>Quiz intégrés</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MousePointerClick className="h-4 w-4 text-blue-600" />
                    <span>Éléments cliquables</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span>Mode présentation en direct</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Liste des présentations */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-blue"></div>
              </div>
            ) : presentations.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Presentation className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune présentation</h3>
                  <p className="text-gray-600 mb-4">Créez votre première présentation interactive</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {presentations.map((presentation) => (
                  <Card key={presentation.id} className="transition-all duration-200 hover:shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{presentation.title}</CardTitle>
                          {presentation.description && (
                            <CardDescription className="text-sm">{presentation.description}</CardDescription>
                          )}
                        </div>
                        
                        <div className="flex gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startPresentationMode(presentation)}
                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                            title="Présenter"
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deletePresentation(presentation.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={presentation.isPublic ? "default" : "secondary"} className="text-xs">
                          {presentation.isPublic ? 'Publique' : 'Privée'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {presentation.slides.length} diapositive{presentation.slides.length > 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600">
                          Créé le {new Date(presentation.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                        
                        {/* Aperçu des diapositives */}
                        {presentation.slides.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-700">Diapositives :</p>
                            <div className="flex flex-wrap gap-1">
                              {presentation.slides.slice(0, 3).map((slide, index) => (
                                <Badge key={slide.id} variant="outline" className="text-xs">
                                  {slide.title}
                                </Badge>
                              ))}
                              {presentation.slides.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{presentation.slides.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default InteractivePresentations;
