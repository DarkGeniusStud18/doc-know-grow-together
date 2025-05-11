
// Composant de formulaire pour créer ou éditer une fiche
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Flashcard, FlashcardCategory } from '../types';

interface FlashcardFormProps {
  onSave: (flashcard: Omit<Flashcard, 'id'>) => void;
  categories: FlashcardCategory[];
  initialFlashcard?: Flashcard;
  onCancel?: () => void;
}

/**
 * Composant de formulaire pour créer ou éditer une fiche d'étude
 */
const FlashcardForm: React.FC<FlashcardFormProps> = ({ 
  onSave, 
  categories, 
  initialFlashcard,
  onCancel 
}) => {
  // État local pour le formulaire
  const [question, setQuestion] = useState(initialFlashcard?.question || '');
  const [answer, setAnswer] = useState(initialFlashcard?.answer || '');
  const [category, setCategory] = useState(initialFlashcard?.category || '');

  // Gestionnaire de soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation basique des champs requis
    if (!question.trim() || !answer.trim()) return;
    
    onSave({
      question: question.trim(),
      answer: answer.trim(),
      category: category || undefined
    });
    
    // Réinitialisation du formulaire si ce n'est pas une édition
    if (!initialFlashcard) {
      setQuestion('');
      setAnswer('');
      setCategory('');
    }
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>
            {initialFlashcard ? 'Modifier la fiche' : 'Créer une nouvelle fiche'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Textarea
              id="question"
              placeholder="Entrez votre question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="answer">Réponse</Label>
            <Textarea
              id="answer"
              placeholder="Entrez la réponse..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
              className="min-h-[150px]"
            />
          </div>
          
          {categories.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie (optionnelle)</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucune catégorie</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          )}
          <Button type="submit">
            {initialFlashcard ? 'Mettre à jour' : 'Ajouter la fiche'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default FlashcardForm;
