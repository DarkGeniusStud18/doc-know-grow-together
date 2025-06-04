
import React, { useEffect, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSimpleMusicPlayer } from '@/hooks/useSimpleMusicPlayer';

/**
 * Composant de notification musicale flottante
 * Persiste même lorsqu'on navigue entre les pages
 */
const MusicNotification: React.FC = () => {
  const { currentTrack, isPlaying, volume, togglePlayPause, changeVolume } = useSimpleMusicPlayer();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!!currentTrack);
  }, [currentTrack]);

  if (!visible || !currentTrack) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 shadow-lg rounded-lg bg-background border p-3 w-72 animate-fade-in">
      <div className="flex items-center gap-3">
        {/* Image de couverture */}
        <div className="h-12 w-12 overflow-hidden rounded-md flex-shrink-0">
          <img 
            src={currentTrack.coverImage || '/placeholder.svg'} 
            alt={currentTrack.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Informations sur la piste */}
        <div className="flex-grow overflow-hidden">
          <p className="font-medium text-sm truncate">{currentTrack.title}</p>
          <p className="text-muted-foreground text-xs truncate">{currentTrack.artist}</p>
        </div>

        {/* Boutons de contrôle */}
        <div className="flex items-center">
          <Button 
            onClick={togglePlayPause} 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </Button>

          <Button
            onClick={() => setVisible(false)}
            variant="ghost"
            size="sm"
            className="text-xs"
          >
            Fermer
          </Button>
        </div>
      </div>

      {/* Volume slider */}
      <div className="flex items-center gap-2 mt-2">
        <Volume2 size={14} className="text-muted-foreground" />
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => changeVolume(Number(e.target.value))}
          className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
};

export default MusicNotification;
