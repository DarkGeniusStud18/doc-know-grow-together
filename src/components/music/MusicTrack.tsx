
/**
 * MusicTrack.tsx
 * 
 * Composant pour afficher une piste musicale individuelle
 * Permet aux utilisateurs de voir les détails de la piste et de la jouer
 */

import React from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { MusicCategory } from '@/types/music';

interface MusicTrackProps {
  track: MusicCategory['tracks'][0];
  isPlaying: boolean;
  onPlay: () => void;
}

export const MusicTrack: React.FC<MusicTrackProps> = ({ 
  track, 
  isPlaying, 
  onPlay 
}) => {
  return (
    <Card className="overflow-hidden border transition-all hover:shadow-md">
      <div className="relative">
        <AspectRatio ratio={16/9}>
          <img 
            src={track.coverImage} 
            alt={track.title} 
            className="w-full h-full object-cover"
          />
        </AspectRatio>
        
        {/* Bouton de lecture superposé sur l'image */}
        <Button
          onClick={onPlay}
          variant="secondary"
          size="icon"
          className="absolute bottom-2 right-2 rounded-full bg-white/90 hover:bg-white text-medical-blue shadow-md"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </Button>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1">{track.title}</h3>
        <p className="text-gray-500 text-sm">{track.artist}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
            {track.duration}
          </span>
          <span className="text-xs text-gray-500">
            {track.bpm && `${track.bpm} BPM`}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
