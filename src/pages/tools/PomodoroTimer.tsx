
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

const PomodoroTimer: React.FC = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          // Timer finished
          setIsActive(false);
          if (mode === 'work') {
            setMode('break');
            setMinutes(breakTime);
          } else {
            setMode('work');
            setMinutes(workTime);
          }
          setSeconds(0);
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval!);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds, mode, workTime, breakTime]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
    if (mode === 'work') {
      setMinutes(workTime);
    } else {
      setMinutes(breakTime);
    }
  };

  const totalSeconds = mode === 'work' ? workTime * 60 : breakTime * 60;
  const currentSeconds = minutes * 60 + seconds;
  const progress = ((totalSeconds - currentSeconds) / totalSeconds) * 100;

  return (
    <MainLayout requireAuth={true}>
      <div className="container mx-auto py-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Timer className="h-8 w-8 text-medical-blue" />
          <div>
            <h1 className="text-2xl font-bold">Timer Pomodoro</h1>
            <p className="text-gray-500">Utilisez la technique Pomodoro pour maximiser votre concentration</p>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader className="text-center">
            <CardTitle className={`text-2xl ${mode === 'work' ? 'text-medical-blue' : 'text-medical-green'}`}>
              {mode === 'work' ? 'Temps de travail' : 'Pause'}
            </CardTitle>
            <CardDescription>
              {mode === 'work' ? 'Concentrez-vous sur votre tâche' : 'Prenez une pause bien méritée'}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-6xl font-mono font-bold mb-6 text-medical-navy">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            
            <Progress value={progress} className="mb-6" />
            
            <div className="flex justify-center gap-4 mb-6">
              <Button 
                onClick={toggleTimer}
                size="lg"
                className={mode === 'work' ? 'bg-medical-blue hover:bg-medical-blue/90' : 'bg-medical-green hover:bg-medical-green/90'}
              >
                {isActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                {isActive ? 'Pause' : 'Démarrer'}
              </Button>
              <Button onClick={resetTimer} variant="outline" size="lg">
                <RotateCcw className="mr-2 h-5 w-5" />
                Réinitialiser
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Paramètres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Temps de travail (minutes)</label>
                <input
                  type="number"
                  value={workTime}
                  onChange={(e) => setWorkTime(parseInt(e.target.value) || 25)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  min="1"
                  max="60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Temps de pause (minutes)</label>
                <input
                  type="number"
                  value={breakTime}
                  onChange={(e) => setBreakTime(parseInt(e.target.value) || 5)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  min="1"
                  max="30"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default PomodoroTimer;
