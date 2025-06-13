
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Brain, Clock, FileText, LayoutGrid, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

const ExamSimulator = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState('QCM');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [questionsCount, setQuestionsCount] = useState(30);
  const [duration, setDuration] = useState(60);

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

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const saveExamSession = async (score: number, maxScore: number, actualDuration: number) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('exam_sessions')
        .insert({
          user_id: user.id,
          exam_type: selectedType,
          subjects: selectedSubjects,
          questions_count: questionsCount,
          score: score,
          max_score: maxScore,
          duration_minutes: actualDuration,
          completed_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      toast.success('Session d\'examen enregistrée dans l\'historique');
    } catch (error) {
      console.error('Error saving exam session:', error);
      toast.error('Erreur lors de la sauvegarde de la session');
    }
  };

  const simulateExam = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour passer un examen');
      return;
    }
    
    if (selectedSubjects.length === 0) {
      toast.error('Veuillez sélectionner au moins une matière');
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate exam execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock results
      const mockScore = Math.floor(Math.random() * questionsCount * 0.6) + Math.floor(questionsCount * 0.2);
      const actualDuration = Math.floor(duration * (0.7 + Math.random() * 0.5));
      
      // Save to history
      await saveExamSession(mockScore, questionsCount, actualDuration);
      
      toast.success(`Examen terminé ! Score: ${mockScore}/${questionsCount} (${Math.round((mockScore/questionsCount)*100)}%)`);
    } catch (error) {
      console.error('Error during exam simulation:', error);
      toast.error('Erreur lors de la simulation d\'examen');
    } finally {
      setLoading(false);
    }
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
                          className={`border rounded-md p-3 cursor-pointer transition-colors ${
                            selectedType === type.title 
                              ? 'border-medical-teal bg-medical-teal/10' 
                              : 'hover:border-medical-teal'
                          }`}
                          onClick={() => setSelectedType(type.title)}
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
                    <label className="block text-sm font-medium mb-1">
                      Matières ({selectedSubjects.length} sélectionnée{selectedSubjects.length !== 1 ? 's' : ''})
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {subjects.map((subject, index) => (
                        <div 
                          key={index} 
                          className={`border rounded-md px-3 py-1 cursor-pointer transition-colors text-sm ${
                            selectedSubjects.includes(subject)
                              ? 'bg-medical-teal text-white border-medical-teal'
                              : 'hover:bg-medical-teal hover:text-white'
                          }`}
                          onClick={() => toggleSubject(subject)}
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
                        value={questionsCount}
                        onChange={(e) => setQuestionsCount(parseInt(e.target.value) || 30)}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Durée (minutes)</label>
                      <input
                        type="number"
                        min="10"
                        max="240"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={simulateExam} 
                  disabled={loading || selectedSubjects.length === 0}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Examen en cours...
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
