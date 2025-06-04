import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, Search, Heart, MoreHorizontal } from 'lucide-react';
import { useSimpleMusicPlayer } from '@/hooks/useSimpleMusicPlayer';
import { useMusicLibrary } from '@/hooks/useMusicLibrary';

const MusicLibrary = () => {
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = useSimpleMusicPlayer();
  const { volume, saveVolume } = useMusicLibrary();
  const [searchQuery, setSearchQuery] = useState('');

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
