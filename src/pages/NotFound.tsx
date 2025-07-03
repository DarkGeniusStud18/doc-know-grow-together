
/**
 * 🔍 Page 404 - Redesign Professionnel avec Navigation Améliorée
 * 
 * Fonctionnalités :
 * - Design moderne et professionnel
 * - Navigation contextuelle intelligente
 * - Suggestions adaptées selon l'utilisateur
 * - Animation fluide et responsive
 */

import React, { useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  HomeIcon, 
  ArrowLeft, 
  Search, 
  BookOpen, 
  Users, 
  Stethoscope,
  Target,
  Music,
  Calendar,
  Settings
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import SEOHead from "@/components/seo/SEOHead";

/**
 * 🔍 Composant pour la page 404 professionnelle
 * Interface moderne avec navigation contextuelle
 */
const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Enregistrer l'erreur 404 pour débogage
  useEffect(() => {
    console.error(
      "❌ Erreur 404: Tentative d'accès à une route inexistante:",
      location.pathname
    );
  }, [location.pathname]);

  /**
   * 📱 Suggestions de navigation selon l'utilisateur
   */
  const getNavigationSuggestions = () => {
    const baseSuggestions = [
      {
        icon: HomeIcon,
        label: "Accueil",
        href: "/",
        description: "Retour à la page principale"
      },
      {
        icon: BookOpen,
        label: "Ressources médicales",
        href: "/resources",
        description: "Consulter les ressources d'étude"
      },
      {
        icon: Users,
        label: "Communauté",
        href: "/community",
        description: "Rejoindre les discussions"
      }
    ];

    if (user) {
      return [
        {
          icon: HomeIcon,
          label: "Dashboard",
          href: "/dashboard",
          description: "Retour au tableau de bord"
        },
        ...baseSuggestions.slice(1),
        {
          icon: Stethoscope,
          label: "Cas cliniques",
          href: "/clinical-cases",
          description: "Étudier les cas pratiques"
        },
        {
          icon: Target,
          label: "Outils d'étude",
          href: "/tools",
          description: "Accéder aux outils de productivité"
        }
      ];
    }

    return baseSuggestions;
  };

  const suggestions = getNavigationSuggestions();

  return (
    <>
      <SEOHead 
        title="Page non trouvée - MedCollab" 
        description="La page que vous recherchez n'existe pas ou a été déplacée." 
        canonicalUrl="/404"
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-8">
          
          {/* Animation 404 */}
          <div className="text-center space-y-4">
            <div className="relative">
              <h1 className="text-8xl sm:text-9xl font-bold text-medical-blue/20 select-none">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-medical-blue rounded-full flex items-center justify-center animate-pulse">
                  <Search className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Page introuvable
              </h2>
              <p className="text-gray-600 text-base sm:text-lg max-w-md mx-auto">
                La page que vous recherchez n'existe pas ou a été déplacée.
              </p>
              <p className="text-sm text-gray-500">
                URL demandée : <code className="bg-gray-100 px-2 py-1 rounded text-xs">{location.pathname}</code>
              </p>
            </div>
          </div>

          {/* Actions rapides */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 space-y-6">
              
              {/* Boutons de navigation principaux */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => navigate(-1)}
                  variant="outline" 
                  className="flex-1 h-12 text-base"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Page précédente
                </Button>
                <Button 
                  asChild 
                  className="flex-1 h-12 text-base bg-medical-blue hover:bg-medical-blue/90"
                >
                  <Link to={user ? "/dashboard" : "/"}>
                    <HomeIcon className="h-5 w-5 mr-2" />
                    {user ? "Dashboard" : "Accueil"}
                  </Link>
                </Button>
              </div>

              {/* Séparateur */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">ou explorez</span>
                </div>
              </div>

              {/* Suggestions de navigation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    asChild
                    variant="ghost"
                    className="h-auto p-4 justify-start text-left hover:bg-medical-light/20 transition-colors"
                  >
                    <Link to={suggestion.href}>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-medical-blue/10 rounded-lg">
                          <suggestion.icon className="h-5 w-5 text-medical-blue" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900">{suggestion.label}</p>
                          <p className="text-sm text-gray-600 truncate">{suggestion.description}</p>
                        </div>
                      </div>
                    </Link>
                  </Button>
                ))}
              </div>

              {/* Message d'encouragement */}
              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Besoin d'aide ? Consultez nos{" "}
                  <Link 
                    to="/resources" 
                    className="text-medical-blue hover:underline font-medium"
                  >
                    ressources d'aide
                  </Link>
                  {" "}ou{" "}
                  <Link 
                    to="/community" 
                    className="text-medical-blue hover:underline font-medium"
                  >
                    posez une question à la communauté
                  </Link>
                  .
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 MedCollab - Plateforme d'apprentissage médical</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
