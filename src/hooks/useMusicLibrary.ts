
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { MusicTrack } from '@/types/music';
import { toast } from 'sonner';

interface UserMusicPreferences {
  volume?: number;
  last_played_track?: {
    id: string;
    title: string;
    artist: string;
    file_url: string;
    cover_image?: string;
    category?: string;
  };
}

export const useMusicLibrary = () => {
  const { user } = useAuth();
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [loading, setLoading] = useState(true);
  
  // Load user preferences on startup
  useEffect(() => {
    const loadUserPreferences = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const { data: preferences, error } = await supabase
          .from('user_music_preferences')
          .select('*, last_played_track:music_tracks!last_played_track(*)')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (error) throw error;
        
        if (preferences) {
          // Set volume
          if (preferences.volume) {
            setVolume(preferences.volume);
          }
          
          // Set last played track
          if (preferences.last_played_track) {
            const track = preferences.last_played_track as any;
            setCurrentTrack({
              id: track.id,
              title: track.title,
              artist: track.artist,
              url: track.file_url,
              coverImage: track.cover_image || '',
              category: track.category
            });
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des préférences:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserPreferences();
    
    // Listen for music events from other tabs/components
    const handleMusicEvent = (event: CustomEvent<{ track: MusicTrack, shouldPlay?: boolean }>) => {
      const { track, shouldPlay } = event.detail;
      if (track) {
        setCurrentTrack(track);
        setIsPlaying(shouldPlay !== undefined ? shouldPlay : true);
      }
    };
    
    window.addEventListener('music-play', handleMusicEvent as EventListener);
    
    return () => {
      window.removeEventListener('music-play', handleMusicEvent as EventListener);
    };
  }, [user]);
  
  // Update user preferences when track changes
  useEffect(() => {
    const updatePreferences = async () => {
      if (user && currentTrack) {
        try {
          // Check if user has preferences
          const { data: existingPrefs, error: checkError } = await supabase
            .from('user_music_preferences')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (checkError) throw checkError;
          
          if (existingPrefs) {
            // Update existing preferences
            const { error: updateError } = await supabase
              .from('user_music_preferences')
              .update({
                last_played_track: currentTrack.id,
                volume,
                updated_at: new Date().toISOString()
              })
              .eq('user_id', user.id);
              
            if (updateError) throw updateError;
          } else {
            // Create new preferences
            const { error: insertError } = await supabase
              .from('user_music_preferences')
              .insert({
                user_id: user.id,
                last_played_track: currentTrack.id,
                volume: volume
              });
              
            if (insertError) throw insertError;
          }
        } catch (error) {
          console.error("Error updating user preferences:", error);
        }
      }
    };
    
    updatePreferences();
  }, [currentTrack, user, volume]);
  
  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    
    // Send an event for other components that are listening
    const musicEvent = new CustomEvent('music-play', { 
      detail: { track, shouldPlay: true } 
    });
    window.dispatchEvent(musicEvent);
  };
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    
    if (currentTrack) {
      const musicEvent = new CustomEvent('music-play', { 
        detail: { track: currentTrack, shouldPlay: !isPlaying } 
      });
      window.dispatchEvent(musicEvent);
    }
  };
  
  const changeVolume = (newVolume: number) => {
    setVolume(newVolume);
    // Volume preference is updated in the useEffect that watches currentTrack, user, and volume
  };
  
  return {
    currentTrack,
    isPlaying,
    volume,
    loading,
    playTrack,
    togglePlayPause,
    changeVolume,
    setCurrentTrack,
    setIsPlaying
  };
};

export default useMusicLibrary;
