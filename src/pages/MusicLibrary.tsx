
/**
 * MusicLibrary.tsx
 * 
 * Bibliothèque musicale pour la concentration et les études
 * Cette page permet aux utilisateurs de découvrir et écouter différents types de musiques
 * adaptées pour améliorer la concentration pendant les études ou le travail
 */

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MusicTrack } from '@/components/music/MusicTrack';
import { MusicPlayer } from '@/components/music/MusicPlayer';
import { MusicCategory } from '@/types/music';
import { musicCategories } from '@/data/music-data';

const MusicLibrary = () => {
  // État pour suivre la piste en cours de lecture
  const [currentTrack, setCurrentTrack] = useState<MusicCategory['tracks'][0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Gestionnaire pour jouer une piste
  const handlePlayTrack = (track: MusicCategory['tracks'][0]) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    
    // Envoyer l'information à l'audio service pour la lecture persistante
    const musicEvent = new CustomEvent('music-play', { 
      detail: { track, shouldPlay: true } 
    });
    window.dispatchEvent(musicEvent);
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
        <Tabs defaultValue="lofi" className="w-full">
          <TabsList className="mb-8 flex flex-wrap gap-2">
            {musicCategories.map(category => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="px-4 py-2 text-sm"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {/* Contenu des onglets */}
          {musicCategories.map(category => (
            <TabsContent key={category.id} value={category.id} className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">{category.name}</h2>
                <p className="text-gray-600 mb-4">{category.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.tracks.map(track => (
                  <MusicTrack
                    key={track.id}
                    track={track}
                    isPlaying={isPlaying && currentTrack?.id === track.id}
                    onPlay={() => handlePlayTrack(track)}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      {/* Lecteur de musique flottant */}
      {currentTrack && (
        <MusicPlayer 
          track={currentTrack} 
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
        />
      )}
    </MainLayout>
  );
};

export default MusicLibrary;
