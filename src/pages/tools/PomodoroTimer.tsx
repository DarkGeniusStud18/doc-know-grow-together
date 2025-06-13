
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';

const PomodoroTimer: React.FC = () => {
  const { user } = useAuth();
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);
  const [sessionsUntilLongBreak, setSessionsUntilLongBreak] = useState(4);
  const [sessionCount, setSessionCount] = useState(0);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [settingsChanged, setSettingsChanged] = useState(false);

  // Load user settings from Supabase
  useEffect(() => {
    if (user) {
      loadUserSettings();
    }
  }, [user]);

  const loadUserSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('pomodoro_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading settings:', error);
        return;
      }

      if (data) {
        setWorkTime(data.work_duration);
        setBreakTime(data.short_break_duration);
        setLongBreakTime(data.long_break_duration);
        setSessionsUntilLongBreak(data.sessions_until_long_break);
        setMinutes(data.work_duration);
        setSettingsChanged(false);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveUserSettings = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('pomodoro_settings')
        .upsert({
          user_id: user.id,
          work_duration: workTime,
          short_break_duration: breakTime,
          long_break_duration: longBreakTime,
          sessions_until_long_break: sessionsUntilLongBreak,
        });

      if (error) {
        console.error('Error saving settings:', error);
        toast.error('Erreur lors de la sauvegarde des paramètres');
      } else {
        setSettingsChanged(false);
        toast.success('Paramètres sauvegardés !');
        // Update current timer if not running
        if (!isActive && !currentSessionId) {
          setMinutes(mode === 'work' ? workTime : breakTime);
          setSeconds(0);
        }
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Erreur lors de la sauvegarde des paramètres');
    }
  };

  // Mark settings as changed when user modifies them
  const handleWorkTimeChange = (value: number[]) => {
    setWorkTime(value[0]);
    setSettingsChanged(true);
  };

  const handleBreakTimeChange = (value: number[]) => {
    setBreakTime(value[0]);
    setSettingsChanged(true);
  };

  const handleLongBreakTimeChange = (value: number[]) => {
    setLongBreakTime(value[0]);
    setSettingsChanged(true);
  };

  const handleSessionsChange = (value: number[]) => {
    setSessionsUntilLongBreak(value[0]);
    setSettingsChanged(true);
  };

  const startSession = async () => {
    if (!user) return;

    const sessionType = mode === 'work' ? 'work' : 
                       (sessionCount + 1) % sessionsUntilLongBreak === 0 ? 'long_break' : 'short_break';
    
    const duration = mode === 'work' ? workTime : 
                    sessionType === 'long_break' ? longBreakTime : breakTime;

    try {
      const { data, error } = await supabase
        .from('pomodoro_sessions')
        .insert({
          user_id: user.id,
          session_type: sessionType,
          duration_minutes: duration,
        })
        .select()
        .single();

      if (error) {
        console.error('Error starting session:', error);
        toast.error('Erreur lors du démarrage de la session');
        return;
      }

      setCurrentSessionId(data.id);
      setIsActive(true);
      toast.success('Session démarrée !');
    } catch (error) {
      console.error('Error starting session:', error);
      toast.error('Erreur lors du démarrage de la session');
    }
  };

  const completeSession = async () => {
    if (!user || !currentSessionId) return;

    try {
      const { error } = await supabase
        .from('pomodoro_sessions')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq('id', currentSessionId);

      if (error) {
        console.error('Error completing session:', error);
      } else {
        if (mode === 'work') {
          setSessionCount(prev => prev + 1);
          setMode('break');
          const isLongBreak = (sessionCount + 1) % sessionsUntilLongBreak === 0;
          setMinutes(isLongBreak ? longBreakTime : breakTime);
          toast.success(isLongBreak ? 'Longue pause !' : 'Pause !');
        } else {
          setMode('work');
          setMinutes(workTime);
          toast.success('Retour au travail !');
        }
        setSeconds(0);
        setCurrentSessionId(null);
      }
    } catch (error) {
      console.error('Error completing session:', error);
    }
  };

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
          setIsActive(false);
          completeSession();
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval!);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds]);

  const toggleTimer = () => {
    if (!isActive && !currentSessionId) {
      startSession();
    } else {
      setIsActive(!isActive);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
    setCurrentSessionId(null);
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
              Session {sessionCount + 1} {mode === 'work' ? '- Concentrez-vous sur votre tâche' : '- Prenez une pause bien méritée'}
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
                disabled={settingsChanged && !currentSessionId}
              >
                {isActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                {isActive ? 'Pause' : 'Démarrer'}
              </Button>
              <Button onClick={resetTimer} variant="outline" size="lg">
                <RotateCcw className="mr-2 h-5 w-5" />
                Réinitialiser
              </Button>
            </div>

            {settingsChanged && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-yellow-800 text-sm">
                  Vous avez modifié les paramètres. Sauvegardez-les pour pouvoir démarrer une nouvelle session.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Paramètres
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Temps de travail: {workTime} min</label>
              <Slider
                value={[workTime]}
                onValueChange={handleWorkTimeChange}
                max={60}
                min={5}
                step={5}
                disabled={isActive || currentSessionId !== null}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Pause courte: {breakTime} min</label>
              <Slider
                value={[breakTime]}
                onValueChange={handleBreakTimeChange}
                max={15}
                min={1}
                step={1}
                disabled={isActive || currentSessionId !== null}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Pause longue: {longBreakTime} min</label>
              <Slider
                value={[longBreakTime]}
                onValueChange={handleLongBreakTimeChange}
                max={30}
                min={10}
                step={5}
                disabled={isActive || currentSessionId !== null}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sessions avant pause longue: {sessionsUntilLongBreak}</label>
              <Slider
                value={[sessionsUntilLongBreak]}
                onValueChange={handleSessionsChange}
                max={8}
                min={2}
                step={1}
                disabled={isActive || currentSessionId !== null}
              />
            </div>
            <Button 
              onClick={saveUserSettings} 
              className="w-full"
              disabled={!settingsChanged || isActive || currentSessionId !== null}
            >
              {settingsChanged ? 'Sauvegarder les paramètres' : 'Paramètres sauvegardés'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default PomodoroTimer;
