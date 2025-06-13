
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
  name: string;
  description?: string;
  flashcards: Flashcard[];
  created_at: string;
  updated_at: string;
}
