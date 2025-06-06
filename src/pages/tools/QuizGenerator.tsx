
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Plus, FileQuestion, BarChart3, Target } from 'lucide-react';

const QuizGenerator: React.FC = () => {
  const quizTypes = [
    {
      title: "QCM Multiple",
      description: "Questions à choix multiples avec plusieurs bonnes réponses",
      icon: <FileQuestion className="h-6 w-6 text-blue-500" />,
    },
    {
      title: "Vrai/Faux",
      description: "Questions simples avec réponses binaires",
      icon: <Target className="h-6 w-6 text-green-500" />,
    },
    {
      title: "Questions ouvertes",
      description: "Questions nécessitant des réponses rédigées",
      icon: <Brain className="h-6 w-6 text-purple-500" />,
    },
    {
      title: "Quiz chronométré",
      description: "Questions avec limite de temps pour simuler un examen",
      icon: <BarChart3 className="h-6 w-6 text-orange-500" />,
    },
  ];

  return (
    <MainLayout requireAuth={true}>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8 text-medical-blue" />
            <div>
              <h1 className="text-2xl font-bold">Générateur de QCM</h1>
              <p className="text-gray-500">Créez des questionnaires personnalisés pour vos révisions</p>
            </div>
          </div>
          <Button className="mt-4 md:mt-0" disabled>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Quiz
          </Button>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-8">
          <h2 className="text-lg font-medium mb-2 text-blue-800">Fonctionnalité en développement</h2>
          <p className="text-blue-700">
            Le générateur de QCM sera bientôt disponible ! Vous pourrez créer des questionnaires 
            personnalisés avec différents types de questions pour tester vos connaissances.
          </p>
        </div>

        <h2 className="text-xl font-medium mb-4">Types de quiz disponibles bientôt</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizTypes.map((type, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white shadow-sm">
                    {type.icon}
                  </div>
                  <CardTitle className="text-lg">{type.title}</CardTitle>
                </div>
                <CardDescription>{type.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" disabled>
                  Prochainement
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default QuizGenerator;
