import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileSpreadsheet, Search, Plus, Eye, EyeOff, Trash2, Save, Book, Edit, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  lastReviewed?: Date;
  reviewCount: number;
  mastered: boolean;
}

interface Deck {
  id: string;
  name: string;
  description: string;
  category: string;
  cards: Flashcard[];
  createdAt: Date;
  lastStudied?: Date;
}

const EXAMPLE_DECKS: Deck[] = [
  {
    id: 'deck-1',
    name: 'Anatomie - Système cardiovasculaire',
    description: 'Fiches sur l\'anatomie du cœur et des vaisseaux sanguins',
    category: 'anatomie',
    cards: [
      {
        id: 'card-1',
        question: 'Quelles sont les 4 cavités du cœur?',
        answer: 'Oreillette droite, ventricule droit, oreillette gauche et ventricule gauche.',
        category: 'anatomie',
        reviewCount: 3,
        mastered: false,
      },
      {
        id: 'card-2',
        question: 'Quelles sont les 3 tuniques artérielles?',
        answer: 'Intima (endothélium), média (muscle lisse) et adventice (tissu conjonctif)',
        category: 'anatomie',
        reviewCount: 2,
        mastered: false,
      },
    ],
    createdAt: new Date('2023-10-15')
  },
  {
    id: 'deck-2',
    name: 'Physiologie - Système respiratoire',
    description: 'Mécanismes de la respiration et échanges gazeux',
    category: 'physiologie',
    cards: [
      {
        id: 'card-3',
        question: 'Qu\'est-ce que la capacité vitale?',
        answer: 'Volume d\'air maximum qui peut être expiré après une inspiration maximale. Elle est la somme du volume courant, du volume de réserve inspiratoire et du volume de réserve expiratoire.',
        category: 'physiologie',
        reviewCount: 1,
        mastered: false,
      }
    ],
    createdAt: new Date('2023-11-02')
  }
];

const FlashcardGenerator: React.FC = () => {
  // All decks
  const [decks, setDecks] = useState<Deck[]>(EXAMPLE_DECKS);
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  
  // Current deck being edited or studied
  const [currentDeck, setCurrentDeck] = useState<Deck | null>(null);
  
  // New deck form
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckDescription, setNewDeckDescription] = useState('');
  const [newDeckCategory, setNewDeckCategory] = useState('anatomie');
  
  // New card form
  const [newCardQuestion, setNewCardQuestion] = useState('');
  const [newCardAnswer, setNewCardAnswer] = useState('');
  
  // Study mode
  const [studyMode, setStudyMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Categories
  const categories = ['anatomie', 'physiologie', 'pathologie', 'pharmacologie', 'biochimie', 'histologie', 'embryologie'];
  
  // Load from localStorage on first render
  useEffect(() => {
    const savedDecks = localStorage.getItem('flashcardDecks');
    if (savedDecks) {
      try {
        const parsed = JSON.parse(savedDecks);
        // Convert string dates back to Date objects
        const processedDecks = parsed.map((deck: any) => ({
          ...deck,
          createdAt: new Date(deck.createdAt),
          lastStudied: deck.lastStudied ? new Date(deck.lastStudied) : undefined,
          cards: deck.cards.map((card: any) => ({
            ...card,
            lastReviewed: card.lastReviewed ? new Date(card.lastReviewed) : undefined
          }))
        }));
        setDecks(processedDecks);
      } catch (error) {
        console.error('Error parsing saved decks:', error);
      }
    }
  }, []);
  
  // Save to localStorage whenever decks change
  useEffect(() => {
    localStorage.setItem('flashcardDecks', JSON.stringify(decks));
  }, [decks]);

  // Update current deck when selected deck changes
  useEffect(() => {
    if (selectedDeckId) {
      const deck = decks.find(d => d.id === selectedDeckId);
      setCurrentDeck(deck || null);
    } else {
      setCurrentDeck(null);
    }
  }, [selectedDeckId, decks]);

  const filteredDecks = decks.filter(deck => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return deck.name.toLowerCase().includes(query) ||
        deck.description.toLowerCase().includes(query) ||
        deck.category.toLowerCase().includes(query);
    }
    if (categoryFilter !== 'all') {
      return deck.category === categoryFilter;
    }
    return true;
  });

  // Create a new deck
  const handleCreateDeck = () => {
    if (!newDeckName) {
      toast.error('Veuillez donner un nom au paquet');
      return;
    }

    const newDeck: Deck = {
      id: `deck-${Date.now()}`,
      name: newDeckName,
      description: newDeckDescription,
      category: newDeckCategory,
      cards: [],
      createdAt: new Date()
    };

    setDecks([...decks, newDeck]);
    setNewDeckName('');
    setNewDeckDescription('');
    setSelectedDeckId(newDeck.id);
    toast.success('Nouveau paquet créé !');
  };

  // Delete a deck
  const handleDeleteDeck = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce paquet ? Cette action est irréversible.')) {
      setDecks(decks.filter(deck => deck.id !== id));
      if (selectedDeckId === id) {
        setSelectedDeckId(null);
        setCurrentDeck(null);
      }
      toast.info('Paquet supprimé');
    }
  };

  // Create a new card in the current deck
  const handleCreateCard = () => {
    if (!currentDeck) {
      toast.error('Aucun paquet sélectionné');
      return;
    }

    if (!newCardQuestion || !newCardAnswer) {
      toast.error('Veuillez remplir la question et la réponse');
      return;
    }

    const newCard: Flashcard = {
      id: `card-${Date.now()}`,
      question: newCardQuestion,
      answer: newCardAnswer,
      category: currentDeck.category,
      reviewCount: 0,
      mastered: false,
    };

    const updatedDeck = {
      ...currentDeck,
      cards: [...currentDeck.cards, newCard]
    };

    setDecks(decks.map(deck => deck.id === currentDeck.id ? updatedDeck : deck));
    setCurrentDeck(updatedDeck);
    setNewCardQuestion('');
    setNewCardAnswer('');
    toast.success('Nouvelle carte ajoutée !');
  };

  // Delete a card from the current deck
  const handleDeleteCard = (cardId: string) => {
    if (!currentDeck) return;

    const updatedDeck = {
      ...currentDeck,
      cards: currentDeck.cards.filter(card => card.id !== cardId)
    };

    setDecks(decks.map(deck => deck.id === currentDeck.id ? updatedDeck : deck));
    setCurrentDeck(updatedDeck);
    toast.info('Carte supprimée');
  };

  // Start study mode
  const handleStartStudy = () => {
    if (!currentDeck || currentDeck.cards.length === 0) {
      toast.error('Ce paquet ne contient pas de cartes');
      return;
    }

    setStudyMode(true);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    
    // Update last studied timestamp
    const updatedDeck = {
      ...currentDeck,
      lastStudied: new Date()
    };
    
    setDecks(decks.map(deck => deck.id === currentDeck.id ? updatedDeck : deck));
    setCurrentDeck(updatedDeck);
  };

  // Exit study mode
  const handleExitStudy = () => {
    setStudyMode(false);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  // Flip card in study mode
  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
  };

  // Go to next card in study mode
  const handleNextCard = () => {
    if (!currentDeck) return;
    
    const nextIndex = (currentCardIndex + 1) % currentDeck.cards.length;
    setCurrentCardIndex(nextIndex);
    setIsFlipped(false);
  };

  // Handle card review feedback (easy, hard, etc)
  const handleCardFeedback = (mastered: boolean) => {
    if (!currentDeck) return;
    
    const updatedCards = [...currentDeck.cards];
    const currentCard = updatedCards[currentCardIndex];
    
    updatedCards[currentCardIndex] = {
      ...currentCard,
      lastReviewed: new Date(),
      reviewCount: currentCard.reviewCount + 1,
      mastered: mastered
    };
    
    const updatedDeck = {
      ...currentDeck,
      cards: updatedCards
    };
    
    setDecks(decks.map(deck => deck.id === currentDeck.id ? updatedDeck : deck));
    setCurrentDeck(updatedDeck);
    
    handleNextCard();
  };

  const handleTabChange = (tabValue: string) => {
    if (tabValue === 'browse' || tabValue === 'create') {
      setSelectedDeckId(tabValue === 'browse' ? selectedDeckId : null);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Générateur de fiches</h1>
            <p className="text-gray-500">Créez des fiches de révision pour maximiser votre apprentissage</p>
          </div>
        </div>

        {studyMode && currentDeck ? (
          <div className="grid grid-cols-1 gap-6">
            {/* Study mode UI */}
            <Card className="min-h-[500px]">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Étude: {currentDeck.name}</CardTitle>
                  <CardDescription>
                    Carte {currentCardIndex + 1} sur {currentDeck.cards.length}
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={handleExitStudy}>
                  Quitter l'étude
                </Button>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                <div 
                  className={`w-full max-w-2xl h-64 perspective-1000 cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
                  onClick={handleFlipCard}
                >
                  <div className="flashcard-inner w-full h-full relative transition-transform duration-500" style={{ 
                    transform: isFlipped ? 'rotateY(180deg)' : '',
                    transformStyle: 'preserve-3d'
                  }}>
                    {/* Front of card */}
                    <div className={`absolute w-full h-full p-8 bg-white border-2 border-medical-blue rounded-xl shadow-lg flex flex-col justify-center items-center ${isFlipped ? 'opacity-0' : 'opacity-100'}`}
                      style={{ 
                        backfaceVisibility: 'hidden',
                        transition: 'opacity 0.2s ease-out'
                      }}
                    >
                      <div className="absolute top-4 left-4 opacity-50">Question</div>
                      <h3 className="text-xl font-medium text-center">
                        {currentDeck.cards[currentCardIndex].question}
                      </h3>
                      <div className="absolute bottom-4 right-4 text-sm text-gray-400">
                        <Eye size={16} className="inline mr-1" /> Cliquez pour voir la réponse
                      </div>
                    </div>
                    
                    {/* Back of card */}
                    <div className={`absolute w-full h-full p-8 bg-gray-50 border-2 border-medical-blue rounded-xl shadow-lg flex flex-col justify-center items-center ${!isFlipped ? 'opacity-0' : 'opacity-100'}`}
                      style={{ 
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        transition: 'opacity 0.2s ease-in'
                      }}
                    >
                      <div className="absolute top-4 left-4 opacity-50">Réponse</div>
                      <div className="text-lg text-center">
                        {currentDeck.cards[currentCardIndex].answer}
                      </div>
                      <div className="absolute bottom-4 right-4 text-sm text-gray-400">
                        <EyeOff size={16} className="inline mr-1" /> Cliquez pour cacher la réponse
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center gap-4 mt-4">
                <div className="flex flex-col text-center">
                  <Button
                    variant="outline" 
                    className="bg-red-50 border-red-200 hover:bg-red-100 text-red-600"
                    onClick={() => handleCardFeedback(false)}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Difficile
                  </Button>
                  <span className="text-xs mt-1 text-gray-500">Revoir bientôt</span>
                </div>
                <div className="flex flex-col text-center">
                  <Button
                    variant="outline"
                    onClick={handleNextCard}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Passer
                  </Button>
                  <span className="text-xs mt-1 text-gray-500">Revoir plus tard</span>
                </div>
                <div className="flex flex-col text-center">
                  <Button
                    variant="outline"
                    className="bg-green-50 border-green-200 hover:bg-green-100 text-green-600"
                    onClick={() => handleCardFeedback(true)}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Facile
                  </Button>
                  <span className="text-xs mt-1 text-gray-500">Maîtrisé</span>
                </div>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <Tabs defaultValue={selectedDeckId || 'browse'} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="browse">Parcourir les paquets</TabsTrigger>
              <TabsTrigger value="create">Créer un paquet</TabsTrigger>
            </TabsList>
            
            <TabsContent value="browse">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left column: Deck list */}
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Mes paquets</CardTitle>
                    <CardDescription>
                      {filteredDecks.length} {filteredDecks.length > 1 ? 'paquets' : 'paquet'} disponibles
                    </CardDescription>
                    <div className="flex flex-col gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Rechercher des paquets..."
                          className="pl-9"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Select 
                        value={categoryFilter}
                        onValueChange={setCategoryFilter}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Filtrer par catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes les catégories</SelectItem>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[500px] pr-4">
                      <div className="space-y-2">
                        {filteredDecks.length > 0 ? (
                          filteredDecks.map((deck) => (
                            <div 
                              key={deck.id}
                              className={`p-3 rounded-lg border ${selectedDeckId === deck.id ? 'border-medical-blue bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'} cursor-pointer`}
                              onClick={() => setSelectedDeckId(deck.id)}
                            >
                              <div className="font-medium">{deck.name}</div>
                              <div className="text-xs text-gray-500 mb-2">{deck.description}</div>
                              <div className="flex items-center justify-between">
                                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                  {deck.category.charAt(0).toUpperCase() + deck.category.slice(1)}
                                </Badge>
                                <span className="text-xs text-gray-500">{deck.cards.length} cartes</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-300" />
                            <h3 className="mt-2 text-lg font-medium">Aucun paquet trouvé</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Créez un nouveau paquet ou modifiez vos filtres
                            </p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Right column: Selected deck or placeholder */}
                <Card className="md:col-span-2">
                  {currentDeck ? (
                    <>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{currentDeck.name}</CardTitle>
                            <CardDescription>{currentDeck.description}</CardDescription>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                {currentDeck.category.charAt(0).toUpperCase() + currentDeck.category.slice(1)}
                              </Badge>
                              <Badge variant="outline" className="bg-gray-50">
                                {currentDeck.cards.length} cartes
                              </Badge>
                              <Badge variant="outline" className="bg-gray-50">
                                Créé le {new Intl.DateTimeFormat('fr-FR').format(currentDeck.createdAt)}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              className="text-red-500 hover:bg-red-50"
                              onClick={() => handleDeleteDeck(currentDeck.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </Button>
                            <Button
                              disabled={currentDeck.cards.length === 0}
                              onClick={handleStartStudy}
                            >
                              <Book className="mr-2 h-4 w-4" />
                              Étudier
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Add new card form */}
                        <Card>
                          <CardHeader>
                            <CardTitle>Ajouter une carte</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <label className="text-sm font-medium block mb-1">Question</label>
                              <Textarea 
                                placeholder="Entrez votre question..."
                                rows={2}
                                value={newCardQuestion}
                                onChange={(e) => setNewCardQuestion(e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium block mb-1">Réponse</label>
                              <Textarea
                                placeholder="Entrez la réponse..."
                                rows={3}
                                value={newCardAnswer}
                                onChange={(e) => setNewCardAnswer(e.target.value)}
                              />
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button onClick={handleCreateCard} className="w-full">
                              <Plus className="mr-2 h-4 w-4" />
                              Ajouter cette carte
                            </Button>
                          </CardFooter>
                        </Card>

                        {/* Card list */}
                        <div>
                          <h3 className="font-medium mb-3">Cartes dans ce paquet</h3>
                          <div className="space-y-3">
                            {currentDeck.cards.length > 0 ? (
                              currentDeck.cards.map((card) => (
                                <Card key={card.id}>
                                  <CardContent className="pt-4 pb-3">
                                    <div className="flex justify-between">
                                      <h4 className="font-medium">{card.question}</h4>
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        className="text-red-500 hover:bg-red-50 h-8 w-8" 
                                        onClick={() => handleDeleteCard(card.id)}
                                      >
                                        <Trash2 size={16} />
                                      </Button>
                                    </div>
                                    <div className="mt-1 text-sm text-gray-700">
                                      {card.answer}
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                      <div className="flex gap-2">
                                        {card.mastered ? (
                                          <Badge variant="outline" className="bg-green-50 text-green-700">
                                            Maîtrisé
                                          </Badge>
                                        ) : (
                                          <Badge variant="outline" className="bg-amber-50 text-amber-700">
                                            À réviser
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        Révisé {card.reviewCount} fois
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))
                            ) : (
                              <div className="text-center py-8 bg-gray-50 rounded-lg border">
                                <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-300" />
                                <h3 className="mt-2 text-lg font-medium">Aucune carte</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                  Ajoutez des cartes à ce paquet pour commencer
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[500px]">
                      <FileSpreadsheet className="h-16 w-16 text-gray-300 mb-4" />
                      <h3 className="text-xl font-medium mb-2">Aucun paquet sélectionné</h3>
                      <p className="text-gray-500 mb-4 text-center max-w-md">
                        Sélectionnez un paquet existant ou créez-en un nouveau pour commencer
                      </p>
                      <Button onClick={() => document.querySelector('[value="create"]')?.click()}>
                        <Plus className="mr-2 h-4 w-4" />
                        Créer un paquet
                      </Button>
                    </div>
                  )}
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="create">
              <Card>
                <CardHeader>
                  <CardTitle>Créer un nouveau paquet</CardTitle>
                  <CardDescription>Créez un nouveau paquet de fiches pour organiser vos révisions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">Nom du paquet</label>
                    <Input
                      placeholder="Ex: Anatomie - Système cardiovasculaire"
                      value={newDeckName}
                      onChange={(e) => setNewDeckName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Description</label>
                    <Textarea
                      placeholder="Décrivez le contenu de ce paquet..."
                      value={newDeckDescription}
                      onChange={(e) => setNewDeckDescription(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Catégorie</label>
                    <Select 
                      value={newDeckCategory}
                      onValueChange={setNewDeckCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleCreateDeck} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Créer ce paquet
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </MainLayout>
  );
};

export default FlashcardGenerator;
