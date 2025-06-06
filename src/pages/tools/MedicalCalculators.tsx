
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Heart, Activity, Thermometer, Droplets } from 'lucide-react';

const MedicalCalculators: React.FC = () => {
  const calculators = [
    {
      title: "IMC (Indice de Masse Corporelle)",
      description: "Calculez l'indice de masse corporelle",
      icon: <Activity className="h-6 w-6 text-blue-500" />,
      category: "Général",
    },
    {
      title: "Fréquence cardiaque cible",
      description: "Déterminez votre zone de fréquence cardiaque optimale",
      icon: <Heart className="h-6 w-6 text-red-500" />,
      category: "Cardiologie",
    },
    {
      title: "Surface corporelle",
      description: "Calculez la surface corporelle selon la formule de Dubois",
      icon: <Thermometer className="h-6 w-6 text-orange-500" />,
      category: "Général",
    },
    {
      title: "Clairance de la créatinine",
      description: "Estimez la fonction rénale avec la formule de Cockcroft-Gault",
      icon: <Droplets className="h-6 w-6 text-cyan-500" />,
      category: "Néphrologie",
    },
  ];

  return (
    <MainLayout requireAuth={true}>
      <div className="container mx-auto py-6">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="h-8 w-8 text-medical-blue" />
          <div>
            <h1 className="text-2xl font-bold">Calculateurs médicaux</h1>
            <p className="text-gray-500">Collection de calculateurs pour les calculs cliniques</p>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-8">
          <h2 className="text-lg font-medium mb-2 text-blue-800">Fonctionnalité en développement</h2>
          <p className="text-blue-700">
            Ces calculateurs médicaux seront bientôt disponibles ! Vous pourrez effectuer des calculs cliniques 
            précis pour l'IMC, la surface corporelle, la clairance rénale et bien plus encore.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculators.map((calculator, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white shadow-sm">
                      {calculator.icon}
                    </div>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {calculator.category}
                  </span>
                </div>
                <CardTitle className="text-lg">{calculator.title}</CardTitle>
                <CardDescription>{calculator.description}</CardDescription>
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

export default MedicalCalculators;
