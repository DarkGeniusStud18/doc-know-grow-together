
/**
 * useAudioPlayer.ts
 * 
 * Hook personnalisé pour gérer la lecture audio avec persistance
 * Permet la lecture continue même lors de la navigation entre les pages
 */

import { useState, useEffect, useRef } from 'react';
import { MusicCategory } from '@/types/music';
import { toast } from 'sonner';

// Singleton pour l'élément audio partagé entre toutes les instances
let globalAudio: HTMLAudioElement | null = null;
let currentTrackId: string | null = null;

export const useAudioPlayer = (track: MusicCategory['tracks'][0], initialIsPlaying: boolean) => {
  const [isPlaying, setIsPlaying] = useState(initialIsPlaying);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(() => {
    // Récupérer le volume du localStorage ou utiliser 70 comme valeur par défaut
    const savedVolume = localStorage.getItem('music-volume');
    return savedVolume ? parseInt(savedVolume, 10) : 70;
  });
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialiser l'audio lors du premier rendu
  useEffect(() => {
    // Créer un élément audio global s'il n'existe pas encore
    if (!globalAudio) {
      globalAudio = new Audio();
      // Permettre la lecture continue
      globalAudio.loop = false;
    }
    
    audioRef.current = globalAudio;
    
    // Configuration initiale du volume
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
    
    // Nettoyer lors du démontage du composant
    return () => {
      // Ne pas détruire l'élément audio global lors du démontage
      // car nous voulons que la lecture continue entre les pages
    };
  }, []);
  
  // Mettre à jour la source audio et commencer la lecture si nécessaire
  useEffect(() => {
    if (audioRef.current) {
      // Si c'est une nouvelle piste, changer la source
      if (currentTrackId !== track.id) {
        audioRef.current.src = track.url;
        currentTrackId = track.id;
        
        // Montrer une notification toast
        toast.success(`Lecture de ${track.title}`, {
          description: `Par ${track.artist}`,
          duration: 3000,
        });
      }
      
      // Commencer ou mettre en pause la lecture selon l'état initial
      if (initialIsPlaying) {
        audioRef.current.play()
          .catch(error => {
            console.error('Erreur de lecture audio:', error);
            toast.error('Impossible de lire l\'audio. Veuillez réessayer.');
          });
      } else {
        audioRef.current.pause();
      }
      
      setIsPlaying(initialIsPlaying);
    }
  }, [track, initialIsPlaying]);
  
  // Mettre à jour le volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
      // Sauvegarder le volume dans localStorage
      localStorage.setItem('music-volume', volume.toString());
    }
  }, [volume, isMuted]);
  
  // Configurer les écouteurs d'événements audio
  useEffect(() => {
    const audio = audioRef.current;
    
    if (!audio) return;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      // Ici, vous pourriez implémenter une logique pour passer à la piste suivante
    };
    
    // Ajouter les écouteurs d'événements
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    
    // Nettoyer les écouteurs lors du démontage
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);
  
  // Implémenter la persistance via l'API de notification
  useEffect(() => {
    if (!('mediaSession' in navigator)) {
      return;
    }
    
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      album: track.album || 'MedCollab Music',
      artwork: [
        { src: track.coverImage, sizes: '512x512', type: 'image/png' }
      ]
    });
    
    navigator.mediaSession.setActionHandler('play', () => {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(console.error);
      }
    });
    
    navigator.mediaSession.setActionHandler('pause', () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    });
    
    navigator.mediaSession.setActionHandler('previoustrack', () => {
      previousTrack();
    });
    
    navigator.mediaSession.setActionHandler('nexttrack', () => {
      nextTrack();
    });
    
    // Certains handlers peuvent ne pas être supportés par tous les navigateurs
    try {
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (audioRef.current && details.seekTime) {
          audioRef.current.currentTime = details.seekTime;
        }
      });
    } catch (error) {
      console.warn('Le navigateur ne supporte pas l\'action "seekto".');
    }
    
    // Écouter les événements globaux pour la synchronisation entre les pages
    const handleGlobalPlay = (event: Event) => {
      const customEvent = event as CustomEvent;
      const newTrack = customEvent.detail?.track;
      const shouldPlay = customEvent.detail?.shouldPlay;
      
      if (newTrack && newTrack.id !== currentTrackId) {
        if (audioRef.current) {
          audioRef.current.src = newTrack.audioUrl;
          currentTrackId = newTrack.id;
          
          if (shouldPlay) {
            audioRef.current.play()
              .then(() => setIsPlaying(true))
              .catch(console.error);
          }
        }
      }
    };
    
    window.addEventListener('music-play', handleGlobalPlay);
    
    return () => {
      window.removeEventListener('music-play', handleGlobalPlay);
    };
  }, [track]);
  
  // Fonctions pour contrôler la lecture
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(error => {
          console.error('Erreur de lecture audio:', error);
          toast.error('Impossible de lire l\'audio. Veuillez réessayer.');
        });
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const handleProgressChange = (newProgress: number) => {
    if (!audioRef.current || !duration) return;
    
    const newTime = (newProgress / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(newProgress);
  };
  
  // Fonctions pour naviguer entre les pistes (à implémenter plus tard)
  const previousTrack = () => {
    // Sera implémenté avec la gestion de playlist
    toast.info('Piste précédente (fonctionnalité à venir)');
  };
  
  const nextTrack = () => {
    // Sera implémenté avec la gestion de playlist
    toast.info('Piste suivante (fonctionnalité à venir)');
  };
  
  return {
    isPlaying,
    togglePlayPause,
    currentTime,
    duration,
    progress,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    handleProgressChange,
    previousTrack,
    nextTrack
  };
};
