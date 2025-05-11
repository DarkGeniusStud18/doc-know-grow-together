
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Brain, Clock, FileText, LayoutGrid, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ExamSimulator = () => {
  const [loading, setLoading] = useState(false);

  const examTypes = [
    {
      title: "QCM",
      description: "Questions à choix multiples",
      icon: LayoutGrid,
      color: "bg-blue-100 text-blue-600",
      count: 120
    },
    {
      title: "Questions ouvertes",
      description: "Questions de réflexion et d'analyse",
      icon: FileText,
      color: "bg-green-100 text-green-600",
      count: 45
    },
    {
      title: "Cas cliniques",
      description: "Analyse de cas réels",
      icon: Brain,
      color: "bg-purple-100 text-purple-600",
      count: 67
    }
  ];

  const subjects = [
    "Anatomie", "Physiologie", "Pathologie", "Pharmacologie", 
    "Neurologie", "Cardiologie", "Pneumologie", "Gastroentérologie",
    "Endocrinologie", "Néphrologie", "Urologie", "Gynécologie", 
    "Pédiatrie", "Gériatrie", "Psychiatrie", "Dermatologie"
  ];

  const recentExams = [
    { title: "Examen blanc QCM - Cardiologie", date: "10 mai 2025", score: "76%" },
    { title: "Cas cliniques - Neurologie", date: "5 mai 2025", score: "82%" },
    { title: "Questions ouvertes - Pharmacologie", date: "29 avril 2025", score: "68%" }
  ];

  const handleStartExam = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Navigate or show exam
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Simulateur d'examens</h1>
            <p className="text-gray-500">Préparez-vous à vos examens avec des simulations réalistes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Créer un nouvel examen</CardTitle>
                <CardDescription>Personnalisez votre simulation d'examen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Type d'examen</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {examTypes.map((type, index) => (
                        <div 
                          key={index}
                          className="border rounded-md p-3 cursor-pointer hover:border-medical-teal transition-colors"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`p-1 rounded ${type.color}`}>
                              <type.icon size={16} />
                            </div>
                            <span className="font-medium">{type.title}</span>
                          </div>
                          <p className="text-xs text-gray-500">{type.description}</p>
                          <Badge variant="outline" className="mt-2">
                            {type.count} questions disponibles
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Matières</label>
                    <div className="flex flex-wrap gap-2">
                      {subjects.map((subject, index) => (
                        <div 
                          key={index} 
                          className="border rounded-md px-3 py-1 cursor-pointer hover:bg-medical-teal hover:text-white transition-colors text-sm"
                        >
                          {subject}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Nombre de questions</label>
                      <input
                        type="number"
                        min="5"
                        max="100"
                        defaultValue="30"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Durée (minutes)</label>
                      <input
                        type="number"
                        min="10"
                        max="240"
                        defaultValue="60"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleStartExam} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Préparation de l'examen...
                    </>
                  ) : (
                    <>
                      <Clock className="mr-2 h-4 w-4" />
                      Commencer l'examen
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Historique</CardTitle>
                <CardDescription>Vos sessions d'examen récentes</CardDescription>
              </CardHeader>
              <CardContent>
                {recentExams.map((exam, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-md hover:bg-gray-50 cursor-pointer ${
                      index !== recentExams.length - 1 ? 'border-b' : ''
                    }`}
                  >
                    <div className="font-medium">{exam.title}</div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">{exam.date}</span>
                      <Badge>{exam.score}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/exam-history">Voir tout l'historique</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ExamSimulator;
