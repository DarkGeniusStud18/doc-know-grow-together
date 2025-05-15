
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { User } from "@/lib/auth/types";

/**
 * Récupère les préférences musicales de l'utilisateur
 * @param userId ID de l'utilisateur connecté
 * @returns Les préférences musicales ou null si non trouvées
 */
export const getUserMusicPreferences = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_music_preferences')
      .select('*, last_played_track(id, title, artist, file_url, cover_image, category)')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des préférences musicales:", error);
    return null;
  }
};

/**
 * Met à jour la dernière piste écoutée et le volume pour l'utilisateur
 * @param userId ID de l'utilisateur
 * @param trackId ID de la piste
 * @param volume Volume (optionnel)
 */
export const updateLastPlayedTrack = async (userId: string, trackId: string, volume?: number) => {
  try {
    // Vérifier si l'utilisateur a déjà des préférences
    const { data } = await supabase
      .from('user_music_preferences')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
      
    const updateData: any = { last_played_track: trackId };
    if (volume !== undefined) updateData.volume = volume;
      
    if (data) {
      // Mettre à jour les préférences existantes
      await supabase
        .from('user_music_preferences')
        .update(updateData)
        .eq('user_id', userId);
    } else {
      // Créer de nouvelles préférences
      await supabase
        .from('user_music_preferences')
        .insert({
          user_id: userId,
          last_played_track: trackId,
          volume: volume || 80
        });
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la piste:", error);
  }
};

/**
 * Récupère toutes les pistes de musique par catégorie
 * @returns Liste des pistes groupées par catégorie
 */
export const getAllMusicTracks = async () => {
  try {
    const { data, error } = await supabase
      .from('music_tracks')
      .select('*')
      .order('created_at');
      
    if (error) throw error;
    
    // Grouper par catégorie
    const tracksByCategory: Record<string, any[]> = {};
    data?.forEach(track => {
      if (!tracksByCategory[track.category]) {
        tracksByCategory[track.category] = [];
      }
      tracksByCategory[track.category].push(track);
    });
    
    return tracksByCategory;
  } catch (error) {
    console.error("Erreur lors de la récupération des pistes:", error);
    toast.error("Impossible de charger la bibliothèque musicale");
    return {};
  }
};

/**
 * Crée une nouvelle playlist pour l'utilisateur
 * @param userId ID de l'utilisateur
 * @param name Nom de la playlist
 * @param isPublic Si la playlist est publique (par défaut: privée)
 */
export const createPlaylist = async (userId: string, name: string, isPublic = false) => {
  try {
    const { data, error } = await supabase
      .from('playlists')
      .insert({
        name,
        user_id: userId,
        is_public: isPublic
      })
      .select()
      .single();
      
    if (error) throw error;
    
    toast.success("Playlist créée avec succès");
    return data;
  } catch (error) {
    console.error("Erreur lors de la création de la playlist:", error);
    toast.error("Impossible de créer la playlist");
    return null;
  }
};

/**
 * Récupère les playlists de l'utilisateur
 * @param userId ID de l'utilisateur
 * @returns Liste des playlists de l'utilisateur
 */
export const getUserPlaylists = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('playlists')
      .select('*')
      .eq('user_id', userId)
      .order('created_at');
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des playlists:", error);
    return [];
  }
};

/**
 * Ajoute une piste à une playlist
 * @param playlistId ID de la playlist
 * @param trackId ID de la piste
 * @param position Position dans la playlist
 */
export const addTrackToPlaylist = async (playlistId: string, trackId: string, position: number) => {
  try {
    const { error } = await supabase
      .from('playlist_tracks')
      .insert({
        playlist_id: playlistId,
        track_id: trackId,
        position
      });
      
    if (error) throw error;
    
    toast.success("Piste ajoutée à la playlist");
    return true;
  } catch (error: any) {
    console.error("Erreur lors de l'ajout à la playlist:", error);
    
    // Vérifier si l'erreur est due à une violation de contrainte unique
    if (error.code === '23505') {
      toast.info("Cette piste est déjà dans la playlist");
    } else {
      toast.error("Impossible d'ajouter la piste à la playlist");
    }
    
    return false;
  }
};

/**
 * Récupère les pistes d'une playlist
 * @param playlistId ID de la playlist
 * @returns Liste des pistes de la playlist
 */
export const getPlaylistTracks = async (playlistId: string) => {
  try {
    const { data, error } = await supabase
      .from('playlist_tracks')
      .select('*, track:track_id(*)')
      .eq('playlist_id', playlistId)
      .order('position');
      
    if (error) throw error;
    
    // Transformer les données pour un format plus simple
    return data?.map(item => item.track) || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des pistes de la playlist:", error);
    return [];
  }
};
