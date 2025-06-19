
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { hasData, hasError, isValidMusicPreferences } from '@/lib/utils/type-guards';

export const useMusicLibrary = () => {
  const { user } = useAuth();
  const [volume, setVolume] = useState(80);
  const [lastPlayedTrack, setLastPlayedTrack] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load user preferences
  useEffect(() => {
    if (!user) return;

    const loadPreferences = async () => {
      try {
        const response = await supabase
          .from('user_music_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (hasData(response) && isValidMusicPreferences(response.data)) {
          const preferences = response.data;
          if (typeof preferences.volume === 'number') {
            setVolume(preferences.volume);
          }
          if (preferences.last_played_track) {
            setLastPlayedTrack(preferences.last_played_track);
          }
        } else if (hasError(response)) {
          // Create default preferences if none exist
          if (response.error.code === 'PGRST116') {
            await supabase
              .from('user_music_preferences')
              .insert({
                user_id: user.id,
                volume: 80,
                last_played_track: null
              });
          } else {
            console.error('Error loading music preferences:', response.error);
          }
        }
      } catch (error) {
        console.error('Error loading music preferences:', error);
      }
    };

    loadPreferences();
  }, [user]);

  // Save preferences
  const savePreferences = async (newVolume?: number, newLastTrack?: string | null) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const updates: any = {};
      if (newVolume !== undefined) {
        updates.volume = newVolume;
        setVolume(newVolume);
      }
      if (newLastTrack !== undefined) {
        updates.last_played_track = newLastTrack;
        setLastPlayedTrack(newLastTrack);
      }

      const response = await supabase
        .from('user_music_preferences')
        .upsert({
          user_id: user.id,
          ...updates
        });

      if (hasError(response)) {
        console.error('Error saving music preferences:', response.error);
        throw response.error;
      }
    } catch (error) {
      console.error('Error saving music preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    volume,
    lastPlayedTrack,
    isLoading,
    saveVolume: (newVolume: number) => savePreferences(newVolume, undefined),
    saveLastPlayedTrack: (trackId: string | null) => savePreferences(undefined, trackId),
    savePreferences
  };
};
