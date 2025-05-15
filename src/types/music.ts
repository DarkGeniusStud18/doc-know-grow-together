
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
  url: string;  // Changed from audioUrl to url to match actual usage
  duration?: string;  // Made optional as it's not always used
  bpm?: number;
  tags?: string[];  // Made optional as it's not always used
  category?: string; // Added category property
}

export interface MusicCategory {
  id: string;
  name: string;
  description: string;
  tracks: MusicTrack[];
}
