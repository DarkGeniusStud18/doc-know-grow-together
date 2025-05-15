
// Page d'erreur 404 - Affichée lorsqu'un utilisateur tente d'accéder à une route inexistante
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HomeIcon, MoveLeft, Search } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

/**
 * Composant pour la page 404 (page non trouvée)
 * Affiche un message amical et des options pour retourner à l'accueil ou explorer le site
 */
const NotFound = () => {
  const location = useLocation();

  // Enregistre dans la console les tentatives d'accès à des routes inexistantes
  useEffect(() => {
    console.error(
      "Erreur 404: Tentative d'accès à une route inexistante:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <SEOHead 
        title="Page non trouvée" 
        description="La page que vous recherchez n'existe pas ou a été déplacée." 
        canonicalUrl="/404"
      />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 rounded-lg shadow-lg bg-white">
          <h1 className="text-6xl font-bold mb-4 text-medical-blue">404</h1>
          <p className="text-xl text-gray-600 mb-4">
            Oups ! Page non trouvée
          </p>
          <p className="text-gray-500 mb-6">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <div className="flex flex-col md:flex-row gap-3 justify-center">
            <Button asChild className="flex items-center justify-center gap-2">
              <Link to="/">
                <HomeIcon className="h-4 w-4" />
                Accueil
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex items-center justify-center gap-2">
              <Link to="/dashboard">
                <MoveLeft className="h-4 w-4" />
                Tableau de bord
              </Link>
            </Button>
            <Button asChild variant="secondary" className="flex items-center justify-center gap-2">
              <Link to="/resources">
                <Search className="h-4 w-4" />
                Explorer les ressources
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
