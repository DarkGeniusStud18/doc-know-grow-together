
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CalendarRange, Plus, Clock, BookOpen } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

type StudySession = {
  id: string;
  title: string;
  subject: string;
  duration: number;
  date: string;
  time: string;
  description: string;
};

const StudyPlanner = () => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    duration: 60,
    date: '',
    time: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSession: StudySession = {
      id: Date.now().toString(),
      ...formData
    };
    
    setSessions([...sessions, newSession]);
    setFormData({
      title: '',
      subject: '',
      duration: 60,
      date: '',
      time: '',
      description: ''
    });
    setShowForm(false);
    toast.success('Session d\'étude planifiée avec succès !');
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <CalendarRange className="h-8 w-8 text-medical-blue" />
              Planificateur d'études
            </h1>
            <p className="text-gray-600 mt-2">Organisez vos sessions d'étude et maximisez votre productivité</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle session
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {showForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Planifier une nouvelle session</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Titre</label>
                        <Input
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Ex: Révision Anatomie"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Matière</label>
                        <Input
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder="Ex: Cardiologie"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Durée (minutes)</label>
                        <Input
                          type="number"
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                          min="15"
                          max="480"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Date</label>
                        <Input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Heure</label>
                        <Input
                          type="time"
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Description (optionnel)</label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Objectifs et notes pour cette session..."
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button type="submit">Planifier</Button>
                      <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                        Annuler
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Mes sessions planifiées</CardTitle>
                <CardDescription>
                  {sessions.length} session{sessions.length !== 1 ? 's' : ''} programmée{sessions.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sessions.length === 0 ? (
                  <div className="text-center py-8">
                    <CalendarRange className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aucune session planifiée</p>
                    <p className="text-sm text-gray-400 mt-1">Cliquez sur "Nouvelle session" pour commencer</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <div key={session.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold">{session.title}</h3>
                            <p className="text-sm text-gray-600">{session.subject}</p>
                            {session.description && (
                              <p className="text-sm text-gray-500 mt-1">{session.description}</p>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <Clock className="h-4 w-4 mr-1" />
                              {session.duration} min
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(session.date).toLocaleDateString('fr-FR')} à {session.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sessions cette semaine</span>
                    <span className="font-semibold">{sessions.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Temps total planifié</span>
                    <span className="font-semibold">
                      {Math.round(sessions.reduce((acc, s) => acc + s.duration, 0) / 60)}h
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudyPlanner;
