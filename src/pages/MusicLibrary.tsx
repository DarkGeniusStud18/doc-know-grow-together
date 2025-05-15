
/**
 * MusicLibrary.tsx
 * 
 * Bibliothèque musicale pour la concentration et les études
 * Cette page permet aux utilisateurs de découvrir et écouter différents types de musiques
 * adaptées pour améliorer la concentration pendant les études ou le travail
 */

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MusicTrack } from '@/components/music/MusicTrack';
import { MusicPlayer } from '@/components/music/MusicPlayer';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getAllMusicTracks } from '@/lib/utils/music-utils';
import { useMusicLibrary } from '@/hooks/useMusicLibrary';
import { MusicCategory as MusicCategoryType, MusicTrack as MusicTrackType } from '@/types/music';
import { BookOpen, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MusicLibrary = () => {
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = useMusicLibrary();
  
  // Utiliser React Query pour charger et mettre en cache les données musicales
  const { data: tracksByCategory, isLoading } = useQuery({
    queryKey: ['music-tracks'],
    queryFn: getAllMusicTracks,
  });
  
  const [categories, setCategories] = useState<string[]>([]);
  
  // Extraire les catégories une fois les données chargées
  useEffect(() => {
    if (tracksByCategory) {
      setCategories(Object.keys(tracksByCategory));
    }
  }, [tracksByCategory]);
  
  // Gérer la lecture d'une piste
  const handlePlayTrack = (track: MusicTrackType) => {
    playTrack(track);
  };

  return (
    <MainLayout>
      {/* Titre principal */}
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-8 text-medical-navy">
          Bibliothèque Musicale <span className="text-medical-blue">pour la Concentration</span>
        </h1>
        
        <p className="text-gray-600 mb-8">
          Explorez notre collection de musiques soigneusement sélectionnées pour améliorer votre concentration,
          productivité et bien-être pendant vos sessions d'étude ou de travail.
        </p>
        
        {/* Onglets des catégories musicales */}
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
            
            {/* Contenu des onglets */}
            {categories.map(category => (
              <TabsContent key={category} value={category} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">{category}</h2>
                  <p className="text-gray-600 mb-4">
                    {category === 'Lofi' && 'Beats relaxants parfaits pour étudier et se concentrer.'}
                    {category === 'Classique' && 'Musique classique pour stimuler votre concentration et productivité.'}
                    {category === 'Ambient' && 'Sons ambiants apaisants pour créer un environnement de travail serein.'}
                    {category === 'Nature' && 'Sons de la nature pour vous aider à vous détendre et à vous concentrer.'}
                    {category === 'Méditation' && 'Musique méditative pour calmer votre esprit avant ou pendant vos études.'}
                    {category === 'Instrumentale' && 'Mélodies instrumentales pour accompagner vos sessions de travail.'}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tracksByCategory && tracksByCategory[category]?.map((track: any) => (
                    <MusicTrack
                      key={track.id}
                      track={{
                        id: track.id,
                        title: track.title,
                        artist: track.artist,
                        url: track.file_url,
                        coverImage: track.cover_image
                      }}
                      isPlaying={isPlaying && currentTrack?.id === track.id}
                      onPlay={() => handlePlayTrack({
                        id: track.id,
                        title: track.title,
                        artist: track.artist,
                        url: track.file_url,
                        coverImage: track.cover_image
                      })}
                    />
                  ))}
                </div>
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
              <div className="flex justify-center gap-4">
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
      
      {/* Lecteur de musique flottant */}
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
