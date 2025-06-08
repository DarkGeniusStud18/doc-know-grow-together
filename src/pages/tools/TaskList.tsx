
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Check, Clock, AlertCircle, Trash2 } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/types/database';

const TaskList: React.FC = () => {
  const { tasks, categories, isLoading, createTask, updateTask, deleteTask, createCategory } = useTasks();
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    due_date: ''
  });
  const [newCategory, setNewCategory] = useState({ name: '', color: '#3B82F6' });

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    await createTask({
      ...newTask,
      status: 'pending',
      due_date: newTask.due_date || undefined
    });

    setNewTask({ title: '', description: '', priority: 'medium', due_date: '' });
    setShowNewTaskForm(false);
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;

    await createCategory(newCategory);
    setNewCategory({ name: '', color: '#3B82F6' });
    setShowNewCategoryForm(false);
  };

  const toggleTaskStatus = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await updateTask(task.id, { status: newStatus });
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low': return <Clock className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-teal"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Gestionnaire de tâches</h1>
          <div className="flex gap-2">
            <Button onClick={() => setShowNewCategoryForm(true)} variant="outline">
              Nouvelle catégorie
            </Button>
            <Button onClick={() => setShowNewTaskForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle tâche
            </Button>
          </div>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Catégories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge key={category.id} style={{ backgroundColor: category.color, color: 'white' }}>
                    {category.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* New Category Form */}
        {showNewCategoryForm && (
          <Card>
            <CardHeader>
              <CardTitle>Nouvelle catégorie</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <Input
                  placeholder="Nom de la catégorie"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
                <div className="flex items-center gap-2">
                  <label>Couleur:</label>
                  <input
                    type="color"
                    value={newCategory.color}
                    onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                    className="w-10 h-10 rounded"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Créer</Button>
                  <Button type="button" variant="outline" onClick={() => setShowNewCategoryForm(false)}>
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* New Task Form */}
        {showNewTaskForm && (
          <Card>
            <CardHeader>
              <CardTitle>Nouvelle tâche</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <Input
                  placeholder="Titre de la tâche"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
                <Textarea
                  placeholder="Description (optionnelle)"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Select value={newTask.priority} onValueChange={(value: any) => setNewTask({ ...newTask, priority: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Priorité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Faible</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="high">Élevée</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="datetime-local"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Créer la tâche</Button>
                  <Button type="button" variant="outline" onClick={() => setShowNewTaskForm(false)}>
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Tasks List */}
        <div className="grid gap-4">
          {tasks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">Aucune tâche pour le moment.</p>
                <p className="text-sm text-gray-400 mt-2">Créez votre première tâche pour commencer !</p>
              </CardContent>
            </Card>
          ) : (
            tasks.map((task) => (
              <Card key={task.id} className={`transition-all duration-200 ${task.status === 'completed' ? 'opacity-75' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleTaskStatus(task)}
                        className={`mt-1 ${task.status === 'completed' ? 'text-green-600' : 'text-gray-400'}`}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className={`font-semibold ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                            {task.title}
                          </h3>
                          {getPriorityIcon(task.priority)}
                          <Badge className={getStatusColor(task.status)}>
                            {task.status === 'completed' ? 'Terminée' :
                             task.status === 'in_progress' ? 'En cours' : 'En attente'}
                          </Badge>
                        </div>
                        {task.description && (
                          <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                        )}
                        {task.due_date && (
                          <p className="text-xs text-gray-500">
                            Échéance: {new Date(task.due_date).toLocaleDateString('fr-FR')}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default TaskList;
