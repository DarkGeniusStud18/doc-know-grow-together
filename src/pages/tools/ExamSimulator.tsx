
/**
 * 🎓 Simulateur d'Examens - Préparation aux épreuves médicales
 * Interface complète de simulation d'examens avec QCM et évaluation
 */

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  GraduationCap, Clock, CheckCircle, XCircle, Award,
  Play, Pause, RotateCcw, BookOpen, Target, TrendingUp
} from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  points: number;
}

interface ExamResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  percentage: number;
  grade: string;
}

const ExamSimulator: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isExamFinished, setIsExamFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [isPaused, setIsPaused] = useState(false);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [selectedExamType, setSelectedExamType] = useState('paces');

  // Questions d'exemple pour le simulateur
  const examQuestions: Question[] = [
    {
      id: '1',
      question: 'Quel est le principal symptôme de l\'insuffisance cardiaque congestive ?',
      options: [
        'Douleur thoracique',
        'Dyspnée d\'effort',
        'Palpitations',
        'Syncope'
      ],
      correctAnswer: 1,
      explanation: 'La dyspnée d\'effort est le symptôme cardinal de l\'insuffisance cardiaque, causée par l\'œdème pulmonaire.',
      difficulty: 'medium',
      category: 'Cardiologie',
      points: 2
    },
    {
      id: '2',
      question: 'Quelle est la dose initiale recommandée d\'aspirine pour un infarctus du myocarde ?',
      options: [
        '75 mg',
        '150 mg',
        '300 mg',
        '500 mg'
      ],
      correctAnswer: 2,
      explanation: 'La dose de charge d\'aspirine pour un IDM est de 300 mg, suivie d\'une dose d\'entretien de 75-100 mg.',
      difficulty: 'hard',
      category: 'Cardiologie',
      points: 3
    },
    {
      id: '3',
      question: 'Quel examen est le plus spécifique pour diagnostiquer une embolie pulmonaire ?',
      options: [
        'Radiographie thoracique',
        'ECG',
        'Angioscanner pulmonaire',
        'Échographie cardiaque'
      ],
      correctAnswer: 2,
      explanation: 'L\'angioscanner pulmonaire est l\'examen de référence pour le diagnostic de l\'embolie pulmonaire.',
      difficulty: 'medium',
      category: 'Pneumologie',
      points: 2
    },
    {
      id: '4',
      question: 'Quelle est la cause la plus fréquente de méningite bactérienne chez l\'adulte ?',
      options: [
        'Haemophilus influenzae',
        'Streptococcus pneumoniae',
        'Neisseria meningitidis',
        'Listeria monocytogenes'
      ],
      correctAnswer: 1,
      explanation: 'Streptococcus pneumoniae est la cause la plus fréquente de méningite bactérienne chez l\'adulte.',
      difficulty: 'easy',
      category: 'Neurologie',
      points: 1
    },
    {
      id: '5',
      question: 'Quel est le traitement de première intention de l\'hypertension artérielle essentielle ?',
      options: [
        'Diurétiques thiazidiques',
        'Beta-bloquants',
        'IEC ou ARA2',
        'Inhibiteurs calciques'
      ],
      correctAnswer: 2,
      explanation: 'Les IEC ou ARA2 sont recommandés en première intention pour l\'HTA essentielle, sauf contre-indication.',
      difficulty: 'medium',
      category: 'Cardiologie',
      points: 2
    }
  ];

  const examTypes = [
    {
      id: 'paces',
      name: 'PACES - Première Année',
      description: 'QCM de première année de médecine',
      duration: 60,
      questions: 25,
      difficulty: 'Débutant'
    },
    {
      id: 'ecn',
      name: 'ECN - Épreuves Classantes',
      description: 'Simulation des épreuves classantes nationales',
      duration: 90,
      questions: 40,
      difficulty: 'Avancé'
    },
    {
      id: 'specialty',
      name: 'Spécialité Médicale',
      description: 'Questions spécialisées par domaine',
      duration: 45,
      questions: 20,
      difficulty: 'Expert'
    }
  ];

  /**
   * 🚀 Démarrage de l'examen
   */
  const startExam = (examType: string) => {
    const exam = examTypes.find(e => e.id === examType);
    if (!exam) return;

    setSelectedExamType(examType);
    setTimeLeft(exam.duration * 60);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setIsExamStarted(true);
    setIsExamFinished(false);
    setIsPaused(false);
    setExamResult(null);
    
    toast.success(`Examen ${exam.name} démarré !`);
  };

  /**
   * 📝 Sélection d'une réponse
   */
  const selectAnswer = (answerIndex: number) => {
    if (isExamFinished) return;
    
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  /**
   * ➡️ Question suivante
   */
  const nextQuestion = () => {
    if (currentQuestion < examQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  /**
   * ⬅️ Question précédente
   */
  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  /**
   * 🏁 Terminer l'examen
   */
  const finishExam = () => {
    if (!isExamStarted) return;

    let correctAnswers = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    examQuestions.forEach((question, index) => {
      totalPoints += question.points;
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
        earnedPoints += question.points;
      }
    });

    const percentage = Math.round((earnedPoints / totalPoints) * 100);
    const timeSpent = (examTypes.find(e => e.id === selectedExamType)?.duration || 60) * 60 - timeLeft;
    
    let grade = 'F';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 85) grade = 'A';
    else if (percentage >= 80) grade = 'B+';
    else if (percentage >= 75) grade = 'B';
    else if (percentage >= 70) grade = 'C+';
    else if (percentage >= 65) grade = 'C';
    else if (percentage >= 60) grade = 'D';

    const result: ExamResult = {
      score: earnedPoints,
      totalQuestions: examQuestions.length,
      correctAnswers,
      timeSpent,
      percentage,
      grade
    };

    setExamResult(result);
    setIsExamFinished(true);
    setIsExamStarted(false);
    setShowResultDialog(true);
    
    toast.success(`Examen terminé ! Score: ${percentage}%`);
  };

  /**
   * 🔄 Redémarrer l'examen
   */
  const restartExam = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setIsExamStarted(false);
    setIsExamFinished(false);
    setIsPaused(false);
    setExamResult(null);
    setShowResultDialog(false);
  };

  /**
   * ⏯️ Basculer pause
   */
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  /**
   * 📊 Formatage du temps
   */
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * 🎨 Couleur de difficulté
   */
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Débutant': return 'bg-green-100 text-green-800';
      case 'Avancé': return 'bg-orange-100 text-orange-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Timer pour l'examen
  useEffect(() => {
    if (isExamStarted && !isPaused && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            finishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isExamStarted, isPaused, timeLeft]);

  // Interface principale - Sélection du type d'examen
  if (!isExamStarted && !isExamFinished) {
    return (
      <MainLayout requireAuth={true}>
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-medical-navy flex items-center justify-center gap-3 mb-4">
              <GraduationCap className="h-8 w-8 text-medical-blue" />
              Simulateur d'Examens
            </h1>
            <p className="text-lg text-gray-600">
              Préparez-vous efficacement avec nos simulations d'examens médicaux
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examTypes.map((exam) => (
              <Card key={exam.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{exam.name}</CardTitle>
                    <Badge className={getDifficultyColor(exam.difficulty)}>
                      {exam.difficulty}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {exam.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        Durée
                      </span>
                      <span className="font-medium">{exam.duration} min</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4 text-gray-500" />
                        Questions
                      </span>
                      <span className="font-medium">{exam.questions}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Target className="h-4 w-4 text-gray-500" />
                        Objectif
                      </span>
                      <span className="font-medium">≥ 70%</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => startExam(exam.id)}
                    className="w-full bg-medical-blue hover:bg-medical-blue/90"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Commencer l'examen
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Statistiques de performance */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-medical-blue" />
                Vos Performances
              </CardTitle>
              <CardDescription>
                Historique de vos derniers examens
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Award className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Aucun examen terminé pour le moment</p>
                <p className="text-sm">Commencez votre premier examen pour voir vos statistiques</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Interface d'examen en cours
  if (isExamStarted) {
    const question = examQuestions[currentQuestion];
    const progress = ((currentQuestion + 1) / examQuestions.length) * 100;

    return (
      <MainLayout requireAuth={true}>
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Barre de progression et timer */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Badge variant="outline">
                    Question {currentQuestion + 1} / {examQuestions.length}
                  </Badge>
                  <Badge className={getDifficultyColor(question.difficulty)}>
                    {question.difficulty}
                  </Badge>
                  <Badge variant="secondary">
                    {question.category}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className={`font-mono font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-gray-700'}`}>
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={togglePause}
                  >
                    {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <Progress value={progress} className="w-full" />
            </CardContent>
          </Card>

          {/* Question actuelle */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">
                {question.question}
              </CardTitle>
              <CardDescription>
                Sélectionnez la réponse correcte ({question.points} point{question.points > 1 ? 's' : ''})
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswers[currentQuestion] === index ? "default" : "outline"}
                    className="w-full text-left justify-start h-auto p-4"
                    onClick={() => selectAnswer(index)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span>{option}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={previousQuestion}
                  disabled={currentQuestion === 0}
                >
                  ← Précédent
                </Button>
                
                <div className="flex gap-2">
                  {currentQuestion === examQuestions.length - 1 ? (
                    <Button
                      onClick={finishExam}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Terminer l'examen
                    </Button>
                  ) : (
                    <Button
                      onClick={nextQuestion}
                      disabled={selectedAnswers[currentQuestion] === undefined}
                    >
                      Suivant →
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout requireAuth={true}>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Dialog des résultats */}
        <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Award className="h-6 w-6 text-yellow-500" />
                Résultats de l'examen
              </DialogTitle>
              <DialogDescription>
                Voici le détail de votre performance
              </DialogDescription>
            </DialogHeader>

            {examResult && (
              <div className="space-y-6 mt-4">
                {/* Score principal */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-medical-blue mb-2">
                    {examResult.percentage}%
                  </div>
                  <div className="text-xl font-semibold text-gray-700 mb-1">
                    Note: {examResult.grade}
                  </div>
                  <p className="text-gray-600">
                    {examResult.correctAnswers} / {examResult.totalQuestions} bonnes réponses
                  </p>
                </div>

                {/* Détails */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {examResult.correctAnswers}
                    </div>
                    <div className="text-sm text-gray-600">Bonnes réponses</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatTime(examResult.timeSpent)}
                    </div>
                    <div className="text-sm text-gray-600">Temps utilisé</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowResultDialog(false)}
                    className="flex-1"
                  >
                    Fermer
                  </Button>
                  <Button
                    onClick={restartExam}
                    className="flex-1"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Nouveau test
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default ExamSimulator;
