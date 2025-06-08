
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const StudyTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  
  // Settings
  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished
      setIsActive(false);
      
      if (isBreak) {
        // Break finished, start work session
        setIsBreak(false);
        setTimeLeft(workDuration * 60);
        toast.success('Pause terminée ! Reprenez le travail.');
      } else {
        // Work session finished
        setSessions(prev => prev + 1);
        const isLongBreak = (sessions + 1) % 4 === 0;
        setIsBreak(true);
        setTimeLeft(isLongBreak ? longBreakDuration * 60 : shortBreakDuration * 60);
        toast.success(isLongBreak ? 'Session terminée ! Prenez une longue pause.' : 'Session terminée ! Prenez une courte pause.');
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, isBreak, sessions, workDuration, shortBreakDuration, longBreakDuration]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(workDuration * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const applySettings = () => {
    resetTimer();
    setShowSettings(false);
    toast.success('Paramètres sauvegardés !');
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Clock className="h-8 w-8 text-medical-red" />
              Chronomètre d'étude
            </h1>
            <p className="text-gray-600 mt-2">Technique Pomodoro pour maximiser votre concentration</p>
          </div>
          <Button variant="outline" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {showSettings && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Paramètres du timer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Travail (minutes)</label>
                      <input
                        type="number"
                        value={workDuration}
                        onChange={(e) => setWorkDuration(parseInt(e.target.value))}
                        min="1"
                        max="60"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Pause courte (minutes)</label>
                      <input
                        type="number"
                        value={shortBreakDuration}
                        onChange={(e) => setShortBreakDuration(parseInt(e.target.value))}
                        min="1"
                        max="30"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Pause longue (minutes)</label>
                      <input
                        type="number"
                        value={longBreakDuration}
                        onChange={(e) => setLongBreakDuration(parseInt(e.target.value))}
                        min="1"
                        max="60"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>
                  <Button onClick={applySettings} className="mt-4">
                    Appliquer les paramètres
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="text-center py-12">
                <div className={`text-8xl font-bold mb-8 ${
                  isBreak ? 'text-medical-green' : 'text-medical-red'
                }`}>
                  {formatTime(timeLeft)}
                </div>
                
                <div className={`text-2xl font-semibold mb-8 ${
                  isBreak ? 'text-medical-green' : 'text-medical-navy'
                }`}>
                  {isBreak ? 'Pause en cours' : 'Session de travail'}
                </div>
                
                <div className="flex justify-center gap-4">
                  <Button 
                    onClick={toggleTimer}
                    size="lg"
                    className={isBreak ? 'bg-medical-green hover:bg-medical-green/90' : ''}
                  >
                    {isActive ? (
                      <>
                        <Pause className="h-5 w-5 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5 mr-2" />
                        {timeLeft === (isBreak ? 
                          (sessions % 4 === 0 ? longBreakDuration : shortBreakDuration) * 60 : 
                          workDuration * 60) ? 'Démarrer' : 'Reprendre'}
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline" onClick={resetTimer} size="lg">
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Reset
                  </Button>
                </div>
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
                  <div className="text-center">
                    <div className="text-3xl font-bold text-medical-red">{sessions}</div>
                    <div className="text-sm text-gray-500">Sessions terminées</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Temps de travail</span>
                      <span>{sessions * workDuration} min</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Prochaine pause longue</span>
                      <span>Dans {4 - (sessions % 4)} session{4 - (sessions % 4) !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Comment ça marche ?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2">
                  <p>1. Travaillez pendant {workDuration} minutes</p>
                  <p>2. Prenez une pause de {shortBreakDuration} minutes</p>
                  <p>3. Répétez 4 fois</p>
                  <p>4. Prenez une longue pause de {longBreakDuration} minutes</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudyTimer;
