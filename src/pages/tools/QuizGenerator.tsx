
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { Plus, Edit, Trash2, Play, RotateCcw, CheckCircle, XCircle, Timer } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface QuizQuestion {
  id: string;
  title: string;
  question: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer';
  options: string[];
  correct_answer: string;
  explanation: string;
  category: string;
  difficulty: number;
  created_at: string;
}

interface PlayzoneSession {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: Record<string, string>;
  startTime: Date;
  timeSpent: number;
  score: number;
  isComplete: boolean;
}

const QuizGenerator = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Quiz creation state
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [questionForm, setQuestionForm] = useState({
    title: '',
    question: '',
    question_type: 'multiple_choice' as 'multiple_choice' | 'true_false' | 'short_answer',
    options: ['', '', '', ''],
    correct_answer: '',
    explanation: '',
    category: '',
    difficulty: 1
  });

  // Playzone state
  const [playzoneSession, setPlayzoneSession] = useState<PlayzoneSession | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [showResults, setShowResults] = useState(false);

  // Fetch questions
  const { data: questions = [], refetch } = useQuery({
    queryKey: ['quiz-questions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as QuizQuestion[];
    },
    enabled: !!user
  });

  // Create/Update question
  const saveMutation = useMutation({
    mutationFn: async (questionData: Omit<QuizQuestion, 'id' | 'created_at'>) => {
      if (!user) throw new Error('Non authentifié');

      if (editingQuestion) {
        const { error } = await supabase
          .from('quiz_questions')
          .update(questionData)
          .eq('id', editingQuestion.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('quiz_questions')
          .insert({ ...questionData, user_id: user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz-questions', user?.id] });
      setShowForm(false);
      setEditingQuestion(null);
      resetForm();
      toast.success(editingQuestion ? 'Question mise à jour' : 'Question créée');
    },
    onError: () => {
      toast.error('Erreur lors de la sauvegarde');
    }
  });

  // Delete question
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('quiz_questions')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz-questions', user?.id] });
      toast.success('Question supprimée');
    },
    onError: () => {
      toast.error('Erreur lors de la suppression');
    }
  });

  const resetForm = () => {
    setQuestionForm({
      title: '',
      question: '',
      question_type: 'multiple_choice',
      options: ['', '', '', ''],
      correct_answer: '',
      explanation: '',
      category: '',
      difficulty: 1
    });
  };

  const handleSave = () => {
    if (!questionForm.title || !questionForm.question || !questionForm.correct_answer) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const cleanOptions = questionForm.question_type === 'multiple_choice' 
      ? questionForm.options.filter(opt => opt.trim()) 
      : [];

    saveMutation.mutate({
      title: questionForm.title,
      question: questionForm.question,
      question_type: questionForm.question_type,
      options: cleanOptions,
      correct_answer: questionForm.correct_answer,
      explanation: questionForm.explanation,
      category: questionForm.category,
      difficulty: questionForm.difficulty
    });
  };

  const handleEdit = (question: QuizQuestion) => {
    setEditingQuestion(question);
    setQuestionForm({
      title: question.title,
      question: question.question,
      question_type: question.question_type,
      options: question.question_type === 'multiple_choice' ? [...question.options, '', '', '', ''].slice(0, 4) : ['', '', '', ''],
      correct_answer: question.correct_answer,
      explanation: question.explanation,
      category: question.category,
      difficulty: question.difficulty
    });
    setShowForm(true);
  };

  // Playzone functions
  const startRandomQuiz = () => {
    if (questions.length === 0) {
      toast.error('Vous devez créer des questions avant de jouer');
      return;
    }

    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, Math.min(10, questions.length));

    setPlayzoneSession({
      questions: selectedQuestions,
      currentQuestionIndex: 0,
      answers: {},
      startTime: new Date(),
      timeSpent: 0,
      score: 0,
      isComplete: false
    });
    setCurrentAnswer('');
    setShowResults(false);
  };

  const submitAnswer = () => {
    if (!playzoneSession || !currentAnswer) {
      toast.error('Veuillez sélectionner une réponse');
      return;
    }

    const currentQuestion = playzoneSession.questions[playzoneSession.currentQuestionIndex];
    const isCorrect = currentAnswer === currentQuestion.correct_answer;
    
    const updatedAnswers = {
      ...playzoneSession.answers,
      [currentQuestion.id]: currentAnswer
    };

    const updatedSession = {
      ...playzoneSession,
      answers: updatedAnswers,
      score: isCorrect ? playzoneSession.score + 1 : playzoneSession.score
    };

    setPlayzoneSession(updatedSession);
    
    // Move to next question or complete quiz
    if (playzoneSession.currentQuestionIndex < playzoneSession.questions.length - 1) {
      setTimeout(() => {
        setPlayzoneSession(prev => prev ? {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1
        } : null);
        setCurrentAnswer('');
      }, 1500);
    } else {
      setTimeout(() => {
        setPlayzoneSession(prev => prev ? {
          ...prev,
          isComplete: true,
          timeSpent: Math.floor((new Date().getTime() - prev.startTime.getTime()) / 1000)
        } : null);
        setShowResults(true);
      }, 1500);
    }

    toast.success(isCorrect ? 'Correct !' : 'Incorrect');
  };

  const exitPlayzone = () => {
    setPlayzoneSession(null);
    setCurrentAnswer('');
    setShowResults(false);
  };

  // Timer effect for playzone
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playzoneSession && !playzoneSession.isComplete) {
      interval = setInterval(() => {
        setPlayzoneSession(prev => prev ? {
          ...prev,
          timeSpent: Math.floor((new Date().getTime() - prev.startTime.getTime()) / 1000)
        } : null);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [playzoneSession]);

  // If in playzone mode, show quiz interface
  if (playzoneSession && !showResults) {
    const currentQuestion = playzoneSession.questions[playzoneSession.currentQuestionIndex];
    const isAnswered = playzoneSession.answers[currentQuestion.id];
    
    return (
      <MainLayout requireAuth={true}>
        <div className="container mx-auto py-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-medical-navy">Playzone Quiz</h1>
              <p className="text-gray-600">
                Question {playzoneSession.currentQuestionIndex + 1} sur {playzoneSession.questions.length}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center text-medical-blue">
                <Timer className="h-4 w-4 mr-1" />
                {Math.floor(playzoneSession.timeSpent / 60)}:{(playzoneSession.timeSpent % 60).toString().padStart(2, '0')}
              </div>
              <Badge>Score: {playzoneSession.score}/{playzoneSession.currentQuestionIndex + (isAnswered ? 1 : 0)}</Badge>
              <Button onClick={exitPlayzone} variant="outline" size="sm">
                Quitter
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{currentQuestion.title}</CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline">{currentQuestion.category}</Badge>
                <Badge variant="outline">Difficulté: {currentQuestion.difficulty}/5</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>
                
                {currentQuestion.question_type === 'multiple_choice' && (
                  <div className="space-y-2">
                    {currentQuestion.options.map((option, index) => (
                      <Button
                        key={index}
                        variant={currentAnswer === option ? "default" : "outline"}
                        className="w-full text-left justify-start h-auto p-4"
                        onClick={() => setCurrentAnswer(option)}
                        disabled={!!isAnswered}
                      >
                        {String.fromCharCode(65 + index)}. {option}
                      </Button>
                    ))}
                  </div>
                )}
                
                {currentQuestion.question_type === 'true_false' && (
                  <div className="space-y-2">
                    <Button
                      variant={currentAnswer === 'true' ? "default" : "outline"}
                      className="w-full"
                      onClick={() => setCurrentAnswer('true')}
                      disabled={!!isAnswered}
                    >
                      Vrai
                    </Button>
                    <Button
                      variant={currentAnswer === 'false' ? "default" : "outline"}
                      className="w-full"
                      onClick={() => setCurrentAnswer('false')}
                      disabled={!!isAnswered}
                    >
                      Faux
                    </Button>
                  </div>
                )}
                
                {currentQuestion.question_type === 'short_answer' && (
                  <Input
                    placeholder="Votre réponse..."
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    disabled={!!isAnswered}
                  />
                )}
              </div>
              
              {isAnswered && (
                <div className={`p-4 rounded border-l-4 ${
                  isAnswered === currentQuestion.correct_answer 
                    ? 'bg-green-50 border-green-500' 
                    : 'bg-red-50 border-red-500'
                }`}>
                  <div className="flex items-center mb-2">
                    {isAnswered === currentQuestion.correct_answer ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mr-2" />
                    )}
                    <span className="font-medium">
                      {isAnswered === currentQuestion.correct_answer ? 'Correct !' : 'Incorrect'}
                    </span>
                  </div>
                  {isAnswered !== currentQuestion.correct_answer && (
                    <p className="text-sm">Bonne réponse: {currentQuestion.correct_answer}</p>
                  )}
                  {currentQuestion.explanation && (
                    <p className="text-sm mt-2">{currentQuestion.explanation}</p>
                  )}
                </div>
              )}
              
              {!isAnswered && (
                <Button 
                  onClick={submitAnswer} 
                  disabled={!currentAnswer}
                  className="w-full"
                >
                  Valider la réponse
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Show results
  if (showResults && playzoneSession) {
    const percentage = Math.round((playzoneSession.score / playzoneSession.questions.length) * 100);
    
    return (
      <MainLayout requireAuth={true}>
        <div className="container mx-auto py-6 space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Quiz Terminé !</CardTitle>
              <CardDescription>Voici vos résultats</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{playzoneSession.score}</div>
                  <div className="text-sm text-blue-600">Bonnes réponses</div>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{percentage}%</div>
                  <div className="text-sm text-green-600">Score</div>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">
                    {Math.floor(playzoneSession.timeSpent / 60)}:{(playzoneSession.timeSpent % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-purple-600">Temps total</div>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button onClick={startRandomQuiz}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Rejouer
                </Button>
                <Button onClick={exitPlayzone} variant="outline">
                  Retour au générateur
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout requireAuth={true}>
      <div className="container mx-auto py-6 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">
            Générateur de Quiz
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Créez des questionnaires personnalisés et testez vos connaissances
          </p>
        </div>

        <Tabs defaultValue="questions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="questions">Mes Questions ({questions.length})</TabsTrigger>
            <TabsTrigger value="playzone">Playzone</TabsTrigger>
          </TabsList>
          
          <TabsContent value="questions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Mes Questions</h2>
              <Button 
                onClick={() => {
                  setEditingQuestion(null);
                  resetForm();
                  setShowForm(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Question
              </Button>
            </div>

            {showForm && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingQuestion ? 'Modifier la question' : 'Nouvelle question'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Titre</Label>
                      <Input
                        id="title"
                        placeholder="Titre de la question"
                        value={questionForm.title}
                        onChange={(e) => setQuestionForm(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Catégorie</Label>
                      <Input
                        id="category"
                        placeholder="Ex: Médecine, Biologie..."
                        value={questionForm.category}
                        onChange={(e) => setQuestionForm(prev => ({ ...prev, category: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="question">Question</Label>
                    <Textarea
                      id="question"
                      placeholder="Votre question..."
                      value={questionForm.question}
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, question: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Type de question</Label>
                      <Select
                        value={questionForm.question_type}
                        onValueChange={(value: any) => setQuestionForm(prev => ({ ...prev, question_type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multiple_choice">QCM</SelectItem>
                          <SelectItem value="true_false">Vrai/Faux</SelectItem>
                          <SelectItem value="short_answer">Réponse courte</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="difficulty">Difficulté (1-5)</Label>
                      <Select
                        value={questionForm.difficulty.toString()}
                        onValueChange={(value) => setQuestionForm(prev => ({ ...prev, difficulty: parseInt(value) }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map(num => (
                            <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {questionForm.question_type === 'multiple_choice' && (
                    <div>
                      <Label>Options de réponse</Label>
                      <div className="space-y-2">
                        {questionForm.options.map((option, index) => (
                          <Input
                            key={index}
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...questionForm.options];
                              newOptions[index] = e.target.value;
                              setQuestionForm(prev => ({ ...prev, options: newOptions }));
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="correct_answer">Réponse correcte</Label>
                    {questionForm.question_type === 'multiple_choice' ? (
                      <Select
                        value={questionForm.correct_answer}
                        onValueChange={(value) => setQuestionForm(prev => ({ ...prev, correct_answer: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez la bonne réponse" />
                        </SelectTrigger>
                        <SelectContent>
                          {questionForm.options.filter(opt => opt.trim()).map((option, index) => (
                            <SelectItem key={index} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : questionForm.question_type === 'true_false' ? (
                      <Select
                        value={questionForm.correct_answer}
                        onValueChange={(value) => setQuestionForm(prev => ({ ...prev, correct_answer: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Vrai</SelectItem>
                          <SelectItem value="false">Faux</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        placeholder="Réponse correcte"
                        value={questionForm.correct_answer}
                        onChange={(e) => setQuestionForm(prev => ({ ...prev, correct_answer: e.target.value }))}
                      />
                    )}
                  </div>

                  <div>
                    <Label htmlFor="explanation">Explication (optionnelle)</Label>
                    <Textarea
                      id="explanation"
                      placeholder="Expliquez pourquoi cette réponse est correcte..."
                      value={questionForm.explanation}
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, explanation: e.target.value }))}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={saveMutation.isPending}>
                      {saveMutation.isPending ? 'Sauvegarde...' : (editingQuestion ? 'Mettre à jour' : 'Créer')}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowForm(false);
                        setEditingQuestion(null);
                        resetForm();
                      }}
                    >
                      Annuler
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {questions.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500">Aucune question créée</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {questions.map((question) => (
                  <Card key={question.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{question.title}</h3>
                          <p className="text-gray-600 mt-1">{question.question}</p>
                          <div className="flex gap-2 mt-3">
                            <Badge variant="outline">{question.category}</Badge>
                            <Badge variant="outline">{question.question_type}</Badge>
                            <Badge variant="outline">Difficulté: {question.difficulty}/5</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(question)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => deleteMutation.mutate(question.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="playzone" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Play className="h-6 w-6 mr-2 text-medical-blue" />
                  Playzone Quiz
                </CardTitle>
                <CardDescription>
                  Testez vos connaissances avec un quiz aléatoire basé sur vos questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-6">
                  <div className="bg-gradient-to-r from-medical-blue to-medical-teal rounded-lg p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">Quiz Aléatoire</h3>
                    <p className="opacity-90">
                      Un quiz de 10 questions (maximum) sera généré aléatoirement à partir de vos questions
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
                      <div className="text-sm text-blue-600">Questions disponibles</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{Math.min(10, questions.length)}</div>
                      <div className="text-sm text-green-600">Questions du quiz</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">∞</div>
                      <div className="text-sm text-purple-600">Tentatives</div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={startRandomQuiz}
                    disabled={questions.length === 0}
                    size="lg"
                    className="bg-gradient-to-r from-medical-blue to-medical-teal hover:from-medical-blue/90 hover:to-medical-teal/90"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Commencer le Quiz
                  </Button>
                  
                  {questions.length === 0 && (
                    <p className="text-gray-500 text-sm">
                      Vous devez créer au moins une question pour utiliser le Playzone
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default QuizGenerator;
