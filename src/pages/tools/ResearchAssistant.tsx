
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, FileText, Link, Database } from 'lucide-react';

const ResearchAssistant: React.FC = () => {
  const features = [
    {
      title: "Recherche bibliographique",
      description: "Trouvez rapidement des articles scientifiques pertinents",
      icon: <Search className="h-6 w-6 text-blue-500" />,
    },
    {
      title: "Gestionnaire de références",
      description: "Organisez et citez vos sources automatiquement",
      icon: <FileText className="h-6 w-6 text-green-500" />,
    },
    {
      title: "Analyse de contenu",
      description: "Extrayez les points clés de vos documents",
      icon: <Database className="h-6 w-6 text-purple-500" />,
    },
    {
      title: "Réseau de citations",
      description: "Visualisez les connexions entre les articles",
      icon: <Link className="h-6 w-6 text-orange-500" />,
    },
  ];

  return (
    <MainLayout requireAuth={true}>
      <div className="container mx-auto py-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="h-8 w-8 text-medical-blue" />
          <div>
            <h1 className="text-2xl font-bold">Assistant de recherche</h1>
            <p className="text-gray-500">Outils pour organiser et analyser vos recherches</p>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-8">
          <h2 className="text-lg font-medium mb-2 text-blue-800">Fonctionnalité en développement</h2>
          <p className="text-blue-700">
            L'assistant de recherche sera bientôt disponible ! Il vous aidera à gérer vos sources, 
            analyser vos documents et organiser votre recherche académique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white shadow-sm">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
                <CardDescription>{feature.description}</CardDescription>
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

export default ResearchAssistant;
