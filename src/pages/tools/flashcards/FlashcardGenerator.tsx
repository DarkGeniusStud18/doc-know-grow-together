
// Générateur de fiches d'étude interactif
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Plus, Settings2, LayoutGrid } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import FlashcardList from './components/FlashcardList';
import FlashcardForm from './components/FlashcardForm';
import FlashcardStudyMode from './components/FlashcardStudyMode';
import FlashcardImport from './components/FlashcardImport';
import FlashcardCategoryManager from './components/FlashcardCategoryManager';
import { Flashcard, FlashcardCategory, FlashcardDeck } from './types';

/**
 * Générateur complet de fiches d'étude avec gestion des catégories et modes d'étude
 */
const FlashcardGenerator = () => {
  // État pour les fiches et catégories
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [categories, setCategories] = useState<FlashcardCategory[]>([]);
  const [editingFlashcard, setEditingFlashcard] = useState<Flashcard | null>(null);
  const [activeView, setActiveView] = useState('list'); // 'list', 'study', 'import', 'categories'
  const [showForm, setShowForm] = useState(false);
  
  // Charger les fiches et catégories depuis le stockage local au démarrage
  useEffect(() => {
    const savedFlashcards = localStorage.getItem('flashcards');
    const savedCategories = localStorage.getItem('flashcardCategories');
    
    if (savedFlashcards) {
      try {
        setFlashcards(JSON.parse(savedFlashcards));
      } catch (e) {
        console.error('Erreur lors du chargement des fiches:', e);
      }
    }
    
    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories));
      } catch (e) {
        console.error('Erreur lors du chargement des catégories:', e);
      }
    }
  }, []);
  
  // Sauvegarder les fiches et catégories dans le stockage local
  useEffect(() => {
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
  }, [flashcards]);
  
  useEffect(() => {
    localStorage.setItem('flashcardCategories', JSON.stringify(categories));
  }, [categories]);
  
  // Gérer l'ajout d'une nouvelle fiche
  const handleSaveFlashcard = (flashcardData: Omit<Flashcard, 'id'>) => {
    if (editingFlashcard) {
      // Mettre à jour une fiche existante
      const updatedFlashcards = flashcards.map(card => 
        card.id === editingFlashcard.id ? { ...flashcardData, id: editingFlashcard.id } : card
      );
      setFlashcards(updatedFlashcards);
      setEditingFlashcard(null);
      toast.success('Fiche mise à jour avec succès!');
    } else {
      // Ajouter une nouvelle fiche
      const newFlashcard: Flashcard = {
        id: uuidv4(),
        ...flashcardData
      };
      setFlashcards([...flashcards, newFlashcard]);
      toast.success('Nouvelle fiche ajoutée!');
    }
    setShowForm(false);
  };
  
  // Gérer la suppression d'une fiche
  const handleDeleteFlashcard = (id: string) => {
    setFlashcards(flashcards.filter(card => card.id !== id));
    toast.info('Fiche supprimée.');
  };
  
  // Gérer l'édition d'une fiche
  const handleEditFlashcard = (flashcard: Flashcard) => {
    setEditingFlashcard(flashcard);
    setShowForm(true);
  };
  
  // Gérer l'import de fiches
  const handleImportFlashcards = (importedFlashcards: Flashcard[]) => {
    setFlashcards([...flashcards, ...importedFlashcards]);
    setActiveView('list');
  };
  
  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Générateur de fiches d'étude</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Panel principal */}
          <div className="flex-1">
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Mes fiches</CardTitle>
                    <CardDescription>
                      {flashcards.length} fiches disponibles
                    </CardDescription>
                  </div>
                  
                  <div className="flex">
                    <Button 
                      onClick={() => {
                        setEditingFlashcard(null);
                        setShowForm(!showForm);
                      }}
                      size="sm"
                      className="mr-2"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Créer
                    </Button>
                    
                    <Button 
                      variant={activeView === 'study' ? 'default' : 'outline'}
                      onClick={() => setActiveView('study')}
                      disabled={flashcards.length === 0}
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <BookOpen className="h-4 w-4" /> Étudier
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {showForm ? (
                  <FlashcardForm 
                    onSave={handleSaveFlashcard} 
                    categories={categories} 
                    initialFlashcard={editingFlashcard || undefined}
                    onCancel={() => {
                      setShowForm(false);
                      setEditingFlashcard(null);
                    }}
                  />
                ) : (
                  activeView === 'list' ? (
                    <FlashcardList 
                      flashcards={flashcards}
                      categories={categories}
                      onEdit={handleEditFlashcard}
                      onDelete={handleDeleteFlashcard}
                    />
                  ) : activeView === 'study' ? (
                    <FlashcardStudyMode 
                      flashcards={flashcards}
                      onFinish={() => setActiveView('list')}
                    />
                  ) : activeView === 'import' ? (
                    <FlashcardImport onImport={handleImportFlashcards} />
                  ) : (
                    <FlashcardCategoryManager 
                      categories={categories}
                      onCategoryChange={setCategories}
                    />
                  )
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Panel latéral */}
          <div className="lg:w-72">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Gestion</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <Button 
                      variant={activeView === 'list' ? 'default' : 'outline'} 
                      className="w-full justify-start" 
                      onClick={() => setActiveView('list')}
                    >
                      <LayoutGrid className="h-4 w-4 mr-2" />
                      Mes fiches
                    </Button>
                    
                    <Button 
                      variant={activeView === 'import' ? 'default' : 'outline'} 
                      className="w-full justify-start" 
                      onClick={() => setActiveView('import')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Importer
                    </Button>
                    
                    <Button 
                      variant={activeView === 'categories' ? 'default' : 'outline'} 
                      className="w-full justify-start" 
                      onClick={() => setActiveView('categories')}
                    >
                      <Settings2 className="h-4 w-4 mr-2" />
                      Catégories
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Statistiques</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total des fiches</span>
                      <span className="font-medium">{flashcards.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Catégories</span>
                      <span className="font-medium">{categories.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FlashcardGenerator;
