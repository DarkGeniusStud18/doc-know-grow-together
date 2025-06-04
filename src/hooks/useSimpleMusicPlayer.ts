
import { useState } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  coverImage?: string;
}

export const useSimpleMusicPlayer = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const changeVolume = (newVolume: number) => {
    setVolume(newVolume);
  };

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const stopTrack = () => {
    setCurrentTrack(null);
    setIsPlaying(false);
  };

  return {
    currentTrack,
    isPlaying,
    volume,
    togglePlayPause,
    changeVolume,
    playTrack,
    stopTrack
  };
};
