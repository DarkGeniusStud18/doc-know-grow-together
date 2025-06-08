
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, Pause, Square, Clock } from 'lucide-react';
import { useStudySessions } from '@/hooks/useStudySessions';

const StudyTimer: React.FC = () => {
  const { sessions, stats, startSession, endSession, addNote } = useStudySessions();
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [subject, setSubject] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = async () => {
    if (!currentSession) {
      const session = await startSession(subject || undefined);
      setCurrentSession(session);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = async () => {
    if (currentSession && time > 0) {
      const durationMinutes = Math.floor(time / 60);
      await endSession(currentSession.id, durationMinutes);
      
      if (note.trim()) {
        await addNote(currentSession.id, note);
      }
    }
    
    setIsRunning(false);
    setTime(0);
    setCurrentSession(null);
    setSubject('');
    setNote('');
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center">Minuteur d'étude</h1>
        
        {/* Timer Display */}
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="text-6xl font-mono font-bold text-medical-teal mb-6">
              {formatTime(time)}
            </div>
            
            {!currentSession && (
              <div className="mb-4">
                <Input
                  placeholder="Matière d'étude (optionnel)"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mb-4"
                />
              </div>
            )}
            
            <div className="flex justify-center gap-2">
              {!isRunning ? (
                <Button onClick={handleStart} size="lg" className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  {currentSession ? 'Reprendre' : 'Démarrer'}
                </Button>
              ) : (
                <Button onClick={handlePause} variant="outline" size="lg" className="flex items-center gap-2">
                  <Pause className="h-5 w-5" />
                  Pause
                </Button>
              )}
              
              {currentSession && (
                <Button onClick={handleStop} variant="destructive" size="lg" className="flex items-center gap-2">
                  <Square className="h-5 w-5" />
                  Arrêter
                </Button>
              )}
            </div>
            
            {currentSession && (
              <div className="mt-4">
                <Input
                  placeholder="Note de session (optionnelle)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-medical-teal mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.total_hours}h</div>
              <div className="text-sm text-gray-600">Total cette semaine</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stats.avg_session_duration}min</div>
              <div className="text-sm text-gray-600">Durée moyenne</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stats.sessions_count}</div>
              <div className="text-sm text-gray-600">Sessions</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-lg font-semibold truncate">{stats.most_studied_subject}</div>
              <div className="text-sm text-gray-600">Matière principale</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Sessions récentes</CardTitle>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Aucune session d'étude pour le moment.</p>
            ) : (
              <div className="space-y-2">
                {sessions.slice(0, 5).map((session) => (
                  <div key={session.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">
                        {session.subject || 'Session d\'étude'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(session.started_at).toLocaleDateString('fr-FR')} - {session.duration_minutes} min
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${
                      session.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {session.completed ? 'Terminée' : 'En cours'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default StudyTimer;
