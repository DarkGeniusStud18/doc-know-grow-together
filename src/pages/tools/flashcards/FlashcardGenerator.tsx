
// Générateur de fiches de révision - Page principale
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import MainLayout from '@/components/layout/MainLayout';
import { Flashcard, FlashcardCategory, FlashcardDeck } from './types';
import FlashcardForm from './components/FlashcardForm';
import FlashcardList from './components/FlashcardList';
import FlashcardStudyMode from './components/FlashcardStudyMode';
import FlashcardImport from './components/FlashcardImport';
import FlashcardCategoryManager from './components/FlashcardCategoryManager';
import { Plus, Search, Save, Trash2, BookOpen, FileUp, Tag } from 'lucide-react';

/**
 * Générateur de fiches d'étude - Page principale
 * Permet de créer, importer, organiser et étudier des fiches de révision
 */
const FlashcardGenerator: React.FC = () => {
  // Navigation et état actif
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('create');
  
  // États pour les fiches et catégories
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [categories, setCategories] = useState<FlashcardCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // États pour la gestion des fiches
  const [editingFlashcard, setEditingFlashcard] = useState<Flashcard | null>(null);
  const [deckTitle, setDeckTitle] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  
  // Charger les données depuis le stockage local au démarrage
  useEffect(() => {
    try {
      const savedFlashcards = localStorage.getItem('flashcards');
      const savedCategories = localStorage.getItem('flashcardCategories');
      
      if (savedFlashcards) {
        setFlashcards(JSON.parse(savedFlashcards));
      }
      
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des fiches:', error);
    }
  }, []);
  
  // Sauvegarder les fiches dans le stockage local lorsqu'elles sont modifiées
  useEffect(() => {
    try {
      localStorage.setItem('flashcards', JSON.stringify(flashcards));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des fiches:', error);
    }
  }, [flashcards]);
  
  // Sauvegarder les catégories dans le stockage local lorsqu'elles sont modifiées
  useEffect(() => {
    try {
      localStorage.setItem('flashcardCategories', JSON.stringify(categories));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des catégories:', error);
    }
  }, [categories]);
  
  // Gérer le changement d'onglet
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setEditingFlashcard(null);
  };
  
  // Ajouter ou mettre à jour une fiche
  const handleSaveFlashcard = (flashcardData: Omit<Flashcard, 'id'>) => {
    if (editingFlashcard) {
      // Mise à jour d'une fiche existante
      setFlashcards(current => 
        current.map(card => 
          card.id === editingFlashcard.id 
            ? { ...card, ...flashcardData } 
            : card
        )
      );
      setEditingFlashcard(null);
      toast.success("Fiche mise à jour avec succès");
    } else {
      // Ajout d'une nouvelle fiche
      const newFlashcard: Flashcard = {
        id: uuidv4(),
        ...flashcardData
      };
      
      setFlashcards(current => [...current, newFlashcard]);
      toast.success("Nouvelle fiche ajoutée");
    }
  };
  
  // Modifier une fiche existante
  const handleEditFlashcard = (flashcard: Flashcard) => {
    setEditingFlashcard(flashcard);
    handleTabChange('create');
  };
  
  // Supprimer une fiche
  const handleDeleteFlashcard = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette fiche ?')) {
      setFlashcards(current => current.filter(card => card.id !== id));
      toast.success("Fiche supprimée");
    }
  };
  
  // Importer des fiches
  const handleImportFlashcards = (importedCards: Flashcard[]) => {
    setFlashcards(current => [...current, ...importedCards]);
  };
  
  // Sauvegarder un jeu de fiches
  const handleSaveDeck = () => {
    if (!deckTitle.trim()) {
      toast.error("Veuillez donner un titre à votre jeu de fiches");
      return;
    }
    
    if (flashcards.length === 0) {
      toast.error("Ajoutez au moins une fiche avant de sauvegarder");
      return;
    }
    
    const newDeck: FlashcardDeck = {
      id: uuidv4(),
      title: deckTitle.trim(),
      description: deckDescription.trim(),
      flashcards: [...flashcards],
      createdAt: new Date()
    };
    
    // Sauvegarder dans le stockage local
    try {
      const savedDecks = localStorage.getItem('flashcardDecks');
      const decks: FlashcardDeck[] = savedDecks ? JSON.parse(savedDecks) : [];
      
      localStorage.setItem('flashcardDecks', JSON.stringify([...decks, newDeck]));
      toast.success("Jeu de fiches sauvegardé avec succès");
      
      // Réinitialiser les formulaires
      setDeckTitle('');
      setDeckDescription('');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du jeu:', error);
      toast.error("Erreur lors de la sauvegarde");
    }
  };
  
  // Supprimer toutes les fiches
  const handleClearAllFlashcards = () => {
    if (flashcards.length === 0) return;
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer toutes les ${flashcards.length} fiches ?`)) {
      setFlashcards([]);
      toast.success("Toutes les fiches ont été supprimées");
    }
  };
  
  // Filtrer les fiches selon la recherche
  const filteredFlashcards = flashcards.filter(card => 
    card.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Générateur de fiches</h1>
            <p className="text-gray-500">
              Créez des fiches de révision pour optimiser votre apprentissage
            </p>
          </div>
          
          {flashcards.length > 0 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="text-red-500"
                onClick={handleClearAllFlashcards}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Tout effacer
              </Button>
              
              {activeTab !== 'study' && (
                <Button onClick={() => handleTabChange('study')}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Mode étude
                </Button>
              )}
            </div>
          )}
        </div>
      
        <Tabs
          defaultValue="create"
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-4 mb-8">
            <TabsTrigger value="create" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Créer</span>
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-1">
              <Search className="h-4 w-4" />
              <span>Gérer</span>
            </TabsTrigger>
            <TabsTrigger value="study" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>Étudier</span>
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center gap-1">
              <FileUp className="h-4 w-4" />
              <span>Importer</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="create">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <FlashcardForm 
                  onSave={handleSaveFlashcard}
                  categories={categories}
                  initialFlashcard={editingFlashcard || undefined}
                  onCancel={editingFlashcard ? () => setEditingFlashcard(null) : undefined}
                />
              </div>
              
              <div className="lg:col-span-1">
                <FlashcardCategoryManager 
                  categories={categories}
                  onCategoryChange={setCategories}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="manage">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-center gap-4">
                      <Search className="h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Rechercher dans vos fiches..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-4">
                        {filteredFlashcards.length} fiche(s) trouvée(s)
                      </p>
                      
                      <FlashcardList 
                        flashcards={filteredFlashcards}
                        categories={categories}
                        onEdit={handleEditFlashcard}
                        onDelete={handleDeleteFlashcard}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-lg font-medium">Sauvegarder le jeu</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Titre</label>
                        <Input
                          placeholder="Ex: Anatomie - Système nerveux"
                          value={deckTitle}
                          onChange={(e) => setDeckTitle(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">Description (optionnelle)</label>
                        <Input
                          placeholder="Description du jeu de fiches"
                          value={deckDescription}
                          onChange={(e) => setDeckDescription(e.target.value)}
                        />
                      </div>
                      
                      <Button 
                        className="w-full"
                        onClick={handleSaveDeck}
                        disabled={!deckTitle.trim() || flashcards.length === 0}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Sauvegarder le jeu
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="study">
            <div className="max-w-2xl mx-auto">
              <FlashcardStudyMode 
                flashcards={flashcards} 
                onFinish={() => handleTabChange('manage')} 
              />
            </div>
          </TabsContent>
          
          <TabsContent value="import">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="lg:col-span-1">
                <FlashcardImport onImport={handleImportFlashcards} />
              </div>
              
              <div className="lg:col-span-1">
                <Card className="w-full h-full">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
                      <FileUp className="h-16 w-16 text-gray-300" />
                      <h3 className="text-xl font-medium">Importer vos fiches</h3>
                      <p className="text-gray-500 max-w-md">
                        Importez des fiches depuis un format CSV ou texte pour gagner du temps.
                        Suivez les instructions à gauche pour formater correctement vos données.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default FlashcardGenerator;
