
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Plus, TrendingUp, Calendar, Award } from 'lucide-react';

const StudyGoals: React.FC = () => {
  const goalTypes = [
    {
      title: "Objectifs quotidiens",
      description: "Définissez des objectifs à court terme pour chaque jour",
      icon: <Calendar className="h-6 w-6 text-blue-500" />,
    },
    {
      title: "Objectifs hebdomadaires",
      description: "Planifiez vos objectifs sur une semaine",
      icon: <TrendingUp className="h-6 w-6 text-green-500" />,
    },
    {
      title: "Objectifs de semestre",
      description: "Fixez des objectifs à long terme pour le semestre",
      icon: <Award className="h-6 w-6 text-purple-500" />,
    },
  ];

  return (
    <MainLayout requireAuth={true}>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center gap-3">
            <Target className="h-8 w-8 text-medical-blue" />
            <div>
              <h1 className="text-2xl font-bold">Objectifs d'étude</h1>
              <p className="text-gray-500">Définissez et suivez vos objectifs d'apprentissage</p>
            </div>
          </div>
          <Button className="mt-4 md:mt-0" disabled>
            <Plus className="mr-2 h-4 w-4" />
            Nouvel Objectif
          </Button>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-8">
          <h2 className="text-lg font-medium mb-2 text-blue-800">Fonctionnalité en développement</h2>
          <p className="text-blue-700">
            Le gestionnaire d'objectifs sera bientôt disponible ! Vous pourrez définir, 
            suivre et analyser vos objectifs d'apprentissage pour rester motivé.
          </p>
        </div>

        <h2 className="text-xl font-medium mb-4">Types d'objectifs disponibles bientôt</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {goalTypes.map((type, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white shadow-sm">
                    {type.icon}
                  </div>
                </div>
                <CardTitle className="text-lg">{type.title}</CardTitle>
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

export default StudyGoals;
