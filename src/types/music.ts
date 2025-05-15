
/**
 * music.ts
 * 
 * Définition des types pour la bibliothèque musicale
 * Contient les types pour les pistes et les catégories musicales
 */

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  coverImage: string;
  audioUrl: string;
  duration: string;
  bpm?: number;
  tags: string[];
}

export interface MusicCategory {
  id: string;
  name: string;
  description: string;
  tracks: MusicTrack[];
}
