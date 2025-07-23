/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipForward, SkipBack, Volume2, Heart, Shuffle, Repeat } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { useMusicLibrary } from '@/hooks/useMusicLibrary';

type MusicTrack = {
  id: string;
  title: string;
  artist: string;
  file_url: string;
  cover_image?: string;
  category?: string;
  duration?: number;
};

const MusicLibrary: React.FC = () => {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  
  const { volume, saveVolume, saveLastPlayedTrack } = useMusicLibrary();

  useEffect(() => {
    loadTracks();
  }, []);

  const loadTracks = async () => {
    try {
      const { data, error } = await supabase
        .from('music_tracks')
        .select('*')
        .order('title');

      if (error) throw error;

      // If no tracks exist, create some default ones
      if (!data || data.length === 0) {
        await createDefaultTracks();
        // Reload after creating defaults
        const { data: newData } = await supabase
          .from('music_tracks')
          .select('*')
          .order('title');
        setTracks(newData || []);
      } else {
        setTracks(data);
      }
    } catch (error) {
      console.error('Error loading tracks:', error);
      toast.error('Erreur lors du chargement de la bibliothèque musicale');
    } finally {
      setLoading(false);
    }
  };

  const createDefaultTracks = async () => {
    const defaultTracks = [
      {
        title: 'Deep Focus Flow',
        artist: 'Concentration Sounds',
        file_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        category: 'concentration',
        duration: 180,
        cover_image: '/images/focus-cover.jpg'
      },
      {
        title: 'Lo-Fi Study Beats',
        artist: 'Study Music',
        file_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        category: 'lofi',
        duration: 240,
        cover_image: '/images/lofi-cover.jpg'
      },
      {
        title: 'Ambient Concentration',
        artist: 'Mindful Sounds',
        file_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        category: 'ambient',
        duration: 300,
        cover_image: '/images/ambient-cover.jpg'
      },
      {
        title: 'Productivity Boost',
        artist: 'Work Music',
        file_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        category: 'concentration',
        duration: 220,
        cover_image: '/images/productivity-cover.jpg'
      },
      {
        title: 'Calm Study Session',
        artist: 'Relaxing Beats',
        file_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        category: 'lofi',
        duration: 280,
        cover_image: '/images/calm-cover.jpg'
      },
      {
        title: 'Forest Ambience',
        artist: 'Nature Sounds',
        file_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        category: 'ambient',
        duration: 360,
        cover_image: '/images/forest-cover.jpg'
      },
      {
        title: 'Evening Study Vibes',
        artist: 'Lo-Fi Collective',
        file_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        category: 'lofi',
        duration: 210,
        cover_image: '/images/evening-cover.jpg'
      },
      {
        title: 'Deep Work Zone',
        artist: 'Focus Music',
        file_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        category: 'concentration',
        duration: 320,
        cover_image: '/images/work-cover.jpg'
      }
    ];

    try {
      const { error } = await supabase
        .from('music_tracks')
        .insert(defaultTracks);

      if (error) throw error;
    } catch (error) {
      console.error('Error creating default tracks:', error);
    }
  };

  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    saveLastPlayedTrack(track.id);
    toast.success(`Lecture de ${track.title}`);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const categories = [
    { key: 'all', label: 'Tous', count: tracks.length },
    { key: 'lofi', label: 'Lo-Fi', count: tracks.filter(t => t.category === 'lofi').length },
    { key: 'concentration', label: 'Concentration', count: tracks.filter(t => t.category === 'concentration').length },
    { key: 'ambient', label: 'Ambiant', count: tracks.filter(t => t.category === 'ambient').length }
  ];

  const filteredTracks = activeCategory === 'all' 
    ? tracks 
    : tracks.filter(track => track.category === activeCategory);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-teal"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 mt-6 mx-auto max-w-4xl px-4">
        <div>
          <h1 className="text-3xl font-bold text-medical-navy">Bibliothèque musicale</h1>
          <p className="text-gray-500 mt-1">
            Musique pour la concentration, l'étude et la productivité
          </p>
        </div>

        <Tabs defaultValue="library" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="library">Bibliothèque</TabsTrigger>
            <TabsTrigger value="player">Lecteur</TabsTrigger>
          </TabsList>
          
          <TabsContent value="library" className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category.key}
                  variant={activeCategory === category.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category.key)}
                  className="gap-2"
                >
                  {category.label}
                  <Badge variant="secondary">{category.count}</Badge>
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTracks.map((track) => (
                <Card key={track.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gradient-to-br from-medical-teal to-medical-navy relative">
                    {track.cover_image ? (
                      <img 
                        src={track.cover_image} 
                        alt={track.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Volume2 className="h-12 w-12 text-white opacity-70" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button
                        size="lg"
                        className="rounded-full w-12 h-12 p-0"
                        onClick={() => playTrack(track)}
                      >
                        <Play className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium truncate">{track.title}</CardTitle>
                    <CardDescription className="text-xs">{track.artist}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {track.category}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {track.duration ? formatTime(track.duration) : '--:--'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="player" className="space-y-6 mt-6">
            <Card className="w-full max-w-md mx-auto">
              <CardHeader className="text-center">
                <div className="w-48 h-48 mx-auto bg-gradient-to-br from-medical-teal to-medical-navy rounded-lg flex items-center justify-center mb-4">
                  {currentTrack?.cover_image ? (
                    <img 
                      src={currentTrack.cover_image} 
                      alt={currentTrack.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Volume2 className="h-16 w-16 text-white opacity-70" />
                  )}
                </div>
                <CardTitle className="text-lg">
                  {currentTrack ? currentTrack.title : 'Aucune piste sélectionnée'}
                </CardTitle>
                <CardDescription>
                  {currentTrack ? currentTrack.artist : 'Choisissez une piste à écouter'}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <Slider
                    value={[currentTime]}
                    max={duration}
                    step={1}
                    className="w-full"
                    onValueChange={(value) => setCurrentTime(value[0])}
                  />
                </div>

                <div className="flex items-center justify-center space-x-4">
                  <Button variant="ghost" size="sm">
                    <Shuffle className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button size="lg" onClick={togglePlayPause} disabled={!currentTrack}>
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Repeat className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Volume2 className="h-4 w-4" />
                  <Slider
                    value={[volume]}
                    max={100}
                    step={1}
                    className="flex-1"
                    onValueChange={(value) => saveVolume(value[0])}
                  />
                  <span className="text-sm text-gray-500 w-8">{volume}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default MusicLibrary;
