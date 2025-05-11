
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarRange, Clock, Plus, Save, Trash } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';

interface StudySession {
  id: string;
  title: string;
  subject: string;
  day: string;
  startTime: string;
  endTime: string;
}

const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

const StudyPlanner: React.FC = () => {
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [newSession, setNewSession] = useState<Omit<StudySession, 'id'>>({
    title: '',
    subject: '',
    day: '',
    startTime: '',
    endTime: '',
  });

  const handleAddSession = () => {
    // Validate fields
    if (!newSession.title || !newSession.subject || !newSession.day || !newSession.startTime || !newSession.endTime) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const session = {
      ...newSession,
      id: Date.now().toString()
    };

    setStudySessions([...studySessions, session]);
    setNewSession({
      title: '',
      subject: '',
      day: '',
      startTime: '',
      endTime: '',
    });
    toast.success('Session d\'étude ajoutée !');
  };

  const handleRemoveSession = (id: string) => {
    setStudySessions(studySessions.filter(session => session.id !== id));
    toast.info('Session d\'étude supprimée');
  };

  const handleSavePlanner = () => {
    // In a real app, this would save to backend
    localStorage.setItem('studyPlanner', JSON.stringify(studySessions));
    toast.success('Planificateur enregistré avec succès !');
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Planificateur d'études</h1>
            <p className="text-gray-500">Créez et gérez votre emploi du temps d'études personnalisé</p>
          </div>
          <Button onClick={handleSavePlanner} className="mt-4 md:mt-0 flex items-center gap-2">
            <Save size={16} />
            Enregistrer mon planning
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Add new session */}
          <Card>
            <CardHeader>
              <CardTitle>Nouvelle session d'étude</CardTitle>
              <CardDescription>Ajoutez une nouvelle période d'étude à votre planning</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Titre</label>
                <Input 
                  placeholder="Ex: Révisions d'anatomie" 
                  value={newSession.title}
                  onChange={(e) => setNewSession({...newSession, title: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Matière</label>
                <Input 
                  placeholder="Ex: Anatomie" 
                  value={newSession.subject}
                  onChange={(e) => setNewSession({...newSession, subject: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Jour</label>
                <Select 
                  value={newSession.day} 
                  onValueChange={(value) => setNewSession({...newSession, day: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un jour" />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Heure de début</label>
                  <Input
                    type="time"
                    value={newSession.startTime}
                    onChange={(e) => setNewSession({...newSession, startTime: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Heure de fin</label>
                  <Input
                    type="time"
                    value={newSession.endTime}
                    onChange={(e) => setNewSession({...newSession, endTime: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleAddSession} className="w-full flex items-center gap-2">
                <Plus size={16} />
                Ajouter cette session
              </Button>
            </CardFooter>
          </Card>

          {/* Right columns: Weekly schedule */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Mon planning hebdomadaire</CardTitle>
              <CardDescription>Vue d'ensemble de vos sessions d'étude</CardDescription>
            </CardHeader>
            <CardContent>
              {days.map((day) => (
                <div key={day} className="mb-4">
                  <h3 className="font-medium text-lg mb-2">{day}</h3>
                  <div className="space-y-2">
                    {studySessions.filter(session => session.day === day).length > 0 ? (
                      studySessions
                        .filter(session => session.day === day)
                        .sort((a, b) => a.startTime.localeCompare(b.startTime))
                        .map((session) => (
                          <div 
                            key={session.id} 
                            className="bg-gray-50 p-3 rounded-md border border-gray-200 flex justify-between items-center"
                          >
                            <div>
                              <div className="font-medium">{session.title}</div>
                              <div className="text-sm text-gray-500">{session.subject}</div>
                              <div className="text-xs flex items-center gap-1 text-gray-400">
                                <Clock size={12} />
                                {session.startTime} - {session.endTime}
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-red-500 hover:bg-red-50 hover:text-red-600"
                              onClick={() => handleRemoveSession(session.id)}
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        ))
                    ) : (
                      <div className="text-gray-400 text-sm italic">Aucune session programmée</div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudyPlanner;
