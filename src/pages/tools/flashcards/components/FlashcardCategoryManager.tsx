
// Composant pour gérer les catégories de fiches
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Circle, Plus, Tag, Trash2, X } from 'lucide-react';
import { FlashcardCategory } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface FlashcardCategoryManagerProps {
  categories: FlashcardCategory[];
  onCategoryChange: (categories: FlashcardCategory[]) => void;
}

// Couleurs disponibles pour les catégories
const AVAILABLE_COLORS = [
  '#60a5fa', // blue
  '#34d399', // green
  '#f97316', // orange
  '#a78bfa', // purple
  '#f43f5e', // pink
  '#facc15', // yellow
  '#64748b', // slate
  '#14b8a6', // teal
];

/**
 * Composant pour gérer les catégories de fiches d'étude
 */
const FlashcardCategoryManager: React.FC<FlashcardCategoryManagerProps> = ({ 
  categories, 
  onCategoryChange 
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0]);
  
  // Gestionnaire d'ajout d'une nouvelle catégorie
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const newCategory: FlashcardCategory = {
      id: uuidv4(),
      name: newCategoryName.trim(),
      color: selectedColor
    };
    
    onCategoryChange([...categories, newCategory]);
    setNewCategoryName('');
    setSelectedColor(AVAILABLE_COLORS[0]);
    setIsDialogOpen(false);
  };
  
  // Gestionnaire de suppression d'une catégorie
  const handleDeleteCategory = (id: string) => {
    onCategoryChange(categories.filter(cat => cat.id !== id));
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Catégories</CardTitle>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Ajouter</span>
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle catégorie</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de la catégorie</Label>
                <Input
                  id="name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Ex: Anatomie, Pharmacologie, etc."
                />
              </div>
              
              <div className="space-y-2">
                <Label>Couleur</Label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${
                        selectedColor === color ? 'scale-110 ring-2 ring-offset-2' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      {selectedColor === color && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button 
                type="button" 
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim()}
              >
                Ajouter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      
      <CardContent>
        {categories.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Tag className="mx-auto h-10 w-10 opacity-20" />
            <p className="mt-2">Aucune catégorie. Créez votre première catégorie.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-2 rounded bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Circle className="h-4 w-4" style={{ color: category.color }} />
                  <span>{category.name}</span>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteCategory(category.id)}
                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FlashcardCategoryManager;
