
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, Search, Heart, MoreHorizontal, PlusCircle, BookOpen } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/sonner';
import { useQuery } from '@tanstack/react-query';

// Mock data for now - will be replaced with actual hooks
const getTracksByCategory = async () => {
  // Mock implementation
  return {};
};

const CategoryHeader = ({ category }: { category: string }) => (
  <div className="mb-4">
    <h2 className="text-2xl font-semibold mb-2">{category}</h2>
    <p className="text-gray-600">
      Découvrez notre sélection de musiques pour {category.toLowerCase()}
    </p>
  </div>
);

const MusicTrackList = ({ tracks, currentTrackId, isPlaying, onPlayTrack }: {
  tracks: any[];
  currentTrackId?: string;
  isPlaying: boolean;
  onPlayTrack: (track: any) => void;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {tracks.map((track) => (
      <Card key={track.id} className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <h3 className="font-medium">{track.title}</h3>
          <p className="text-sm text-gray-500">{track.artist}</p>
          <Button
            size="sm"
            className="mt-2"
            onClick={() => onPlayTrack(track)}
          >
            {currentTrackId === track.id && isPlaying ? <Pause /> : <Play />}
            {currentTrackId === track.id && isPlaying ? 'Pause' : 'Jouer'}
          </Button>
        </CardContent>
      </Card>
    ))}
  </div>
);

const MusicPlayer = ({ track, isPlaying, onPlayPause }: {
  track: any;
  isPlaying: boolean;
  onPlayPause: () => void;
}) => (
  <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 border">
    <div className="flex items-center gap-3">
      <Button size="sm" onClick={onPlayPause}>
        {isPlaying ? <Pause /> : <Play />}
      </Button>
      <div>
        <p className="font-medium text-sm">{track.title}</p>
        <p className="text-xs text-gray-500">{track.artist}</p>
      </div>
    </div>
  </div>
);

const MusicLibrary = () => {
  // Mock player state for now
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const playTrack = (track: any) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Use React Query to load and cache music data
  const { data: tracksByCategory, isLoading, error } = useQuery({
    queryKey: ['music-tracks'],
    queryFn: getTracksByCategory,
  });

  const [categories, setCategories] = useState<string[]>([]);

  // Extract categories once data is loaded
  useEffect(() => {
    if (tracksByCategory) {
      setCategories(Object.keys(tracksByCategory));
    }
  }, [tracksByCategory]);

  // Handle any errors from data fetching
  useEffect(() => {
    if (error) {
      toast.error("Erreur de chargement", {
        description: "Impossible de charger la bibliothèque musicale"
      });
    }
  }, [error]);

  return (
    <MainLayout requireAuth={true}>
      <div className="container mx-auto px-4 py-6">
        {/* Main title */}
        <h1 className="text-3xl font-bold mb-8 text-medical-navy">
          Bibliothèque Musicale <span className="text-medical-blue">pour la Concentration</span>
        </h1>

        <p className="text-gray-600 mb-8">
          Explorez notre collection de musiques soigneusement sélectionnées pour améliorer votre concentration,
          productivité et bien-être pendant vos sessions d'étude ou de travail.
        </p>

        {/* Music categories tabs */}
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full max-w-md" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-40" />
              ))}
            </div>
          </div>
        ) : categories.length > 0 ? (
          <Tabs defaultValue={categories[0]} className="w-full">
            <TabsList className="mb-8 flex flex-wrap gap-2">
              {categories.map(category => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="px-4 py-2 text-sm"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Tab contents */}
            {categories.map(category => (
              <TabsContent key={category} value={category} className="space-y-6">
                <CategoryHeader category={category} />
                
                <MusicTrackList
                  tracks={tracksByCategory?.[category] || []}
                  currentTrackId={currentTrack?.id}
                  isPlaying={isPlaying}
                  onPlayTrack={playTrack}
                />
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">Pas encore de musique disponible</h3>
              <p className="text-gray-500 mb-6">
                La bibliothèque musicale sera bientôt disponible avec une sélection de pistes pour améliorer votre concentration.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Suggestion de musique
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  En savoir plus
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Floating music player */}
      {currentTrack && (
        <MusicPlayer
          track={currentTrack}
          isPlaying={isPlaying}
          onPlayPause={togglePlayPause}
        />
      )}
    </MainLayout>
  );
};

export default MusicLibrary;
