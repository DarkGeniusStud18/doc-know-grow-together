
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Plus, FileQuestion, Trash2, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';

interface QuizQuestion {
  id: string;
  title: string;
  question: string;
  question_type: string;
  options?: any;
  correct_answer: string;
  explanation?: string;
  category?: string;
  difficulty: number;
  created_at: string;
}

const QuizGenerator: React.FC = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    question: '',
    question_type: 'multiple_choice',
    options: ['', '', '', ''],
    correct_answer: '',
    explanation: '',
    category: '',
    difficulty: 1,
  });

  useEffect(() => {
    if (user) {
      loadQuestions();
    }
  }, [user]);

  const loadQuestions = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading questions:', error);
      toast.error('Erreur lors du chargement des questions');
    } else {
      setQuestions(data || []);
    }
    setLoading(false);
  };

  const createQuestion = async () => {
    if (!user || !newQuestion.title.trim() || !newQuestion.question.trim()) {
      toast.error('Veuillez remplir au moins le titre et la question');
      return;
    }

    const questionData = {
      user_id: user.id,
      title: newQuestion.title,
      question: newQuestion.question,
      question_type: newQuestion.question_type,
      correct_answer: newQuestion.correct_answer,
      explanation: newQuestion.explanation,
      category: newQuestion.category,
      difficulty: newQuestion.difficulty,
      options: newQuestion.question_type === 'multiple_choice' 
        ? newQuestion.options.filter(opt => opt.trim() !== '') 
        : null,
    };

    const { error } = await supabase
      .from('quiz_questions')
      .insert(questionData);

    if (error) {
      console.error('Error creating question:', error);
      toast.error('Erreur lors de la création de la question');
    } else {
      toast.success('Question créée !');
      setNewQuestion({
        title: '',
        question: '',
        question_type: 'multiple_choice',
        options: ['', '', '', ''],
        correct_answer: '',
        explanation: '',
        category: '',
        difficulty: 1,
      });
      setShowForm(false);
      loadQuestions();
    }
  };

  const deleteQuestion = async (questionId: string) => {
    const { error } = await supabase
      .from('quiz_questions')
      .delete()
      .eq('id', questionId);

    if (error) {
      console.error('Error deleting question:', error);
      toast.error('Erreur lors de la suppression');
    } else {
      toast.success('Question supprimée');
      loadQuestions();
    }
  };

  const updateOption = (index: number, value: string) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'bg-green-100 text-green-700';
      case 2: return 'bg-yellow-100 text-yellow-700';
      case 3: return 'bg-orange-100 text-orange-700';
      case 4: return 'bg-red-100 text-red-700';
      case 5: return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyLabel = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'Très facile';
      case 2: return 'Facile';
      case 3: return 'Moyen';
      case 4: return 'Difficile';
      case 5: return 'Très difficile';
      default: return 'Non défini';
    }
  };

  if (loading) {
    return (
      <MainLayout requireAuth={true}>
        <div className="container mx-auto py-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Chargement...</div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout requireAuth={true}>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8 text-medical-blue" />
            <div>
              <h1 className="text-2xl font-bold">Générateur de QCM</h1>
              <p className="text-gray-500">Créez des questionnaires personnalisés pour vos révisions</p>
            </div>
          </div>
          <Button className="mt-4 md:mt-0" onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Question
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Créer une nouvelle question</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Titre de la question"
                value={newQuestion.title}
                onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
              />
              <Textarea
                placeholder="Question"
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select 
                  value={newQuestion.question_type} 
                  onValueChange={(value) => setNewQuestion({ ...newQuestion, question_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type de question" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple_choice">QCM</SelectItem>
                    <SelectItem value="true_false">Vrai/Faux</SelectItem>
                    <SelectItem value="open_ended">Question ouverte</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Catégorie"
                  value={newQuestion.category}
                  onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                />
                <Select 
                  value={newQuestion.difficulty.toString()} 
                  onValueChange={(value) => setNewQuestion({ ...newQuestion, difficulty: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Difficulté" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Très facile</SelectItem>
                    <SelectItem value="2">Facile</SelectItem>
                    <SelectItem value="3">Moyen</SelectItem>
                    <SelectItem value="4">Difficile</SelectItem>
                    <SelectItem value="5">Très difficile</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newQuestion.question_type === 'multiple_choice' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Options de réponse:</label>
                  {newQuestion.options.map((option, index) => (
                    <Input
                      key={index}
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                    />
                  ))}
                </div>
              )}

              <Input
                placeholder="Réponse correcte"
                value={newQuestion.correct_answer}
                onChange={(e) => setNewQuestion({ ...newQuestion, correct_answer: e.target.value })}
              />
              <Textarea
                placeholder="Explication (optionnel)"
                value={newQuestion.explanation}
                onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
              />
              <div className="flex gap-2">
                <Button onClick={createQuestion}>Créer la question</Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>Annuler</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {questions.map((question) => (
            <Card key={question.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileQuestion className="h-5 w-5 text-blue-500" />
                      <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(question.difficulty)}`}>
                        {getDifficultyLabel(question.difficulty)}
                      </span>
                      {question.category && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {question.category}
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-lg">{question.title}</CardTitle>
                    <CardDescription className="mt-2">{question.question}</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:bg-red-50"
                    onClick={() => deleteQuestion(question.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {question.options && (
                  <div className="mb-3">
                    <p className="text-sm font-medium mb-1">Options:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {question.options.map((option: string, index: number) => (
                        <li key={index}>• {option}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mb-3">
                  <p className="text-sm font-medium">Réponse correcte:</p>
                  <p className="text-sm text-green-600">{question.correct_answer}</p>
                </div>
                {question.explanation && (
                  <div className="mb-3">
                    <p className="text-sm font-medium">Explication:</p>
                    <p className="text-sm text-gray-600">{question.explanation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {questions.length === 0 && (
          <div className="text-center py-12">
            <Brain className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-lg font-medium">Aucune question</h3>
            <p className="text-sm text-gray-500 mt-1">
              Commencez par créer votre première question de quiz !
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default QuizGenerator;
