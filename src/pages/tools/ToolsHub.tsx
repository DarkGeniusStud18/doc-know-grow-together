
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, Calculator, BookOpen, Brain, 
  FileText, Calendar, Target, Timer,
  Zap, TrendingUp, BarChart3, PieChart,
  GraduationCap
} from 'lucide-react';

const ToolsHub = () => {
  // Outils de productivité pour étudiants
  const productivityTools = [
    {
      title: "Timer Pomodoro",
      description: "Technique de gestion du temps pour améliorer la concentration",
      icon: <Timer className="h-8 w-8 text-red-500" />,
      path: "/tools/pomodoro",
      category: "Productivité",
      difficulty: "Débutant",
      color: "bg-red-50 border-red-200"
    },
    {
      title: "Planificateur d'études",
      description: "Organisez vos sessions d'étude et suivez vos progrès",
      icon: <Calendar className="h-8 w-8 text-blue-500" />,
      path: "/tools/study-planner",
      category: "Organisation",
      difficulty: "Intermédiaire",
      color: "bg-blue-50 border-blue-200"
    },
    {
      title: "Générateur de fiches",
      description: "Créez des fiches de révision personnalisées",
      icon: <FileText className="h-8 w-8 text-green-500" />,
      path: "/tools/flashcard-generator",
      category: "Révision",
      difficulty: "Débutant",
      color: "bg-green-50 border-green-200"
    },
    {
      title: "Objectifs d'étude",
      description: "Définissez et suivez vos objectifs d'apprentissage",
      icon: <Target className="h-8 w-8 text-purple-500" />,
      path: "/tools/study-goals",
      category: "Motivation",
      difficulty: "Débutant",
      color: "bg-purple-50 border-purple-200"
    }
  ];

  // Outils académiques
  const academicTools = [
    {
      title: "Simulateur d'examen",
      description: "Préparez-vous à vos examens avec des simulations réalistes",
      icon: <GraduationCap className="h-8 w-8 text-indigo-500" />,
      path: "/exam-simulator",
      category: "Évaluation",
      difficulty: "Intermédiaire",
      color: "bg-indigo-50 border-indigo-200"
    },
    {
      title: "Calculateurs médicaux",
      description: "Collection de calculateurs pour les calculs cliniques",
      icon: <Calculator className="h-8 w-8 text-orange-500" />,
      path: "/tools/medical-calculators",
      category: "Médical",
      difficulty: "Avancé",
      color: "bg-orange-50 border-orange-200"
    },
    {
      title: "Assistant de recherche",
      description: "Outils pour organiser et analyser vos recherches",
      icon: <BookOpen className="h-8 w-8 text-cyan-500" />,
      path: "/tools/research-assistant",
      category: "Recherche",
      difficulty: "Intermédiaire",
      color: "bg-cyan-50 border-cyan-200"
    },
    {
      title: "Générateur de QCM",
      description: "Créez des questionnaires personnalisés pour vos révisions",
      icon: <Brain className="h-8 w-8 text-emerald-500" />,
      path: "/tools/quiz-generator",
      category: "Évaluation",
      difficulty: "Intermédiaire",
      color: "bg-emerald-50 border-emerald-200"
    },
    {
      title: "Suivi des performances",
      description: "Analysez vos résultats et identifiez vos points forts",
      icon: <BarChart3 className="h-8 w-8 text-teal-500" />,
      path: "/tools/performance-tracker",
      category: "Analyse",
      difficulty: "Avancé",
      color: "bg-teal-50 border-teal-200"
    },
    {
      title: "Présentations interactives",
      description: "Créez des présentations dynamiques avec quiz et animations",
      icon: <FileText className="h-8 w-8 text-purple-500" />,
      path: "/tools/interactive-presentations",
      category: "Présentation",
      difficulty: "Intermédiaire",
      color: "bg-purple-50 border-purple-200"
    },
    {
      title: "Cas cliniques",
      description: "Explorez des cas cliniques réels pour votre formation",
      icon: <BookOpen className="h-8 w-8 text-rose-500" />,
      path: "/tools/clinical-cases",
      category: "Formation",
      difficulty: "Avancé",
      color: "bg-rose-50 border-rose-200"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Débutant': return 'bg-green-100 text-green-800';
      case 'Intermédiaire': return 'bg-yellow-100 text-yellow-800';
      case 'Avancé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const ToolCard = ({ tool }: { tool: any }) => (
    <Card className={`hover:shadow-lg transition-all duration-300 border-2 ${tool.color} group h-full`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white shadow-sm group-hover:scale-110 transition-transform">
              {tool.icon}
            </div>
            <Badge variant="secondary" className="text-xs">{tool.category}</Badge>
          </div>
          <Badge className={`${getDifficultyColor(tool.difficulty)} text-xs`}>
            {tool.difficulty}
          </Badge>
        </div>
        <CardTitle className="text-lg leading-tight">{tool.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between flex-1">
        <CardDescription className="mb-4 text-sm flex-1">{tool.description}</CardDescription>
        <Button asChild className="w-full group-hover:scale-105 transition-transform">
          <Link to={tool.path}>
            Utiliser l'outil
            <Zap className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <MainLayout requireAuth={true}>
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
        {/* Header responsive */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-medical-navy mb-2 sm:mb-4">
            Centre d'Outils
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            Découvrez notre collection d'outils conçus pour optimiser votre apprentissage, 
            améliorer votre productivité et vous accompagner dans votre réussite académique.
          </p>
        </div>

        {/* Stats responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <Card>
            <CardContent className="p-4 sm:p-6 text-center">
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-medical-blue mx-auto mb-2" />
            <h3 className="text-xl sm:text-2xl font-bold text-medical-navy">11</h3>
              <p className="text-sm sm:text-base text-gray-600">Outils disponibles</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6 text-center">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-medical-teal mx-auto mb-2" />
              <h3 className="text-xl sm:text-2xl font-bold text-medical-navy">95%</h3>
              <p className="text-sm sm:text-base text-gray-600">Satisfaction utilisateur</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6 text-center">
              <PieChart className="h-6 w-6 sm:h-8 sm:w-8 text-medical-green mx-auto mb-2" />
              <h3 className="text-xl sm:text-2xl font-bold text-medical-navy">24/7</h3>
              <p className="text-sm sm:text-base text-gray-600">Accès disponible</p>
            </CardContent>
          </Card>
        </div>

        {/* Outils de Productivité responsive */}
        <section className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-4 sm:mb-6 px-2">
            <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-medical-blue flex-shrink-0" />
            <h2 className="text-xl sm:text-2xl font-bold text-medical-navy">Outils de Productivité</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
            {productivityTools.map((tool, index) => (
              <ToolCard key={index} tool={tool} />
            ))}
          </div>
        </section>

        {/* Outils Académiques responsive */}
        <section>
          <div className="flex items-center gap-3 mb-4 sm:mb-6 px-2">
            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-medical-green flex-shrink-0" />
            <h2 className="text-xl sm:text-2xl font-bold text-medical-navy">Outils Académiques</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {academicTools.map((tool, index) => (
              <ToolCard key={index} tool={tool} />
            ))}
          </div>
        </section>

        {/* Call to Action responsive */}
        <div className="mt-12 sm:mt-16">
          <Card className="bg-gradient-to-r from-medical-blue to-medical-teal text-white border-0">
            <CardContent className="p-6 sm:p-8 text-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Besoin d'un outil spécifique ?</h3>
              <p className="text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 opacity-90 max-w-2xl mx-auto">
                Nous développons constamment de nouveaux outils pour répondre à vos besoins. 
                N'hésitez pas à nous faire part de vos suggestions !
              </p>
              <Button size="lg" variant="secondary" className="text-sm sm:text-base">
                Suggérer un outil
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ToolsHub;
