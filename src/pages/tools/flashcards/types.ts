
// Types et interfaces pour le générateur de fiches d'étude
export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface FlashcardCategory {
  id: string;
  name: string;
  color: string;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  description: string;
  flashcards: Flashcard[];
  createdAt: Date;
  category?: string;
}
