
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { getUserMusicPreferences, updateLastPlayedTrack } from '@/lib/utils/music-utils';
import { MusicTrack } from '@/types/music';

export const useMusicLibrary = () => {
  const { user } = useAuth();
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [loading, setLoading] = useState(true);
  
  // Charger les préférences de l'utilisateur au démarrage
  useEffect(() => {
    const loadUserPreferences = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const preferences = await getUserMusicPreferences(user.id);
        
        if (preferences) {
          // Pour le volume
          if (preferences.volume) {
            setVolume(preferences.volume);
          }
          
          // Pour la dernière piste jouée
          if (preferences.last_played_track) {
            const track = preferences.last_played_track as any;
            setCurrentTrack({
              id: track.id,
              title: track.title,
              artist: track.artist,
              category: track.category,
              url: track.file_url,
              coverImage: track.cover_image || ''
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
    
    // Écouter les événements de musique depuis d'autres onglets/composants
    const handleMusicEvent = (event: any) => {
      const { track, shouldPlay } = event.detail;
      if (track) {
        setCurrentTrack(track);
        setIsPlaying(shouldPlay !== undefined ? shouldPlay : true);
      }
    };
    
    window.addEventListener('music-play', handleMusicEvent);
    
    return () => {
      window.removeEventListener('music-play', handleMusicEvent);
    };
  }, [user]);
  
  // Mettre à jour les préférences de l'utilisateur lorsque la piste change
  useEffect(() => {
    if (user && currentTrack) {
      updateLastPlayedTrack(user.id, currentTrack.id, volume);
    }
  }, [currentTrack, user, volume]);
  
  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    
    // Envoyer un événement pour les autres composants qui écoutent
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
    if (user && currentTrack) {
      updateLastPlayedTrack(user.id, currentTrack.id, newVolume);
    }
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
