
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, Calculator, BookOpen, Brain, 
  FileText, Calendar, Target, Timer,
  Zap, TrendingUp, BarChart3, PieChart
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
      icon: <BookOpen className="h-8 w-8 text-indigo-500" />,
      path: "/tools/research-assistant",
      category: "Recherche",
      difficulty: "Intermédiaire",
      color: "bg-indigo-50 border-indigo-200"
    },
    {
      title: "Générateur de QCM",
      description: "Créez des questionnaires personnalisés pour vos révisions",
      icon: <Brain className="h-8 w-8 text-cyan-500" />,
      path: "/tools/quiz-generator",
      category: "Évaluation",
      difficulty: "Intermédiaire",
      color: "bg-cyan-50 border-cyan-200"
    },
    {
      title: "Suivi des performances",
      description: "Analysez vos résultats et identifiez vos points forts",
      icon: <BarChart3 className="h-8 w-8 text-emerald-500" />,
      path: "/tools/performance-tracker",
      category: "Analyse",
      difficulty: "Avancé",
      color: "bg-emerald-50 border-emerald-200"
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
    <Card className={`hover:shadow-lg transition-all duration-300 border-2 ${tool.color} group`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white shadow-sm group-hover:scale-110 transition-transform">
              {tool.icon}
            </div>
            <div>
              <Badge variant="secondary" className="mb-2">{tool.category}</Badge>
              <CardTitle className="text-lg">{tool.title}</CardTitle>
            </div>
          </div>
          <Badge className={getDifficultyColor(tool.difficulty)}>
            {tool.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4 text-sm">{tool.description}</CardDescription>
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-medical-navy mb-4">
            Centre d'Outils
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez notre collection d'outils conçus pour optimiser votre apprentissage, 
            améliorer votre productivité et vous accompagner dans votre réussite académique.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-medical-blue mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-medical-navy">8</h3>
              <p className="text-gray-600">Outils disponibles</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-medical-teal mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-medical-navy">95%</h3>
              <p className="text-gray-600">Satisfaction utilisateur</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <PieChart className="h-8 w-8 text-medical-green mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-medical-navy">24/7</h3>
              <p className="text-gray-600">Accès disponible</p>
            </CardContent>
          </Card>
        </div>

        {/* Outils de Productivité */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="h-6 w-6 text-medical-blue" />
            <h2 className="text-2xl font-bold text-medical-navy">Outils de Productivité</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {productivityTools.map((tool, index) => (
              <ToolCard key={index} tool={tool} />
            ))}
          </div>
        </section>

        {/* Outils Académiques */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-6 w-6 text-medical-green" />
            <h2 className="text-2xl font-bold text-medical-navy">Outils Académiques</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {academicTools.map((tool, index) => (
              <ToolCard key={index} tool={tool} />
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-medical-blue to-medical-teal text-white border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Besoin d'un outil spécifique ?</h3>
              <p className="text-lg mb-6 opacity-90">
                Nous développons constamment de nouveaux outils pour répondre à vos besoins. 
                N'hésitez pas à nous faire part de vos suggestions !
              </p>
              <Button size="lg" variant="secondary">
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
