
// Page d'erreur 404 - Affichée lorsqu'un utilisateur tente d'accéder à une route inexistante
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";

/**
 * Composant pour la page 404 (page non trouvée)
 * Affiche un message amical et un bouton pour retourner à l'accueil
 */
const NotFound = () => {
  const location = useLocation();

  // Enregistre dans la console les tentatives d'accès à des routes inexistantes
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-6 rounded-lg shadow-lg bg-white">
        <h1 className="text-6xl font-bold mb-4 text-medical-blue">404</h1>
        <p className="text-xl text-gray-600 mb-4">
          Oups ! Page non trouvée
        </p>
        <p className="text-gray-500 mb-6">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Button asChild className="flex items-center justify-center gap-2">
          <Link to="/">
            <MoveLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
