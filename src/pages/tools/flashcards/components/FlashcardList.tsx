
// Composant pour afficher une liste de fiches
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Flashcard, FlashcardCategory } from '../types';

interface FlashcardListProps {
  flashcards: Flashcard[];
  categories: FlashcardCategory[];
  onEdit: (flashcard: Flashcard) => void;
  onDelete: (id: string) => void;
}

/**
 * Composant pour afficher une liste de fiches d'étude
 */
const FlashcardList: React.FC<FlashcardListProps> = ({ 
  flashcards, 
  categories, 
  onEdit, 
  onDelete 
}) => {
  // Fonction pour récupérer les détails d'une catégorie par son ID
  const getCategoryById = (id?: string) => {
    if (!id) return null;
    return categories.find(cat => cat.id === id);
  };

  return (
    <div className="space-y-4">
      {flashcards.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            Aucune fiche disponible. Créez votre première fiche !
          </p>
        </div>
      ) : (
        flashcards.map((flashcard) => {
          const category = getCategoryById(flashcard.category);
          
          return (
            <Card key={flashcard.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <h3 className="font-medium">{flashcard.question}</h3>
                    <p className="text-gray-600">{flashcard.answer}</p>
                    
                    {category && (
                      <div className="pt-2">
                        <Badge className="flex items-center gap-1 w-fit" 
                              style={{ backgroundColor: category.color }}>
                          <Tag className="h-3 w-3" />
                          <span>{category.name}</span>
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    <Button
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onEdit(flashcard)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onDelete(flashcard.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default FlashcardList;
