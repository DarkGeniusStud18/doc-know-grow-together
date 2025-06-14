
/**
 * Tableau de bord principal - Page d'accueil après connexion
 * 
 * Cette page affiche les fonctionnalités principales de l'application adaptées au rôle de l'utilisateur.
 * Elle évite les boucles de chargement infinies grâce à une gestion d'état optimisée.
 */
import React, { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Book,
  Calendar,
  Clock,
  FileText,
  LucideAudioLines,
  MessageSquare,
  Search,
  User,
  Users,
  Stethoscope,
  GraduationCap,
  BookOpen,
  Microscope,
  Activity,
  Brain,
  Music,
  Target,
  TrendingUp,
} from "lucide-react";

/**
 * Interface pour définir la structure des cartes de fonctionnalités
 * Assure la cohérence des données affichées dans le tableau de bord
 */
interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  color: string;
  category?: 'primary' | 'secondary';
}

/**
 * Tableau de bord personnalisé qui affiche des fonctionnalités adaptées
 * au rôle de l'utilisateur (étudiant ou professionnel)
 * 
 * Fonctionnalités principales :
 * - Prévention des boucles de chargement infinies
 * - Interface adaptative selon le rôle utilisateur
 * - Cartes d'actions optimisées et responsives
 * - Gestion d'erreurs robuste
 */
const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Prévention des boucles de redirection infinies avec une gestion d'état optimisée
  useEffect(() => {
    // Éviter les redirections pendant le chargement initial
    if (loading) return;
    
    // Redirection sécurisée vers la page de connexion si nécessaire
    if (!user) {
      console.log('Utilisateur non connecté, redirection vers login');
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  /**
   * Cartes de fonctionnalités pour les étudiants en médecine
   * Mémorisées pour éviter les re-rendus inutiles
   */
  const studentFeatureCards: FeatureCard[] = useMemo(() => [
    {
      title: "Fiches de révision",
      description: "Créez et organisez vos fiches pour optimiser vos révisions médicales.",
      icon: <GraduationCap className="h-8 w-8 text-blue-500" />,
      link: "/notes",
      color: "bg-blue-50 hover:bg-blue-100",
      category: 'primary'
    },
    {
      title: "Groupes d'étude",
      description: "Rejoignez ou créez des groupes d'étude collaboratifs avec d'autres étudiants.",
      icon: <Users className="h-8 w-8 text-orange-500" />,
      link: "/study-groups",
      color: "bg-orange-50 hover:bg-orange-100",
      category: 'primary'
    },
    {
      title: "Simulateur d'examens",
      description: "Entraînez-vous aux examens avec des QCM et des cas cliniques réalistes.",
      icon: <FileText className="h-8 w-8 text-red-500" />,
      link: "/exam-simulator",
      color: "bg-red-50 hover:bg-red-100",
      category: 'primary'
    },
    {
      title: "Technique Pomodoro",
      description: "Optimisez votre concentration avec des sessions de travail chronométrées.",
      icon: <Clock className="h-8 w-8 text-green-500" />,
      link: "/tools",
      color: "bg-green-50 hover:bg-green-100",
      category: 'secondary'
    },
    {
      title: "Planificateur d'études",
      description: "Organisez votre emploi du temps et planifiez efficacement vos révisions.",
      icon: <Calendar className="h-8 w-8 text-purple-500" />,
      link: "/calendar",
      color: "bg-purple-50 hover:bg-purple-100",
      category: 'primary'
    },
    {
      title: "Musique de concentration",
      description: "Accédez à une bibliothèque musicale spécialement conçue pour l'étude.",
      icon: <Music className="h-8 w-8 text-pink-500" />,
      link: "/music",
      color: "bg-pink-50 hover:bg-pink-100",
      category: 'secondary'
    },
    {
      title: "Ressources médicales",
      description: "Explorez une vaste collection de ressources académiques vérifiées.",
      icon: <Book className="h-8 w-8 text-indigo-500" />,
      link: "/resources",
      color: "bg-indigo-50 hover:bg-indigo-100",
      category: 'primary'
    },
    {
      title: "Historique d'activités",
      description: "Suivez votre progression et consultez l'historique de vos activités.",
      icon: <Activity className="h-8 w-8 text-teal-500" />,
      link: "/activities",
      color: "bg-teal-50 hover:bg-teal-100",
      category: 'secondary'
    }
  ], []);

  /**
   * Cartes de fonctionnalités pour les professionnels de santé
   * Adaptées aux besoins des praticiens et formateurs
   */
  const professionalFeatureCards: FeatureCard[] = useMemo(() => [
    {
      title: "Cas cliniques",
      description: "Accédez à une base de données étendue de cas cliniques pour la formation.",
      icon: <Stethoscope className="h-8 w-8 text-blue-600" />,
      link: "/clinical-cases",
      color: "bg-blue-50 hover:bg-blue-100",
      category: 'primary'
    },
    {
      title: "Formation continue",
      description: "Modules DPC et ressources pour maintenir vos compétences à jour.",
      icon: <BookOpen className="h-8 w-8 text-green-600" />,
      link: "/continuing-education",
      color: "bg-green-50 hover:bg-green-100",
      category: 'primary'
    },
    {
      title: "Recherche médicale",
      description: "Accédez aux dernières publications et recherches scientifiques.",
      icon: <Microscope className="h-8 w-8 text-purple-600" />,
      link: "/research",
      color: "bg-purple-50 hover:bg-purple-100",
      category: 'primary'
    },
    {
      title: "Outils cliniques",
      description: "Calculateurs médicaux et aides à la décision clinique avancés.",
      icon: <Brain className="h-8 w-8 text-orange-600" />,
      link: "/clinical-tools",
      color: "bg-orange-50 hover:bg-orange-100",
      category: 'secondary'
    },
    {
      title: "Communauté professionnelle",
      description: "Échangez avec vos pairs et partagez votre expertise médicale.",
      icon: <MessageSquare className="h-8 w-8 text-indigo-600" />,
      link: "/community",
      color: "bg-indigo-50 hover:bg-indigo-100",
      category: 'primary'
    },
    {
      title: "Planificateur professionnel",
      description: "Organisez vos consultations, formations et activités professionnelles.",
      icon: <Calendar className="h-8 w-8 text-teal-600" />,
      link: "/calendar",
      color: "bg-teal-50 hover:bg-teal-100",
      category: 'secondary'
    }
  ], []);

  // Écran de chargement optimisé avec design médical cohérent
  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center space-y-6 p-8 bg-white rounded-2xl shadow-lg max-w-md w-full mx-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-medical-light border-t-medical-blue mx-auto"></div>
            <div className="space-y-2">
              <p className="text-xl font-semibold text-medical-navy">
                Chargement du tableau de bord
              </p>
              <p className="text-sm text-gray-500">
                Préparation de votre espace personnel...
              </p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Protection contre l'affichage sans utilisateur authentifié
  if (!user) {
    return null; // Évite le flash de contenu avant redirection
  }

  // Sélection des cartes appropriées selon le rôle utilisateur
  const featureCards = user.role === 'student' ? studentFeatureCards : professionalFeatureCards;
  const welcomeMessage = user.role === 'student' 
    ? "Bienvenue dans votre espace étudiant" 
    : "Bienvenue dans votre espace professionnel";

  return (
    <MainLayout requireAuth={true}>
      <div className="space-y-8 animate-fade-in">
        {/* En-tête de bienvenue personnalisé avec informations utilisateur */}
        <div className="bg-gradient-to-r from-medical-blue to-medical-teal text-white rounded-2xl p-8 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {welcomeMessage}
              </h1>
              <p className="text-blue-100 text-lg">
                Bonjour {user.displayName || user.email?.split('@')[0]} !
              </p>
              <p className="text-blue-200 text-sm mt-1">
                {user.role === 'student' 
                  ? "Prêt à optimiser vos études en médecine ?" 
                  : "Explorez vos outils professionnels avancés"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <User className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Section des statistiques rapides utilisateur */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-2xl border-0 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 rounded-xl p-3">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Progression</p>
                  <p className="text-2xl font-bold text-gray-900">85%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 rounded-xl p-3">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Objectifs</p>
                  <p className="text-2xl font-bold text-gray-900">12/15</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 rounded-xl p-3">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Temps d'étude</p>
                  <p className="text-2xl font-bold text-gray-900">24h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grille des fonctionnalités principales avec organisation intelligente */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Vos outils {user.role === 'student' ? 'd\'étude' : 'professionnels'}
            </h2>
            <Button variant="outline" className="rounded-xl">
              <Search className="h-4 w-4 mr-2" />
              Explorer tout
            </Button>
          </div>

          {/* Fonctionnalités principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featureCards
              .filter(card => card.category === 'primary')
              .map((feature, index) => (
              <Card 
                key={index} 
                className={`group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 rounded-2xl overflow-hidden ${feature.color}`}
              >
                <Link to={feature.link} className="block h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      {feature.icon}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-2 h-2 bg-current rounded-full"></div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-6">
                    <CardTitle className="text-lg mb-2 text-gray-900 group-hover:text-gray-700">
                      {feature.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>

          {/* Outils complémentaires */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Outils complémentaires
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featureCards
                .filter(card => card.category === 'secondary')
                .map((feature, index) => (
                <Card 
                  key={index} 
                  className={`group hover:shadow-md transition-all duration-300 cursor-pointer border-0 rounded-xl overflow-hidden ${feature.color}`}
                >
                  <Link to={feature.link} className="block h-full">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {feature.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 group-hover:text-gray-700 truncate">
                            {feature.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Section de liens rapides et raccourcis */}
        <Card className="rounded-2xl border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">
              Accès rapide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="ghost" className="h-auto p-4 flex-col rounded-xl" asChild>
                <Link to="/profile">
                  <User className="h-6 w-6 mb-2" />
                  <span className="text-sm">Profil</span>
                </Link>
              </Button>
              <Button variant="ghost" className="h-auto p-4 flex-col rounded-xl" asChild>
                <Link to="/settings">
                  <LucideAudioLines className="h-6 w-6 mb-2" />
                  <span className="text-sm">Paramètres</span>
                </Link>
              </Button>
              <Button variant="ghost" className="h-auto p-4 flex-col rounded-xl" asChild>
                <Link to="/activities">
                  <Activity className="h-6 w-6 mb-2" />
                  <span className="text-sm">Activités</span>
                </Link>
              </Button>
              <Button variant="ghost" className="h-auto p-4 flex-col rounded-xl" asChild>
                <Link to="/help">
                  <MessageSquare className="h-6 w-6 mb-2" />
                  <span className="text-sm">Aide</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
