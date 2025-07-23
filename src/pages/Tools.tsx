
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Timer, 
  BookOpen, 
  Target, 
  Calculator, 
  Search, 
  HelpCircle, 
  BarChart3,
  Calendar,
  ClipboardList,
  Presentation,
  Stethoscope,
  Clock,
  FileText
} from 'lucide-react';

const Tools = () => {
  const tools = [
    {
      id: 'flashcard-generator',
      title: 'Générateur de fiches',
      description: 'Créez des fiches d\'étude personnalisées pour réviser efficacement',
      icon: BookOpen,
      path: '/tools/flashcard-generator',
      color: 'bg-blue-500'
    },
    {
      id: 'pomodoro',
      title: 'Timer Pomodoro',
      description: 'Technique Pomodoro pour optimiser votre concentration',
      icon: Timer,
      path: '/tools/pomodoro',
      color: 'bg-red-500'
    },
    {
      id: 'study-timer',
      title: 'Minuteur d\'étude',
      description: 'Suivez vos sessions d\'étude et analysez vos habitudes',
      icon: Clock,
      path: '/tools/study-timer',
      color: 'bg-green-500'
    },
    {
      id: 'study-planner',
      title: 'Planificateur d\'étude',
      description: 'Organisez vos révisions avec un planning personnalisé',
      icon: Calendar,
      path: '/tools/study-planner',
      color: 'bg-purple-500'
    },
    {
      id: 'study-goals',
      title: 'Objectifs d\'étude',
      description: 'Définissez et suivez vos objectifs académiques',
      icon: Target,
      path: '/tools/study-goals',
      color: 'bg-orange-500'
    },
    {
      id: 'task-list',
      title: 'Liste de tâches',
      description: 'Gérez vos tâches et devoirs efficacement',
      icon: ClipboardList,
      path: '/tools/task-list',
      color: 'bg-teal-500'
    },
    {
      id: 'medical-calculator',
      title: 'Calculatrice médicale',
      description: 'Calculatrices spécialisées pour les études médicales',
      icon: Calculator,
      path: '/tools/medical-calculator',
      color: 'bg-indigo-500'
    },
    {
      id: 'research-assistant',
      title: 'Assistant de recherche',
      description: 'Aide à la recherche académique avec génération de citations',
      icon: Search,
      path: '/tools/research-assistant',
      color: 'bg-pink-500'
    },
    {
      id: 'quiz-generator',
      title: 'Générateur de quiz',
      description: 'Créez des quiz personnalisés pour tester vos connaissances',
      icon: HelpCircle,
      path: '/tools/quiz-generator',
      color: 'bg-yellow-500'
    },
    {
      id: 'exam-simulator',
      title: "Simulateur d'examens",
      description: "Entraînez-vous aux examens avec des QCM et des cas cliniques réalistes.",
      icon: FileText,
      link: '/tools/exam-simulator',
      color: "bg-red-400",
      category: 'primary'
    },
    {
      id: 'performance-tracker',
      title: 'Suivi de performance',
      description: 'Analyse automatique de vos performances et progrès',
      icon: BarChart3,
      path: '/tools/performance-tracker',
      color: 'bg-cyan-500'
    },
    {
      id: 'interactive-presentations',
      title: 'Présentations interactives',
      description: 'Créez des présentations engageantes pour vos exposés',
      icon: Presentation,
      path: '/tools/interactive-presentations',
      color: 'bg-lime-500'
    },
    {
      id: 'clinical-cases',
      title: 'Cas cliniques',
      description: 'Explorez et analysez des cas cliniques réels',
      icon: Stethoscope,
      path: '/tools/clinical-cases',
      color: 'bg-rose-500'
    }
  ];

  return (
    <MainLayout requireAuth={true}>
      <div className="mx-auto py-6 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-medical-navy">Boîte à outils</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez notre collection d'outils conçus pour optimiser votre apprentissage 
            et améliorer vos performances académiques
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <Card key={tool.id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-lg ${tool.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg group-hover:text-medical-blue transition-colors">
                    {tool.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600 line-clamp-2">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Link to={tool.path}>
                    <Button className="w-full group-hover:bg-medical-blue group-hover:text-white transition-all">
                      Accéder à l'outil
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/*<div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-medical-blue to-medical-teal rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Besoin d'aide ?</h2>
            <p className="text-medical-light mb-6">
              Consultez notre guide d'utilisation pour tirer le meilleur parti de chaque outil
            </p>
            <Button variant="outline" className="bg-white text-medical-blue hover:bg-gray-100">
              Guide d'utilisation
            </Button>
          </div>
        </div>*/}
      </div>
    </MainLayout>
  );
};

export default Tools;
