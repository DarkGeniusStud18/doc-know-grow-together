
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Image, Lightbulb, Presentation, Video } from 'lucide-react';

const InteractivePresentations: React.FC = () => {
  const presentationTemplates = [
    {
      title: "Anatomie en 3D",
      description: "Présentez des modèles anatomiques en 3D pour une meilleure compréhension",
      icon: <Image className="h-8 w-8 text-blue-500" />,
    },
    {
      title: "Explications de pathologies",
      description: "Guide étape par étape pour expliquer les mécanismes pathologiques",
      icon: <FileText className="h-8 w-8 text-green-500" />,
    },
    {
      title: "Quiz interactif",
      description: "Créez des quiz pour tester les connaissances pendant la présentation",
      icon: <Lightbulb className="h-8 w-8 text-yellow-500" />,
    },
    {
      title: "Présentation vidéo",
      description: "Intégrez des vidéos explicatives dans votre présentation",
      icon: <Video className="h-8 w-8 text-red-500" />,
    },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Présentations interactives</h1>
            <p className="text-gray-500">Créez des présentations riches pour partager vos connaissances</p>
          </div>
          <Button className="mt-4 md:mt-0">
            <Presentation className="mr-2 h-4 w-4" />
            Nouvelle présentation
          </Button>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-8">
          <h2 className="text-lg font-medium mb-2 text-blue-800">Fonctionnalité en développement</h2>
          <p className="text-blue-700">
            Cet outil sera bientôt disponible ! Vous pourrez créer des présentations interactives avec des modèles 3D, 
            des quiz, et bien plus encore pour faciliter l'apprentissage médical.
          </p>
        </div>

        <h2 className="text-xl font-medium mb-4">Modèles disponibles bientôt</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {presentationTemplates.map((template, index) => (
            <Card key={index} className="bg-white hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="mb-2">{template.icon}</div>
                <CardTitle className="text-lg">{template.title}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
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

export default InteractivePresentations;
