
/**
 * Modèles TypeScript pour la gestion de la musique d'étude
 * 
 * Définit les interfaces et services pour la bibliothèque musicale,
 * les playlists et la synchronisation en temps réel
 */

import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Types de base pour les entités musicales
export type MusicTrack = Database['public']['Tables']['music_tracks']['Row'];
export type Playlist = Database['public']['Tables']['playlists']['Row'];
export type PlaylistTrack = Database['public']['Tables']['playlist_tracks']['Row'];

/**
 * Interface étendue pour les pistes musicales avec métadonnées
 * Enrichit les données de base avec des informations calculées
 */
export interface EnhancedMusicTrack extends MusicTrack {
  formatted_duration?: string; // Durée formatée (ex: "3:45")
  is_favorite?: boolean; // Statut favori de l'utilisateur
  play_count?: number; // Nombre de lectures
  last_played?: string; // Dernière écoute
}

/**
 * Interface pour les playlists avec informations étendues
 * Inclut les statistiques et métadonnées calculées
 */
export interface EnhancedPlaylist extends Playlist {
  track_count?: number; // Nombre de pistes
  total_duration?: number; // Durée totale en secondes
  formatted_duration?: string; // Durée formatée
  tracks?: EnhancedMusicTrack[]; // Pistes incluses
  is_collaborative?: boolean; // Playlist collaborative
}

/**
 * Interface pour les filtres de recherche musicale
 * Permet un filtrage avancé et une recherche optimisée
 */
export interface MusicFilters {
  category?: string;
  search?: string;
  duration_min?: number;
  duration_max?: number;
  artist?: string;
  is_favorite?: boolean;
  tags?: string[];
}

/**
 * Interface pour les paramètres de tri
 * Définit les options de tri disponibles
 */
export interface SortOptions {
  field: 'title' | 'artist' | 'duration' | 'created_at' | 'play_count';
  direction: 'asc' | 'desc';
}

/**
 * Récupère toutes les pistes musicales avec filtres optionnels
 */
export const getAllTracks = async (
  filters?: MusicFilters, 
  sort?: SortOptions
): Promise<EnhancedMusicTrack[]> => {
  try {
    let query = supabase
      .from('music_tracks')
      .select('*');

    // Application des filtres de recherche
    if (filters) {
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      
      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,artist.ilike.%${filters.search}%`
        );
      }
      
      if (filters.duration_min) {
        query = query.gte('duration', filters.duration_min);
      }
      
      if (filters.duration_max) {
        query = query.lte('duration', filters.duration_max);
      }
      
      if (filters.artist) {
        query = query.ilike('artist', `%${filters.artist}%`);
      }
    }

    // Application du tri
    if (sort) {
      query = query.order(sort.field, { ascending: sort.direction === 'asc' });
    } else {
      // Tri par défaut par titre
      query = query.order('title', { ascending: true });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erreur lors de la récupération des pistes:', error);
      throw error;
    }

    // Enrichissement des données avec métadonnées calculées
    return data?.map(track => enhanceTrackData(track)) || [];
  } catch (error) {
    console.error('Erreur dans getAllTracks:', error);
    throw new Error('Impossible de récupérer les pistes musicales');
  }
};

/**
 * Récupère les playlists de l'utilisateur
 */
export const getUserPlaylists = async (userId: string): Promise<{id: string, name: string}[]> => {
  try {
    const { data, error } = await supabase
      .from('playlists')
      .select('id, name')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des playlists:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erreur dans getUserPlaylists:', error);
    throw new Error('Impossible de récupérer les playlists');
  }
};

/**
 * Crée une nouvelle playlist
 */
export const createPlaylist = async (name: string, userId: string): Promise<{id: string, name: string} | null> => {
  try {
    const { data, error } = await supabase
      .from('playlists')
      .insert({
        user_id: userId,
        name,
        is_public: false
      })
      .select('id, name')
      .single();

    if (error) {
      console.error('Erreur lors de la création de la playlist:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erreur dans createPlaylist:', error);
    throw new Error('Impossible de créer la playlist');
  }
};

/**
 * Ajoute une piste à une playlist
 */
export const addTrackToPlaylist = async (
  playlistId: string,
  trackId: string,
  position: number
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('playlist_tracks')
      .insert({
        playlist_id: playlistId,
        track_id: trackId, // Correction: utiliser track_id au lieu de music_track_id
        position
      });

    if (error) {
      console.error('Erreur lors de l\'ajout de la piste:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Erreur dans addTrackToPlaylist:', error);
    return false;
  }
};

/**
 * Enrichit les données d'une piste avec des métadonnées calculées
 */
const enhanceTrackData = (track: MusicTrack): EnhancedMusicTrack => {
  return {
    ...track,
    formatted_duration: formatDuration(track.duration),
    is_favorite: false, // À déterminer depuis les préférences utilisateur
    play_count: 0, // À récupérer depuis les statistiques d'écoute
  };
};

/**
 * Formate une durée en secondes vers un format lisible
 */
const formatDuration = (duration: number | null): string => {
  if (!duration || duration <= 0) return '0:00';
  
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
