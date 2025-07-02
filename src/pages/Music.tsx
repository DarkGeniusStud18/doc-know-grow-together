
/**
 * 🎵 Page Bibliothèque Musicale - Musique d'ambiance pour l'étude
 * Interface de lecture musicale optimisée pour la concentration
 */

import React, { useState, useRef, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX,
  Music, Headphones, Clock, Shuffle, Repeat, Heart
} from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  category: string;
  url: string;
  image: string;
  description: string;
}

const Music: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeated, setIsRepeated] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Playlists de musique d'ambiance pour l'étude
  const musicTracks: Track[] = [
    {
      id: '1',
      title: 'Concentration Focus',
      artist: 'Study Beats',
      duration: 180,
      category: 'lofi',
      url: '/audio/focus-1.mp3',
      image: '/images/music/lofi-1.jpg',
      description: 'Musique lo-fi apaisante pour la concentration'
    },
    {
      id: '2',
      title: 'Forest Ambience',
      artist: 'Nature Sounds',
      duration: 240,
      category: 'nature',
      url: '/audio/forest.mp3',
      image: '/images/music/nature-1.jpg',
      description: 'Sons de la forêt pour une atmosphère relaxante'
    },
    {
      id: '3',
      title: 'Classical Study',
      artist: 'Bach Collection',
      duration: 200,
      category: 'classical',
      url: '/audio/classical-1.mp3',
      image: '/images/music/classical-1.jpg',
      description: 'Musique classique pour stimuler la concentration'
    },
    {
      id: '4',
      title: 'Rain & Thunder',
      artist: 'Weather Sounds',
      duration: 300,
      category: 'nature',
      url: '/audio/rain.mp3',
      image: '/images/music/rain.jpg',
      description: 'Pluie douce et tonnerre lointain'
    },
    {
      id: '5',
      title: 'Productive Vibes',
      artist: 'Study Zone',
      duration: 165,
      category: 'ambient',
      url: '/audio/ambient-1.mp3',
      image: '/images/music/ambient-1.jpg',
      description: 'Musique ambiante pour la productivité'
    },
    {
      id: '6',
      title: 'Ocean Waves',
      artist: 'Coastal Sounds',
      duration: 220,
      category: 'nature',
      url: '/audio/ocean.mp3',
      image: '/images/music/ocean.jpg',
      description: 'Vagues océaniques relaxantes'
    }
  ];

  const categories = [
    { value: 'all', label: '🎵 Toutes', count: musicTracks.length },
    { value: 'lofi', label: '🎧 Lo-Fi', count: musicTracks.filter(t => t.category === 'lofi').length },
    { value: 'nature', label: '🌿 Nature', count: musicTracks.filter(t => t.category === 'nature').length },
    { value: 'classical', label: '🎼 Classique', count: musicTracks.filter(t => t.category === 'classical').length },
    { value: 'ambient', label: '🌌 Ambiant', count: musicTracks.filter(t => t.category === 'ambient').length }
  ];

  const filteredTracks = selectedCategory === 'all' 
    ? musicTracks 
    : musicTracks.filter(track => track.category === selectedCategory);

  /**
   * 🎵 Lecture d'une piste
   */
  const playTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
      togglePlayPause();
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      setCurrentTime(0);
      // Note: En production, vous devriez charger l'audio réel
      toast.success(`Lecture: ${track.title}`);
    }
  };

  /**
   * ⏯️ Basculer lecture/pause
   */
  const togglePlayPause = () => {
    if (!currentTrack) return;
    
    setIsPlaying(!isPlaying);
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  /**
   * ⏭️ Piste suivante
   */
  const nextTrack = () => {
    if (!currentTrack) return;
    
    const currentIndex = filteredTracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = isShuffled 
      ? Math.floor(Math.random() * filteredTracks.length)
      : (currentIndex + 1) % filteredTracks.length;
    
    playTrack(filteredTracks[nextIndex]);
  };

  /**
   * ⏮️ Piste précédente
   */
  const previousTrack = () => {
    if (!currentTrack) return;
    
    const currentIndex = filteredTracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = currentIndex === 0 
      ? filteredTracks.length - 1 
      : currentIndex - 1;
    
    playTrack(filteredTracks[prevIndex]);
  };

  /**
   * 🔊 Gestion du volume
   */
  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0];
    setVolume(vol);
    setIsMuted(vol === 0);
    
    if (audioRef.current) {
      audioRef.current.volume = vol / 100;
    }
  };

  /**
   * 🔇 Basculer muet
   */
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? volume / 100 : 0;
    }
  };

  /**
   * 📊 Formatage du temps
   */
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * 🎨 Couleur de catégorie
   */
  const getCategoryColor = (category: string) => {
    const colors = {
      lofi: 'bg-purple-100 text-purple-800',
      nature: 'bg-green-100 text-green-800',
      classical: 'bg-blue-100 text-blue-800',
      ambient: 'bg-orange-100 text-orange-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Simulation de progression temporelle
  useEffect(() => {
    if (isPlaying && currentTrack) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= currentTrack.duration) {
            if (isRepeated) {
              return 0;
            } else {
              nextTrack();
              return 0;
            }
          }
          return prev + 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, currentTrack, isRepeated]);

  return (
    <MainLayout requireAuth={true}>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-medical-navy flex items-center gap-3 mb-2">
            <Music className="h-8 w-8 text-medical-blue" />
            Bibliothèque Musicale
          </h1>
          <p className="text-gray-600">
            Musique d'ambiance et sons relaxants pour optimiser votre concentration
          </p>
        </div>

        {/* Lecteur principal */}
        {currentTrack && (
          <Card className="mb-8 bg-gradient-to-r from-medical-blue to-medical-teal text-white">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row items-center gap-6">
                {/* Informations de la piste */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                    <Music className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{currentTrack.title}</h3>
                    <p className="text-white/80">{currentTrack.artist}</p>
                    <Badge className="mt-1 bg-white/20 text-white">
                      {currentTrack.category}
                    </Badge>
                  </div>
                </div>

                {/* Contrôles de lecture */}
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsShuffled(!isShuffled)}
                      className={`text-white hover:bg-white/20 ${isShuffled ? 'bg-white/20' : ''}`}
                    >
                      <Shuffle className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={previousTrack}
                      className="text-white hover:bg-white/20"
                    >
                      <SkipBack className="h-5 w-5" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={togglePlayPause}
                      className="text-white hover:bg-white/20 w-12 h-12 rounded-full"
                    >
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={nextTrack}
                      className="text-white hover:bg-white/20"
                    >
                      <SkipForward className="h-5 w-5" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsRepeated(!isRepeated)}
                      className={`text-white hover:bg-white/20 ${isRepeated ? 'bg-white/20' : ''}`}
                    >
                      <Repeat className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Barre de progression */}
                  <div className="flex items-center gap-3 w-full max-w-md">
                    <span className="text-sm text-white/80 min-w-[40px]">
                      {formatTime(currentTime)}
                    </span>
                    <div className="flex-1 bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-white rounded-full h-2 transition-all duration-1000"
                        style={{ width: `${(currentTime / currentTrack.duration) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-white/80 min-w-[40px]">
                      {formatTime(currentTrack.duration)}
                    </span>
                  </div>
                </div>

                {/* Contrôles de volume */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <div className="w-24">
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      onValueChange={handleVolumeChange}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(category => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
              className="flex items-center gap-2"
            >
              {category.label}
              <Badge variant="secondary" className="text-xs">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Liste des pistes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTracks.map((track) => (
            <Card 
              key={track.id} 
              className={`hover:shadow-lg transition-all duration-200 cursor-pointer ${
                currentTrack?.id === track.id ? 'ring-2 ring-medical-blue' : ''
              }`}
              onClick={() => playTrack(track)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1 mb-1">
                      {track.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {track.artist}
                    </CardDescription>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={getCategoryColor(track.category)}>
                      {track.category}
                    </Badge>
                    {currentTrack?.id === track.id && isPlaying && (
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-4 bg-medical-blue rounded animate-pulse"></div>
                        <div className="w-1 h-3 bg-medical-blue rounded animate-pulse delay-75"></div>
                        <div className="w-1 h-5 bg-medical-blue rounded animate-pulse delay-150"></div>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {track.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(track.duration)}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        playTrack(track);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      {currentTrack?.id === track.id && isPlaying 
                        ? <Pause className="h-4 w-4" />
                        : <Play className="h-4 w-4" />
                      }
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success('Ajouté aux favoris');
                      }}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Message si aucune piste */}
        {filteredTracks.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Headphones className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Aucune piste trouvée
              </h3>
              <p className="text-gray-500">
                Essayez de sélectionner une autre catégorie
              </p>
            </CardContent>
          </Card>
        )}

        {/* Audio element caché */}
        <audio ref={audioRef} />
      </div>
    </MainLayout>
  );
};

export default Music;
