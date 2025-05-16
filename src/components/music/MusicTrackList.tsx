
import React from 'react';
import { MusicTrack as MusicTrackType } from '@/types/music';
import { MusicTrack } from './MusicTrack';

interface MusicTrackListProps {
  tracks: MusicTrackType[];
  currentTrackId?: string;
  isPlaying: boolean;
  onPlayTrack: (track: MusicTrackType) => void;
}

export const MusicTrackList: React.FC<MusicTrackListProps> = ({
  tracks,
  currentTrackId,
  isPlaying,
  onPlayTrack
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tracks.map(track => (
        <MusicTrack
          key={track.id}
          track={track}
          isPlaying={isPlaying && currentTrackId === track.id}
          onPlay={() => onPlayTrack(track)}
        />
      ))}
    </div>
  );
};
