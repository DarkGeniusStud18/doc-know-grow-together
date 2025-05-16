
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Repeat, 
  RefreshCw 
} from 'lucide-react';
import { MusicTrack } from '@/types/music';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { PlaylistManager } from './PlaylistManager';

interface MusicPlayerControlsProps {
  track: MusicTrack;
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  showPlaylist?: boolean;
}

export const MusicPlayerControls: React.FC<MusicPlayerControlsProps> = ({
  track,
  isPlaying,
  onPlayPause,
  onPrevious,
  onNext,
  showPlaylist = false
}) => {
  const {
    progress,
    currentTime,
    duration,
    volume,
    isMuted,
    handleProgressChange,
    toggleMute,
    setVolume
  } = useAudioPlayer(track, isPlaying);
  
  const [isLooping, setIsLooping] = useState(false);
  
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Toggle loop state
  const toggleLoop = () => {
    const audioElement = document.querySelector('audio');
    if (audioElement) {
      audioElement.loop = !isLooping;
      setIsLooping(!isLooping);
    }
  };
  
  return (
    <div className="flex flex-col space-y-2 w-full">
      {/* Progress bar */}
      <div className="flex items-center space-x-2 text-xs text-gray-500">
        <span>{formatTime(currentTime)}</span>
        <div className="flex-grow">
          <Slider
            value={[progress]}
            max={100}
            step={0.1}
            onValueChange={(values) => handleProgressChange(values[0])}
            className="cursor-pointer"
          />
        </div>
        <span>{formatTime(duration)}</span>
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className={isLooping ? "text-medical-blue" : ""}
            onClick={toggleLoop}
            title={isLooping ? "Désactiver la répétition" : "Répéter la piste"}
          >
            {isLooping ? <RefreshCw size={18} /> : <Repeat size={18} />}
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          {onPrevious && (
            <Button variant="ghost" size="icon" onClick={onPrevious} className="h-8 w-8">
              <SkipBack size={18} />
            </Button>
          )}
          
          <Button 
            onClick={onPlayPause}
            variant="default"
            size="icon"
            className="bg-medical-blue hover:bg-medical-teal h-10 w-10"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </Button>
          
          {onNext && (
            <Button variant="ghost" size="icon" onClick={onNext} className="h-8 w-8">
              <SkipForward size={18} />
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          {showPlaylist && (
            <PlaylistManager currentTrack={track} />
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="h-8 w-8"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </Button>
          
          <div className="hidden sm:block w-20">
            <Slider
              value={[volume]}
              min={0}
              max={100}
              step={1}
              onValueChange={(values) => setVolume(values[0])}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
