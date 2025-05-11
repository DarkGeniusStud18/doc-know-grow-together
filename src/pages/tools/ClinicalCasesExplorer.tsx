
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, BookOpen, Stethoscope, Heart, Brain, Wind } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

const ClinicalCasesExplorer: React.FC = () => {
  // Example case categories
  const categories = [
    { name: 'Cardiologie', icon: <Heart className="h-4 w-4" /> },
    { name: 'Neurologie', icon: <Brain className="h-4 w-4" /> },
    { name: 'Pneumologie', icon: <Wind className="h-4 w-4" /> },
    { name: 'Général', icon: <Stethoscope className="h-4 w-4" /> },
  ];

  // Example case studies
  const casesPreview = [
    {
      id: 'case-1',
      title: 'Infarctus du myocarde aigu',
      category: 'Cardiologie',
      complexity: 'Avancé',
      description: 'Un homme de 56 ans se présente aux urgences avec une douleur thoracique intense depuis 2 heures.',
      tags: ['Douleur thoracique', 'ECG', 'Enzymes cardiaques'],
    },
    {
      id: 'case-2',
      title: 'Accident vasculaire cérébral ischémique',
      category: 'Neurologie',
      complexity: 'Intermédiaire',
      description: 'Une femme de 72 ans amenée par sa famille pour faiblesse soudaine du côté droit et difficulté à parler.',
      tags: ['AVC', 'Hémiplégie', 'Aphasie'],
    },
    {
      id: 'case-3',
      title: 'Asthme sévère',
      category: 'Pneumologie', 
      complexity: 'Débutant',
      description: 'Un enfant de 8 ans consulte pour une crise de dyspnée sifflante qui ne répond pas aux inhalateurs habituels.',
      tags: ['Dyspnée', 'Wheezing', 'Traitement d\'urgence'],
    },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Explorateur de cas cliniques</h1>
            <p className="text-gray-500">Étudiez et analysez des cas cliniques réels pour améliorer votre formation</p>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-8">
          <h2 className="text-lg font-medium mb-2 text-blue-800">Fonctionnalité en développement</h2>
          <p className="text-blue-700">
            Cette bibliothèque de cas cliniques sera bientôt disponible avec de nombreux exemples détaillés dans diverses spécialités.
            Vous pourrez étudier des cas réels avec images, résultats de laboratoire et options de traitement.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Filtres</CardTitle>
              <CardDescription>Affinez votre recherche</CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Rechercher..." className="pl-9" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Catégories</h3>
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <div key={index} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md">
                      <div className="p-1 bg-gray-100 rounded-md">
                        {category.icon}
                      </div>
                      <span className="text-sm">{category.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Niveau de complexité</h3>
                <div className="space-y-2">
                  {['Débutant', 'Intermédiaire', 'Avancé'].map((level, index) => (
                    <div key={index} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md">
                      <div className={`w-3 h-3 rounded-full ${
                        level === 'Débutant' ? 'bg-green-500' : 
                        level === 'Intermédiaire' ? 'bg-amber-500' : 
                        'bg-red-500'
                      }`}></div>
                      <span className="text-sm">{level}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button variant="outline" className="w-full" disabled>
                <Filter className="mr-2 h-4 w-4" />
                Appliquer les filtres
              </Button>
            </CardContent>
          </Card>

          {/* Main content */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Explorer les cas cliniques</CardTitle>
              <CardDescription>Aperçu des cas cliniques disponibles prochainement</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {casesPreview.map((caseItem) => (
                    <Card key={caseItem.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{caseItem.title}</CardTitle>
                          <Badge className={`${
                            caseItem.complexity === 'Débutant' ? 'bg-green-100 text-green-700' :
                            caseItem.complexity === 'Intermédiaire' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {caseItem.complexity}
                          </Badge>
                        </div>
                        <CardDescription className="text-gray-500">
                          Catégorie: {caseItem.category}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm">{caseItem.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {caseItem.tags.map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" disabled>
                          <BookOpen className="mr-2 h-4 w-4" />
                          Voir ce cas
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ClinicalCasesExplorer;
