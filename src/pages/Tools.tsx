
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarRange, Clock, FileSpreadsheet, ListChecks, Microscope, Presentation } from 'lucide-react';
import { Link } from 'react-router-dom';

const Tools = () => {
  // Liste des outils disponibles
  const tools = [
    {
      title: "Planificateur d'études",
      description: "Créez et gérez votre emploi du temps d'études personnalisé",
      icon: CalendarRange,
      color: "bg-blue-100 text-blue-600",
      action: "Commencer",
      path: "/tools/study-planner"
    },
    {
      title: "Liste de tâches",
      description: "Organisez vos tâches et suivez votre progression tout le long de votre apprentissage",
      icon: ListChecks,
      color: "bg-green-100 text-green-600",
      action: "Créer une liste",
      path: "/tools/task-list"
    },
    {
      title: "Chronomètre d'étude",
      description: "Utilisez la technique Pomodoro pour maximiser votre concentration",
      icon: Clock,
      color: "bg-red-100 text-red-600",
      action: "Démarrer",
      path: "/tools/study-timer"
    },
    {
      title: "Générateur de fiches",
      description: "Créez rapidement des fiches de révision efficaces et personnalisées",
      icon: FileSpreadsheet,
      color: "bg-purple-100 text-purple-600",
      action: "Créer",
      path: "/tools/flashcards/flashcard-generator" // Chemin corrigé
    },
    {
      title: "Présentations interactives",
      description: "Créez des présentations pour expliquer des concepts médicaux",
      icon: Presentation,
      color: "bg-yellow-100 text-yellow-600",
      action: "Commencer",
      path: "/tools/interactive-presentations"
    },
    {
      title: "Explorateur de cas cliniques",
      description: "Accédez à une bibliothèque de cas cliniques pour votre formation",
      icon: Microscope,
      color: "bg-teal-100 text-teal-600",
      action: "Explorer",
      path: "/tools/clinical-cases-explorer"
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Outils de productivité</h1>
            <p className="text-gray-500">Des outils pour améliorer votre apprentissage et votre productivité</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <Card key={index} className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-102">
              <CardHeader className="pb-3">
                <div className={`p-2 rounded-lg w-12 h-12 flex items-center justify-center mb-2 ${tool.color}`}>
                  <tool.icon size={24} />
                </div>
                <CardTitle>{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link to={tool.path}>{tool.action}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Tools;
