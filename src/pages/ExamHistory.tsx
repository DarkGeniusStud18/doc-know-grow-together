
// Page d'historique des examens de l'utilisateur
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Calendar, FileText, LayoutGrid, Search } from 'lucide-react';

// Type pour les entrées d'historique d'examen
type ExamHistoryEntry = {
  id: string;
  title: string;
  type: 'QCM' | 'Questions ouvertes' | 'Cas cliniques';
  subject: string;
  date: string;
  score: string;
  duration: string;
  questionsCount: number;
};

const ExamHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  
  // Données fictives pour la démo
  const examHistory: ExamHistoryEntry[] = [
    {
      id: '1',
      title: 'Examen blanc QCM - Cardiologie',
      type: 'QCM',
      subject: 'Cardiologie',
      date: '2025-05-10',
      score: '76%',
      duration: '45 min',
      questionsCount: 30
    },
    {
      id: '2',
      title: 'Cas cliniques - Neurologie',
      type: 'Cas cliniques',
      subject: 'Neurologie',
      date: '2025-05-05',
      score: '82%',
      duration: '60 min',
      questionsCount: 5
    },
    {
      id: '3',
      title: 'Questions ouvertes - Pharmacologie',
      type: 'Questions ouvertes',
      subject: 'Pharmacologie',
      date: '2025-04-29',
      score: '68%',
      duration: '50 min',
      questionsCount: 10
    },
    {
      id: '4',
      title: 'QCM - Anatomie générale',
      type: 'QCM',
      subject: 'Anatomie',
      date: '2025-04-22',
      score: '88%',
      duration: '40 min',
      questionsCount: 25
    },
    {
      id: '5',
      title: 'Cas cliniques - Pédiatrie',
      type: 'Cas cliniques',
      subject: 'Pédiatrie',
      date: '2025-04-15',
      score: '74%',
      duration: '70 min',
      questionsCount: 3
    },
    {
      id: '6',
      title: 'QCM - Infectiologie',
      type: 'QCM',
      subject: 'Infectiologie',
      date: '2025-04-08',
      score: '92%',
      duration: '35 min',
      questionsCount: 20
    },
    {
      id: '7',
      title: 'Questions ouvertes - Psychiatrie',
      type: 'Questions ouvertes',
      subject: 'Psychiatrie',
      date: '2025-04-01',
      score: '79%',
      duration: '55 min',
      questionsCount: 8
    }
  ];
  
  // Liste des matières uniques pour le filtre
  const subjects = Array.from(new Set(examHistory.map(exam => exam.subject)));
  
  // Filtrage des examens en fonction de la recherche et des filtres
  const filteredExams = examHistory.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || exam.type === typeFilter;
    const matchesSubject = subjectFilter === 'all' || exam.subject === subjectFilter;
    
    return matchesSearch && matchesType && matchesSubject;
  });
  
  // Formatage de la date pour l'affichage
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric'
    }).format(date);
  };

  // Fonction pour obtenir l'icône en fonction du type d'examen
  const getExamIcon = (type: 'QCM' | 'Questions ouvertes' | 'Cas cliniques') => {
    switch (type) {
      case 'QCM':
        return <LayoutGrid className="h-5 w-5" />;
      case 'Questions ouvertes':
        return <FileText className="h-5 w-5" />;
      case 'Cas cliniques':
        return <Brain className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };
  
  // Fonction pour obtenir la couleur en fonction du type d'examen
  const getExamTypeColor = (type: 'QCM' | 'Questions ouvertes' | 'Cas cliniques') => {
    switch (type) {
      case 'QCM':
        return 'bg-blue-100 text-blue-600';
      case 'Questions ouvertes':
        return 'bg-green-100 text-green-600';
      case 'Cas cliniques':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <MainLayout>
      <div className="container py-6 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Historique des examens</h1>
          <p className="text-gray-500">Consultez et analysez vos performances aux examens précédents</p>
        </div>
        
        {/* Filtres et recherche */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Rechercher un examen..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Type d'examen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="QCM">QCM</SelectItem>
              <SelectItem value="Questions ouvertes">Questions ouvertes</SelectItem>
              <SelectItem value="Cas cliniques">Cas cliniques</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Matière" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les matières</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>{subject}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Statistiques générales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="text-4xl font-bold text-medical-teal">{examHistory.length}</div>
                <div className="text-sm text-gray-500 mt-1">Examens passés</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="text-4xl font-bold text-medical-teal">
                  {Math.round(examHistory.reduce((acc, exam) => acc + parseInt(exam.score), 0) / examHistory.length)}%
                </div>
                <div className="text-sm text-gray-500 mt-1">Score moyen</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="text-4xl font-bold text-medical-teal">
                  {examHistory.reduce((acc, exam) => acc + exam.questionsCount, 0)}
                </div>
                <div className="text-sm text-gray-500 mt-1">Questions répondues</div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Liste des examens */}
        <Card>
          <CardHeader>
            <CardTitle>Examens ({filteredExams.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredExams.length > 0 ? (
              <div className="space-y-4">
                {filteredExams.map((exam) => (
                  <div key={exam.id} className="flex items-start gap-3 p-4 border rounded-md hover:bg-gray-50 transition-colors">
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getExamTypeColor(exam.type)}`}>
                      {getExamIcon(exam.type)}
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                        <div>
                          <h3 className="font-medium text-lg">{exam.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-500">{formatDate(exam.date)}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end">
                          <Badge className="mb-1" variant={parseInt(exam.score) >= 80 ? 'default' : 'outline'}>
                            Score: {exam.score}
                          </Badge>
                          <div className="text-xs text-gray-500">
                            {exam.questionsCount} questions · {exam.duration}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex gap-2">
                        <Button variant="outline" size="sm">Voir détails</Button>
                        <Button variant="outline" size="sm">Refaire l'examen</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">Aucun examen ne correspond à vos critères</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setTypeFilter('all');
                    setSubjectFilter('all');
                  }}
                  className="mt-2"
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ExamHistory;
