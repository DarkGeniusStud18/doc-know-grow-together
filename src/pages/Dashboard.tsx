
/**
 * Tableau de bord ultra-professionnel avec design adaptatif
 * 
 * Interface premium optimisée pour mobile, tablette et desktop
 * avec micro-interactions et animations fluides
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
import { Badge } from "@/components/ui/badge";
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
  ArrowRight,
  Star,
  Zap,
  Award,
  Globe,
  ChevronRight,
  Plus,
  BarChart3,
  PlayCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Interface pour les cartes de fonctionnalités avec métadonnées premium
 */
interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  color: string;
  category: 'primary' | 'secondary';
  gradient?: string;
  badge?: string;
  isNew?: boolean;
}

/**
 * Tableau de bord avec design ultra-professionnel adaptatif
 * 
 * Fonctionnalités premium :
 * - Interface adaptative mobile/tablette/desktop
 * - Animations et micro-interactions fluides
 * - Cartes de fonctionnalités avec design moderne
 * - Statistiques en temps réel avec visualisations
 * - Shortcuts et accès rapides contextuels
 */
const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Prévention des boucles de redirection
  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      console.log('Utilisateur non connecté, redirection vers login');
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  /**
   * Cartes de fonctionnalités pour étudiants - Design premium mobile-first
   */
  const studentFeatureCards: FeatureCard[] = useMemo(() => [
    {
      title: "Fiches de révision",
      description: "Créez et organisez vos fiches avec IA intégrée",
      icon: <GraduationCap className="h-6 w-6 md:h-8 md:w-8" />,
      link: "/notes",
      color: "text-blue-600",
      gradient: "from-blue-500 to-blue-600",
      category: 'primary',
      badge: "IA",
      isNew: true
    },
    {
      title: "Groupes d'étude",
      description: "Collaborez avec d'autres étudiants en temps réel",
      icon: <Users className="h-6 w-6 md:h-8 md:w-8" />,
      link: "/study-groups",
      color: "text-orange-600",
      gradient: "from-orange-500 to-orange-600",
      category: 'primary'
    },
    {
      title: "Simulateur d'examens",
      description: "QCM adaptatifs avec analyse de performance",
      icon: <FileText className="h-6 w-6 md:h-8 md:w-8" />,
      link: "/exam-simulator",
      color: "text-red-600",
      gradient: "from-red-500 to-red-600",
      category: 'primary',
      badge: "Adaptatif"
    },
    {
      title: "Focus & Pomodoro",
      description: "Sessions de concentration avec analytics",
      icon: <Clock className="h-6 w-6 md:h-8 md:w-8" />,
      link: "/tools",
      color: "text-green-600",
      gradient: "from-green-500 to-green-600",
      category: 'secondary'
    },
    {
      title: "Planificateur intelligent",
      description: "IA qui optimise votre planning d'étude",
      icon: <Calendar className="h-6 w-6 md:h-8 md:w-8" />,
      link: "/calendar",
      color: "text-purple-600",
      gradient: "from-purple-500 to-purple-600",
      category: 'primary',
      badge: "Smart"
    },
    {
      title: "Ambiance sonore",
      description: "Musiques et sons pour optimiser la concentration",
      icon: <Music className="h-6 w-6 md:h-8 md:w-8" />,
      link: "/music",
      color: "text-pink-600",
      gradient: "from-pink-500 to-pink-600",
      category: 'secondary'
    },
    {
      title: "Bibliothèque médicale",
      description: "Ressources académiques vérifiées et à jour",
      icon: <Book className="h-6 w-6 md:h-8 md:w-8" />,
      link: "/resources",
      color: "text-indigo-600",
      gradient: "from-indigo-500 to-indigo-600",
      category: 'primary'
    },
    {
      title: "Analytics d'étude",
      description: "Suivez votre progression avec des insights IA",
      icon: <BarChart3 className="h-6 w-6 md:h-8 md:w-8" />,
      link: "/activities",
      color: "text-teal-600",
      gradient: "from-teal-500 to-teal-600",
      category: 'secondary',
      badge: "Analytics"
    }
  ], []);

  /**
   * Cartes de fonctionnalités pour professionnels - Design premium
   */
  const professionalFeatureCards: FeatureCard[] = useMemo(() => [
    {
      title: "Cas cliniques interactifs",
      description: "Base de données enrichie avec simulation 3D",
      icon: <Stethoscope className="h-6 w-6 md:h-8 md:w-8" />,
      link: "/clinical-cases",
      color: "text-blue-600",
      gradient: "from-blue-600 to-blue-700",
      category: 'primary',
      badge: "3D"
    },
    {
      title: "Formation continue",
      description: "Modules DPC accrédités avec certification",
      icon: <BookOpen className="h-6 w-6 md:h-8 md:w-8" />,
      link: "/continuing-education",
      color: "text-green-600",
      gradient: "from-green-600 to-green-700",
      category: 'primary',
      badge: "Certifié"
    },
    {
      title: "Recherche médicale",
      description: "Accès aux dernières publications et méta-analyses",
      icon: <Microscope className="h-6 w-6 md:h-8 md:w-8" />,
      link: "/research",
      color: "text-purple-600",
      gradient: "from-purple-600 to-purple-700",
      category: 'primary'
    },
    {
      title: "Outils cliniques avancés",
      description: "Calculateurs médicaux et aide à la décision",
      icon: <Brain className="h-6 w-6 md:h-8 md:w-8" />,
      link: "/clinical-tools",
      color: "text-orange-600",
      gradient: "from-orange-600 to-orange-700",
      category: 'secondary'
    },
    {
      title: "Réseau professionnel",
      description: "Communauté vérifiée de professionnels",
      icon: <MessageSquare className="h-6 w-6 md:h-8 md:w-8" />,
      link: "/community",
      color: "text-indigo-600",
      gradient: "from-indigo-600 to-indigo-700",
      category: 'primary'
    },
    {
      title: "Gestion de cabinet",
      description: "Outils pour optimiser votre pratique quotidienne",
      icon: <Calendar className="h-6 w-6 md:h-8 md:w-8" />,
      link: "/calendar",
      color: "text-teal-600",
      gradient: "from-teal-600 to-teal-700",
      category: 'secondary'
    }
  ], []);

  // Écran de chargement premium
  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[70vh] px-4">
          <div className="text-center space-y-6 p-6 md:p-8 bg-white rounded-3xl shadow-xl max-w-sm w-full mx-auto">
            {/* Spinner premium avec gradient */}
            <div className="relative mx-auto w-16 h-16">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-medical-blue to-medical-teal opacity-20"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-medical-blue to-medical-teal animate-spin"
                style={{
                  background: 'conic-gradient(from 0deg, transparent, #0077B6, transparent)',
                  borderRadius: '50%'
                }}
              ></div>
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 text-medical-blue" />
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-xl font-semibold text-medical-navy">
                Préparation de votre espace
              </p>
              <p className="text-sm text-gray-500">
                Configuration personnalisée en cours...
              </p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Protection contre l'affichage sans utilisateur
  if (!user) {
    return null;
  }

  // Sélection des cartes selon le rôle utilisateur
  const featureCards = user.role === 'student' ? studentFeatureCards : professionalFeatureCards;
  const welcomeMessage = user.role === 'student' 
    ? "Espace Étudiant" 
    : "Espace Professionnel";

  const userStats = [
    { 
      value: "85%", 
      label: "Progression", 
      icon: <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    { 
      value: "12/15", 
      label: "Objectifs", 
      icon: <Target className="h-4 w-4 md:h-5 md:w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    { 
      value: "24h", 
      label: "Temps d'étude", 
      icon: <Clock className="h-4 w-4 md:h-5 md:w-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    { 
      value: "156", 
      label: "Points XP", 
      icon: <Star className="h-4 w-4 md:h-5 md:w-5" />,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    }
  ];

  return (
    <MainLayout requireAuth={true}>
      <div className="space-y-6 md:space-y-8 animate-fade-in px-4 md:px-6 lg:px-8">
        
        {/* Header premium avec gradient et informations utilisateur */}
        <div className="relative overflow-hidden bg-gradient-to-br from-medical-blue via-medical-teal to-medical-navy rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 text-white">
          {/* Éléments décoratifs */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16"></div>
          
          <div className="relative">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6">
              
              {/* Informations utilisateur */}
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center gap-3">
                  <Badge className="bg-white/20 text-white border-white/30 px-3 py-1 text-xs font-medium">
                    {user.role === 'student' ? '🎓 Étudiant' : '👨‍⚕️ Professionnel'}
                  </Badge>
                  {user.role === 'student' && (
                    <Badge className="bg-yellow-500/20 text-yellow-200 border-yellow-400/30 px-3 py-1 text-xs font-medium">
                      <Star className="h-3 w-3 mr-1" />
                      Niveau 12
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                  {welcomeMessage}
                </h1>
                
                <p className="text-blue-100 text-base md:text-lg">
                  Bonjour {user.displayName || user.email?.split('@')[0]} !
                </p>
                
                <p className="text-blue-200 text-sm md:text-base max-w-2xl">
                  {user.role === 'student' 
                    ? "Continuez votre parcours d'excellence en médecine avec nos outils d'apprentissage avancés" 
                    : "Explorez vos outils professionnels et restez à la pointe de votre domaine"}
                </p>
              </div>

              {/* Actions rapides */}
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <Button 
                  variant="secondary" 
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm font-medium"
                  asChild
                >
                  <Link to="/search" className="flex items-center justify-center">
                    <Search className="h-4 w-4 mr-2" />
                    Rechercher
                  </Link>
                </Button>
                
                <Button 
                  variant="secondary" 
                  className="bg-white text-medical-blue hover:bg-gray-100 font-medium"
                  asChild
                >
                  <Link to="/profile" className="flex items-center justify-center">
                    <User className="h-4 w-4 mr-2" />
                    Mon profil
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques utilisateur - Design adaptatif */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
          {userStats.map((stat, index) => (
            <Card 
              key={index} 
              className="group border-0 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className={cn(
                    "p-2 md:p-3 rounded-xl transition-all duration-300 group-hover:scale-110",
                    stat.bgColor
                  )}>
                    <div className={stat.color}>
                      {stat.icon}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm font-medium text-gray-600 truncate">
                      {stat.label}
                    </p>
                    <p className="text-lg md:text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Section principale des outils */}
        <div className="space-y-6 md:space-y-8">
          
          {/* Header de section avec actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                Vos outils {user.role === 'student' ? 'd\'étude' : 'professionnels'}
              </h2>
              <p className="text-sm md:text-base text-gray-600 mt-1">
                Accédez rapidement à vos fonctionnalités essentielles
              </p>
            </div>
            
            <Button 
              variant="outline" 
              className="rounded-xl border-medical-blue/20 text-medical-blue hover:bg-medical-blue/5 w-full sm:w-auto"
              asChild
            >
              <Link to="/tools" className="flex items-center justify-center">
                <Plus className="h-4 w-4 mr-2" />
                Explorer tout
              </Link>
            </Button>
          </div>

          {/* Grille principale des fonctionnalités - Mobile: 1 col, Tablette: 2 cols, Desktop: 3-4 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {featureCards
              .filter(card => card.category === 'primary')
              .map((feature, index) => (
              <Card 
                key={index} 
                className="group border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-2 overflow-hidden bg-gradient-to-br from-white to-gray-50"
              >
                <Link to={feature.link} className="block h-full">
                  <CardHeader className="pb-3 md:pb-4 relative">
                    
                    {/* Badge nouveau/spécial */}
                    {(feature.badge || feature.isNew) && (
                      <div className="absolute top-3 right-3">
                        <Badge 
                          className={cn(
                            "text-xs px-2 py-1 font-medium",
                            feature.isNew 
                              ? "bg-green-100 text-green-700 border-green-200" 
                              : "bg-blue-100 text-blue-700 border-blue-200"
                          )}
                        >
                          {feature.isNew ? "Nouveau" : feature.badge}
                        </Badge>
                      </div>
                    )}

                    {/* Icône avec gradient */}
                    <div className="mb-3 md:mb-4">
                      <div className={cn(
                        "p-3 md:p-4 rounded-2xl w-fit transition-all duration-300 group-hover:scale-110",
                        `bg-gradient-to-br ${feature.gradient} shadow-lg group-hover:shadow-xl`
                      )}>
                        <div className="text-white">
                          {feature.icon}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-4 md:pb-6">
                    <CardTitle className="text-base md:text-lg mb-2 text-gray-900 group-hover:text-medical-blue transition-colors line-clamp-1">
                      {feature.title}
                    </CardTitle>
                    <p className="text-xs md:text-sm text-gray-600 leading-relaxed line-clamp-2 group-hover:text-gray-700 transition-colors">
                      {feature.description}
                    </p>
                    
                    {/* Indicateur de lien */}
                    <div className="mt-3 md:mt-4 flex items-center text-medical-blue opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <span className="text-xs md:text-sm font-medium">Accéder</span>
                      <ArrowRight className="h-3 w-3 md:h-4 md:w-4 ml-1" />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>

          {/* Outils secondaires - Design compact */}
          <div className="space-y-4">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">
              Outils complémentaires
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {featureCards
                .filter(card => card.category === 'secondary')
                .map((feature, index) => (
                <Card 
                  key={index} 
                  className="group border-0 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1 bg-gradient-to-br from-gray-50 to-white"
                >
                  <Link to={feature.link} className="block h-full">
                    <CardContent className="p-4 md:p-5">
                      <div className="flex items-center gap-3 md:gap-4">
                        
                        {/* Icône compacte */}
                        <div className={cn(
                          "p-2 md:p-3 rounded-xl transition-all duration-300 group-hover:scale-110",
                          `bg-gradient-to-br ${feature.gradient} shadow-sm group-hover:shadow-md`
                        )}>
                          <div className="text-white">
                            <div className="h-4 w-4 md:h-5 md:w-5">
                              {React.cloneElement(feature.icon as React.ReactElement, {
                                className: "h-4 w-4 md:h-5 md:w-5"
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Contenu */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm md:text-base text-gray-900 group-hover:text-medical-blue transition-colors line-clamp-1">
                            {feature.title}
                          </h4>
                          <p className="text-xs md:text-sm text-gray-500 mt-1 line-clamp-1 group-hover:text-gray-600 transition-colors">
                            {feature.description}
                          </p>
                        </div>

                        {/* Chevron */}
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-medical-blue transition-all duration-300 group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Section d'accès rapide - Footer */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl text-gray-900 flex items-center gap-2">
              <Zap className="h-5 w-5 md:h-6 md:w-6 text-medical-blue" />
              Accès rapide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
              
              {[
                { icon: User, label: "Profil", href: "/profile" },
                { icon: LucideAudioLines, label: "Paramètres", href: "/settings" },
                { icon: Activity, label: "Activités", href: "/activities" },
                { icon: MessageSquare, label: "Aide", href: "/help" },
                { icon: Award, label: "Réussites", href: "/achievements" },
                { icon: Globe, label: "Communauté", href: "/community" }
              ].map((item, index) => (
                <Button 
                  key={index}
                  variant="ghost" 
                  className="h-auto p-3 md:p-4 flex-col rounded-xl hover:bg-medical-blue/5 group transition-all duration-200" 
                  asChild
                >
                  <Link to={item.href} className="flex flex-col items-center gap-2">
                    <item.icon className="h-5 w-5 md:h-6 md:w-6 text-gray-600 group-hover:text-medical-blue transition-colors" />
                    <span className="text-xs md:text-sm font-medium text-gray-700 group-hover:text-medical-blue transition-colors">
                      {item.label}
                    </span>
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
