
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, PauseCircle, RotateCcw, Settings, Clock, History, Bell } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

enum TimerState {
  IDLE = 'idle',
  RUNNING = 'running',
  PAUSED = 'paused',
  BREAK = 'break',
}

interface TimerSession {
  startTime: Date;
  endTime?: Date;
  duration: number;
  type: 'focus' | 'break';
}

const StudyTimer: React.FC = () => {
  // Timer settings
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(4);

  // Timer state
  const [timerState, setTimerState] = useState<TimerState>(TimerState.IDLE);
  const [timeRemaining, setTimeRemaining] = useState(focusDuration * 60);
  const [activeSession, setActiveSession] = useState(1);
  const [isLongBreak, setIsLongBreak] = useState(false);
  const [history, setHistory] = useState<TimerSession[]>([]);
  const [currentSessionStartTime, setCurrentSessionStartTime] = useState<Date | null>(null);

  // Audio feedback
  const [muted, setMuted] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/notification.mp3'); // You'll need to add this sound file
  }, []);

  // Settings handling
  const [showSettings, setShowSettings] = useState(false);

  // Reset timer when focus duration changes while idle
  useEffect(() => {
    if (timerState === TimerState.IDLE) {
      setTimeRemaining(focusDuration * 60);
    }
  }, [focusDuration, timerState]);

  // Timer ticking logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (timerState === TimerState.RUNNING || timerState === TimerState.BREAK) {
      interval = setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime <= 1) {
            clearInterval(interval as NodeJS.Timeout);
            
            // Play sound notification if not muted
            if (!muted && audioRef.current) {
              audioRef.current.play().catch(err => console.error('Error playing audio:', err));
            }
            
            // Handle session completion
            if (timerState === TimerState.RUNNING) {
              // End focus session
              if (currentSessionStartTime) {
                const newSession: TimerSession = {
                  startTime: currentSessionStartTime,
                  endTime: new Date(),
                  duration: focusDuration * 60,
                  type: 'focus',
                };
                setHistory(prev => [...prev, newSession]);
              }
              
              // Determine if next break should be a long break
              const shouldBeLongBreak = activeSession % sessionsBeforeLongBreak === 0;
              const nextBreakDuration = shouldBeLongBreak ? longBreakDuration : breakDuration;
              
              setIsLongBreak(shouldBeLongBreak);
              setTimerState(TimerState.BREAK);
              setTimeRemaining(nextBreakDuration * 60);
              setCurrentSessionStartTime(new Date());
              toast.success(shouldBeLongBreak ? 'Longue pause commencée!' : 'Pause commencée!');
              
              return nextBreakDuration * 60;
            } else { // Break completed
              // End break session
              if (currentSessionStartTime) {
                const newSession: TimerSession = {
                  startTime: currentSessionStartTime,
                  endTime: new Date(),
                  duration: (isLongBreak ? longBreakDuration : breakDuration) * 60,
                  type: 'break',
                };
                setHistory(prev => [...prev, newSession]);
              }
              
              // Start next focus session
              setActiveSession(prev => prev + 1);
              setTimerState(TimerState.RUNNING);
              setTimeRemaining(focusDuration * 60);
              setCurrentSessionStartTime(new Date());
              toast.success('Nouvelle session de concentration commencée!');
              
              return focusDuration * 60;
            }
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerState, focusDuration, breakDuration, longBreakDuration, activeSession, sessionsBeforeLongBreak, isLongBreak, muted, currentSessionStartTime]);

  // Format time for display (mm:ss)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const getProgressPercentage = (): number => {
    const totalSeconds = timerState === TimerState.BREAK 
      ? (isLongBreak ? longBreakDuration : breakDuration) * 60 
      : focusDuration * 60;
    return 100 - (timeRemaining / totalSeconds) * 100;
  };

  // Handler functions for timer controls
  const startTimer = () => {
    if (timerState === TimerState.IDLE || timerState === TimerState.PAUSED) {
      setTimerState(TimerState.RUNNING);
      if (timerState === TimerState.IDLE) {
        setCurrentSessionStartTime(new Date());
      }
      toast.success('Session de concentration commencée !');
    }
  };

  const pauseTimer = () => {
    if (timerState === TimerState.RUNNING || timerState === TimerState.BREAK) {
      setTimerState(TimerState.PAUSED);
      toast.info('Minuteur en pause');
    }
  };

  const resetTimer = () => {
    setTimerState(TimerState.IDLE);
    setTimeRemaining(focusDuration * 60);
    setActiveSession(1);
    setIsLongBreak(false);
    setCurrentSessionStartTime(null);
    toast.info('Minuteur réinitialisé');
  };

  const toggleMute = () => {
    setMuted(!muted);
    toast.info(muted ? 'Son activé' : 'Son désactivé');
  };

  // Calculate statistics
  const getTotalFocusTime = (): number => {
    return history
      .filter(session => session.type === 'focus' && session.endTime)
      .reduce((total, session) => {
        const duration = session.endTime ? 
          Math.floor((session.endTime.getTime() - session.startTime.getTime()) / 1000) : 
          0;
        return total + duration;
      }, 0);
  };

  const formatTotalTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Chronomètre d'étude</h1>
            <p className="text-gray-500">Utilisez la technique Pomodoro pour maximiser votre concentration</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main timer */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-center">
                {timerState === TimerState.BREAK ? 
                  (isLongBreak ? 'Longue pause' : 'Pause courte') : 
                  'Session de concentration'}
              </CardTitle>
              <CardDescription className="text-center">
                Session {activeSession} {timerState === TimerState.BREAK ? '- Prenez une pause' : '- Restez concentré!'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative w-64 h-64 flex items-center justify-center mb-6">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle 
                    cx="50" cy="50" r="45" 
                    fill="none" 
                    stroke="#f3f4f6" 
                    strokeWidth="8"
                  />
                  <circle 
                    cx="50" cy="50" r="45" 
                    fill="none" 
                    stroke={timerState === TimerState.BREAK ? '#34d399' : '#3b82f6'} 
                    strokeWidth="8"
                    strokeDasharray="283"
                    strokeDashoffset={283 - (283 * getProgressPercentage() / 100)}
                    transform="rotate(-90 50 50)"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold mb-2">{formatTime(timeRemaining)}</span>
                  <span className="text-sm text-gray-500">
                    {timerState === TimerState.RUNNING ? 'Concentration' : 
                     timerState === TimerState.BREAK ? 'Pause' : 
                     timerState === TimerState.PAUSED ? 'En pause' : 'Prêt'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-8">
                {timerState === TimerState.RUNNING || timerState === TimerState.BREAK ? (
                  <Button 
                    onClick={pauseTimer}
                    size="lg"
                    className="bg-amber-500 hover:bg-amber-600 h-14 w-14 rounded-full p-0"
                  >
                    <PauseCircle size={28} />
                  </Button>
                ) : (
                  <Button 
                    onClick={startTimer}
                    size="lg"
                    className="bg-green-500 hover:bg-green-600 h-14 w-14 rounded-full p-0"
                  >
                    <PlayCircle size={28} />
                  </Button>
                )}
                
                <Button 
                  onClick={resetTimer}
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full"
                >
                  <RotateCcw size={20} />
                </Button>
                
                <Button 
                  onClick={toggleMute}
                  variant={muted ? "destructive" : "outline"}
                  size="icon"
                  className="h-12 w-12 rounded-full"
                >
                  <Bell size={20} />
                </Button>
                
                <Button 
                  onClick={() => setShowSettings(!showSettings)}
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full"
                >
                  <Settings size={20} />
                </Button>
              </div>

              {showSettings && (
                <Card className="w-full mb-4">
                  <CardHeader>
                    <CardTitle className="text-lg">Paramètres</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Durée de concentration: {focusDuration} min</span>
                      </div>
                      <Slider 
                        defaultValue={[focusDuration]} 
                        min={5} 
                        max={60} 
                        step={5} 
                        onValueChange={(value) => setFocusDuration(value[0])} 
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Durée de pause: {breakDuration} min</span>
                      </div>
                      <Slider 
                        defaultValue={[breakDuration]} 
                        min={1} 
                        max={15} 
                        step={1}
                        onValueChange={(value) => setBreakDuration(value[0])} 
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Durée de longue pause: {longBreakDuration} min</span>
                      </div>
                      <Slider 
                        defaultValue={[longBreakDuration]} 
                        min={5} 
                        max={30} 
                        step={5}
                        onValueChange={(value) => setLongBreakDuration(value[0])} 
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Sessions avant longue pause: {sessionsBeforeLongBreak}</span>
                      </div>
                      <Slider 
                        defaultValue={[sessionsBeforeLongBreak]} 
                        min={2} 
                        max={6} 
                        step={1}
                        onValueChange={(value) => setSessionsBeforeLongBreak(value[0])} 
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Stats and history */}
          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="stats">
                <TabsList className="grid grid-cols-2 w-full mb-4">
                  <TabsTrigger value="stats">Stats</TabsTrigger>
                  <TabsTrigger value="history">Historique</TabsTrigger>
                </TabsList>
                <TabsContent value="stats">
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <div className="text-sm text-gray-500 mb-1">Sessions complétées</div>
                      <div className="text-2xl font-bold">
                        {history.filter(session => session.type === 'focus' && session.endTime).length}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <div className="text-sm text-gray-500 mb-1">Temps total de concentration</div>
                      <div className="text-2xl font-bold">
                        {formatTotalTime(getTotalFocusTime())}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <div className="text-sm text-gray-500 mb-1">Session actuelle</div>
                      <div className="text-2xl font-bold">
                        {activeSession}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <div className="text-sm text-gray-500 mb-1">Prochaine longue pause</div>
                      <div className="text-2xl font-bold">
                        {sessionsBeforeLongBreak - (activeSession % sessionsBeforeLongBreak)} sessions
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="history" className="max-h-[400px] overflow-y-auto">
                  {history.length > 0 ? (
                    <div className="space-y-3">
                      {[...history].reverse().map((session, index) => (
                        <div 
                          key={index}
                          className={`p-3 rounded-lg border flex items-center gap-3 ${
                            session.type === 'focus' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'
                          }`}
                        >
                          <div className={`p-2 rounded-full ${
                            session.type === 'focus' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                          }`}>
                            {session.type === 'focus' ? <Clock size={16} /> : <Bell size={16} />}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">
                              {session.type === 'focus' ? 'Session de concentration' : 'Pause'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {session.startTime.toLocaleTimeString()} - {
                                session.endTime ? session.endTime.toLocaleTimeString() : 'En cours'
                              }
                            </div>
                          </div>
                          <div className="text-sm font-medium">
                            {session.endTime ? 
                              formatTime(Math.floor((session.endTime.getTime() - session.startTime.getTime()) / 1000)) :
                              '--:--'
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <History className="mx-auto h-12 w-12 text-gray-300" />
                      <h3 className="mt-2 text-lg font-medium">Aucun historique</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Commencez une session pour voir votre historique
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudyTimer;
