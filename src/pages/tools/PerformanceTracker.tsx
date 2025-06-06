
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, PieChart, LineChart, Target } from 'lucide-react';

const PerformanceTracker: React.FC = () => {
  const metrics = [
    {
      title: "Temps d'étude",
      description: "Suivez votre temps d'étude quotidien et hebdomadaire",
      icon: <LineChart className="h-6 w-6 text-blue-500" />,
    },
    {
      title: "Résultats aux quiz",
      description: "Analysez vos performances aux questionnaires",
      icon: <PieChart className="h-6 w-6 text-green-500" />,
    },
    {
      title: "Progression par matière",
      description: "Visualisez votre progression dans chaque domaine",
      icon: <TrendingUp className="h-6 w-6 text-purple-500" />,
    },
    {
      title: "Objectifs atteints",
      description: "Suivez l'accomplissement de vos objectifs",
      icon: <Target className="h-6 w-6 text-orange-500" />,
    },
  ];

  return (
    <MainLayout requireAuth={true}>
      <div className="container mx-auto py-6">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="h-8 w-8 text-medical-blue" />
          <div>
            <h1 className="text-2xl font-bold">Suivi des performances</h1>
            <p className="text-gray-500">Analysez vos résultats et identifiez vos points forts</p>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-8">
          <h2 className="text-lg font-medium mb-2 text-blue-800">Fonctionnalité en développement</h2>
          <p className="text-blue-700">
            Le suivi des performances sera bientôt disponible ! Vous pourrez analyser vos résultats, 
            identifier vos points forts et axes d'amélioration avec des graphiques détaillés.
          </p>
        </div>

        <h2 className="text-xl font-medium mb-4">Métriques disponibles bientôt</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white shadow-sm">
                    {metric.icon}
                  </div>
                  <CardTitle className="text-lg">{metric.title}</CardTitle>
                </div>
                <CardDescription>{metric.description}</CardDescription>
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

export default PerformanceTracker;
