
// Composant mode d'étude pour réviser les fiches
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Repeat, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Flashcard } from '../types';

interface FlashcardStudyModeProps {
  flashcards: Flashcard[];
  onFinish: () => void;
}

/**
 * Composant pour étudier avec les fiches en mode révision
 */
const FlashcardStudyMode: React.FC<FlashcardStudyModeProps> = ({ flashcards, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [knownCards, setKnownCards] = useState<string[]>([]);
  
  // Progression de l'étude
  const progress = flashcards.length > 0 
    ? ((currentIndex + 1) / flashcards.length) * 100 
    : 0;
  
  // Réinitialisation lors du changement des fiches
  useEffect(() => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setKnownCards([]);
  }, [flashcards]);

  // Gestionnaire pour passer à la fiche suivante
  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      onFinish();
    }
  };

  // Gestionnaire pour revenir à la fiche précédente
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowAnswer(false);
    }
  };

  // Gestionnaire pour marquer une carte comme connue/inconnue
  const handleMarkCard = (known: boolean) => {
    const currentCard = flashcards[currentIndex];
    
    if (known) {
      setKnownCards(prev => [...prev, currentCard.id]);
    } else {
      setKnownCards(prev => prev.filter(id => id !== currentCard.id));
    }
    
    handleNext();
  };

  // S'il n'y a pas de fiches, retourner un message
  if (flashcards.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 text-center">
          <p>Aucune fiche disponible pour étudier.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={onFinish} className="w-full">Retour</Button>
        </CardFooter>
      </Card>
    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Fiche {currentIndex + 1} sur {flashcards.length}
        </span>
        
        <span className="text-sm text-gray-500">
          Connues: {knownCards.length}/{flashcards.length}
        </span>
      </div>
      
      <Progress value={progress} className="w-full" />
      
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="min-h-[300px] flex flex-col items-center justify-center">
            {showAnswer ? (
              <div className="space-y-4 text-center w-full">
                <h3 className="text-xl font-medium text-gray-500">Réponse:</h3>
                <p className="text-lg">{currentCard.answer}</p>
              </div>
            ) : (
              <div className="space-y-4 text-center w-full">
                <h3 className="text-xl font-medium">Question:</h3>
                <p className="text-lg">{currentCard.question}</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex justify-center w-full">
            {showAnswer ? (
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  className="flex items-center gap-1 text-red-500 hover:bg-red-50"
                  onClick={() => handleMarkCard(false)}
                >
                  <ThumbsDown className="h-4 w-4" />
                  <span>Je ne savais pas</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-1 text-green-500 hover:bg-green-50"
                  onClick={() => handleMarkCard(true)}
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>Je savais</span>
                </Button>
              </div>
            ) : (
              <Button 
                className="w-full" 
                onClick={() => setShowAnswer(true)}
              >
                Voir la réponse
              </Button>
            )}
          </div>
          
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Précédente</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                setCurrentIndex(0);
                setShowAnswer(false);
                setKnownCards([]);
              }}
              className="flex items-center gap-1"
            >
              <Repeat className="h-4 w-4" />
              <span>Recommencer</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={handleNext}
              disabled={currentIndex === flashcards.length - 1}
              className="flex items-center gap-1"
            >
              <span>Suivante</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FlashcardStudyMode;
