
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/sonner';
import { Settings, Save } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface PomodoroSettingsData {
  work_duration: number;
  short_break_duration: number;
  long_break_duration: number;
  sessions_until_long_break: number;
  auto_start_breaks: boolean;
  auto_start_pomodoros: boolean;
  sound_enabled: boolean;
}

const PomodoroSettings: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [settings, setSettings] = useState<PomodoroSettingsData>({
    work_duration: 25,
    short_break_duration: 5,
    long_break_duration: 15,
    sessions_until_long_break: 4,
    auto_start_breaks: false,
    auto_start_pomodoros: false,
    sound_enabled: true,
  });

  const { data: userSettings, isLoading } = useQuery({
    queryKey: ['pomodoroSettings', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('pomodoro_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    },
    enabled: !!user,
  });

  const saveSettingsMutation = useMutation({
    mutationFn: async (newSettings: PomodoroSettingsData) => {
      if (!user) throw new Error('User not authenticated');

      const { data: existingSettings } = await supabase
        .from('pomodoro_settings')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingSettings) {
        // Update existing settings
        const { error } = await supabase
          .from('pomodoro_settings')
          .update(newSettings)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Insert new settings
        const { error } = await supabase
          .from('pomodoro_settings')
          .insert({
            user_id: user.id,
            ...newSettings,
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success('Paramètres sauvegardés avec succès');
      queryClient.invalidateQueries({ queryKey: ['pomodoroSettings'] });
    },
    onError: (error) => {
      console.error('Error saving settings:', error);
      toast.error('Erreur lors de la sauvegarde des paramètres');
    },
  });

  useEffect(() => {
    if (userSettings) {
      setSettings({
        work_duration: userSettings.work_duration,
        short_break_duration: userSettings.short_break_duration,
        long_break_duration: userSettings.long_break_duration,
        sessions_until_long_break: userSettings.sessions_until_long_break,
        auto_start_breaks: userSettings.auto_start_breaks,
        auto_start_pomodoros: userSettings.auto_start_pomodoros,
        sound_enabled: userSettings.sound_enabled,
      });
    }
  }, [userSettings]);

  const handleSave = () => {
    if (settings.work_duration < 1 || settings.work_duration > 60) {
      toast.error('La durée de travail doit être entre 1 et 60 minutes');
      return;
    }
    if (settings.short_break_duration < 1 || settings.short_break_duration > 30) {
      toast.error('La pause courte doit être entre 1 et 30 minutes');
      return;
    }
    if (settings.long_break_duration < 1 || settings.long_break_duration > 60) {
      toast.error('La pause longue doit être entre 1 et 60 minutes');
      return;
    }
    if (settings.sessions_until_long_break < 2 || settings.sessions_until_long_break > 10) {
      toast.error('Le nombre de sessions avant pause longue doit être entre 2 et 10');
      return;
    }

    saveSettingsMutation.mutate(settings);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-teal"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Paramètres Pomodoro
        </CardTitle>
        <CardDescription>
          Personnalisez vos sessions de travail et pauses
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="workDuration">Durée de travail (minutes)</Label>
            <Input
              id="workDuration"
              type="number"
              min="1"
              max="60"
              value={settings.work_duration}
              onChange={(e) =>
                setSettings({ ...settings, work_duration: parseInt(e.target.value) || 25 })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shortBreak">Pause courte (minutes)</Label>
            <Input
              id="shortBreak"
              type="number"
              min="1"
              max="30"
              value={settings.short_break_duration}
              onChange={(e) =>
                setSettings({ ...settings, short_break_duration: parseInt(e.target.value) || 5 })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longBreak">Pause longue (minutes)</Label>
            <Input
              id="longBreak"
              type="number"
              min="1"
              max="60"
              value={settings.long_break_duration}
              onChange={(e) =>
                setSettings({ ...settings, long_break_duration: parseInt(e.target.value) || 15 })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sessionsCount">Sessions avant pause longue</Label>
            <Input
              id="sessionsCount"
              type="number"
              min="2"
              max="10"
              value={settings.sessions_until_long_break}
              onChange={(e) =>
                setSettings({ ...settings, sessions_until_long_break: parseInt(e.target.value) || 4 })
              }
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Démarrage automatique des pauses</Label>
              <p className="text-sm text-gray-500">
                Les pauses commencent automatiquement après une session de travail
              </p>
            </div>
            <Switch
              checked={settings.auto_start_breaks}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, auto_start_breaks: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Démarrage automatique des sessions</Label>
              <p className="text-sm text-gray-500">
                Les sessions de travail commencent automatiquement après une pause
              </p>
            </div>
            <Switch
              checked={settings.auto_start_pomodoros}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, auto_start_pomodoros: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notifications sonores</Label>
              <p className="text-sm text-gray-500">
                Jouer un son à la fin de chaque session
              </p>
            </div>
            <Switch
              checked={settings.sound_enabled}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, sound_enabled: checked })
              }
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={saveSettingsMutation.isPending}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saveSettingsMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PomodoroSettings;
