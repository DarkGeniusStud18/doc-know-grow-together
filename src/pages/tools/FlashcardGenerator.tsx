
// Ce fichier redirige vers la nouvelle implémentation du générateur de fiches
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Ce composant est un simple redirecteur vers la nouvelle implémentation
const FlashcardGeneratorRedirect = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirection automatique vers la nouvelle implémentation
    navigate('/tools/flashcards/FlashcardGenerator');
  }, [navigate]);
  
  return null; // Pas de rendu, puisque nous redirigeons immédiatement
};

export default FlashcardGeneratorRedirect;
