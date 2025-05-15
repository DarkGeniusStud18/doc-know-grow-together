
/**
 * MusicPlayer.tsx
 * 
 * Lecteur de musique persistant qui reste affiché lors de la navigation
 * Offre des contrôles pour jouer, pauser et naviguer entre les pistes
 */

import React, { useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { MusicCategory } from '@/types/music';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

interface MusicPlayerProps {
  track: MusicCategory['tracks'][0];
  isPlaying: boolean;
  onPlayPause: () => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  track, 
  isPlaying: externalIsPlaying, 
  onPlayPause 
}) => {
  // Utilise le hook personnalisé pour la gestion de l'audio
  const { 
    isPlaying,
    togglePlayPause,
    currentTime,
    duration,
    progress,
    volume,
    isMuted,
    toggleMute,
    setVolume,
    handleProgressChange,
    previousTrack,
    nextTrack
  } = useAudioPlayer(track, externalIsPlaying);

  // Formater le temps en minutes:secondes
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Si le lecteur externe change l'état de lecture, synchroniser
  useEffect(() => {
    if (isPlaying !== externalIsPlaying) {
      togglePlayPause();
    }
  }, [externalIsPlaying]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t shadow-lg px-4 py-3 z-50">
      <div className="container mx-auto flex flex-col sm:flex-row items-center gap-4">
        {/* Informations sur la piste */}
        <div className="flex items-center gap-3 min-w-[200px]">
          <div className="w-12 h-12 rounded-md overflow-hidden shrink-0">
            <img 
              src={track.coverImage} 
              alt={track.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="overflow-hidden">
            <h4 className="font-medium text-sm truncate">{track.title}</h4>
            <p className="text-xs text-gray-500 truncate">{track.artist}</p>
          </div>
        </div>
        
        {/* Contrôles de lecture */}
        <div className="flex-1 flex flex-col items-center gap-1 max-w-3xl w-full">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={previousTrack}
              title="Piste précédente"
            >
              <SkipBack size={18} />
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-9 w-9 rounded-full"
              onClick={() => {
                togglePlayPause();
                onPlayPause();
              }}
              title={isPlaying ? "Pause" : "Lecture"}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={nextTrack}
              title="Piste suivante"
            >
              <SkipForward size={18} />
            </Button>
          </div>
          
          {/* Barre de progression */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-gray-500 w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <Slider 
              value={[progress]} 
              max={100}
              step={1}
              className="flex-1" 
              onValueChange={(value) => handleProgressChange(value[0])}
            />
            <span className="text-xs text-gray-500 w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>
        
        {/* Contrôle du volume */}
        <div className="flex items-center gap-2 min-w-[120px]">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={toggleMute}
            title={isMuted ? "Activer le son" : "Couper le son"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </Button>
          <Slider 
            value={[volume]} 
            max={100}
            className="w-20" 
            onValueChange={(value) => setVolume(value[0])}
          />
        </div>
      </div>
    </div>
  );
};
