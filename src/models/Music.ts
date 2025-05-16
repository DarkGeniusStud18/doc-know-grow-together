
import { supabase } from '@/integrations/supabase/client';
import { MusicTrack, MusicCategory } from '@/types/music';

export async function getAllTracks(): Promise<MusicTrack[]> {
  try {
    const { data, error } = await supabase
      .from('music_tracks')
      .select('*')
      .order('title');
    
    if (error) throw error;
    
    return data.map(track => ({
      id: track.id,
      title: track.title,
      artist: track.artist,
      url: track.file_url,
      coverImage: track.cover_image || '',
      duration: track.duration ? `${Math.floor(track.duration / 60)}:${String(track.duration % 60).padStart(2, '0')}` : undefined,
      category: track.category
    }));
  } catch (error) {
    console.error('Error fetching tracks:', error);
    return [];
  }
}

export async function getTracksByCategory(): Promise<Record<string, MusicTrack[]>> {
  try {
    const { data, error } = await supabase
      .from('music_tracks')
      .select('*')
      .order('title');
    
    if (error) throw error;
    
    const tracksByCategory: Record<string, MusicTrack[]> = {};
    data.forEach(track => {
      if (!tracksByCategory[track.category]) {
        tracksByCategory[track.category] = [];
      }
      
      tracksByCategory[track.category].push({
        id: track.id,
        title: track.title,
        artist: track.artist,
        url: track.file_url,
        coverImage: track.cover_image || '',
        duration: track.duration ? `${Math.floor(track.duration / 60)}:${String(track.duration % 60).padStart(2, '0')}` : undefined,
        category: track.category
      });
    });
    
    return tracksByCategory;
  } catch (error) {
    console.error('Error fetching tracks by category:', error);
    return {};
  }
}

export async function getTrackById(id: string): Promise<MusicTrack | null> {
  try {
    const { data, error } = await supabase
      .from('music_tracks')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    return {
      id: data.id,
      title: data.title,
      artist: data.artist,
      url: data.file_url,
      coverImage: data.cover_image || '',
      duration: data.duration ? `${Math.floor(data.duration / 60)}:${String(data.duration % 60).padStart(2, '0')}` : undefined,
      category: data.category
    };
  } catch (error) {
    console.error('Error fetching track:', error);
    return null;
  }
}

export async function createTrack(track: {
  title: string;
  artist: string;
  category: string;
  file_url: string;
  cover_image?: string;
  duration?: number;
}): Promise<MusicTrack | null> {
  try {
    const { data, error } = await supabase
      .from('music_tracks')
      .insert([track])
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      artist: data.artist,
      url: data.file_url,
      coverImage: data.cover_image || '',
      duration: data.duration ? `${Math.floor(data.duration / 60)}:${String(data.duration % 60).padStart(2, '0')}` : undefined,
      category: data.category
    };
  } catch (error) {
    console.error('Error creating track:', error);
    return null;
  }
}

export async function updateTrack(id: string, updates: Partial<{
  title: string;
  artist: string;
  category: string;
  file_url: string;
  cover_image?: string;
  duration?: number;
}>): Promise<MusicTrack | null> {
  try {
    const { data, error } = await supabase
      .from('music_tracks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      artist: data.artist,
      url: data.file_url,
      coverImage: data.cover_image || '',
      duration: data.duration ? `${Math.floor(data.duration / 60)}:${String(data.duration % 60).padStart(2, '0')}` : undefined,
      category: data.category
    };
  } catch (error) {
    console.error('Error updating track:', error);
    return null;
  }
}

export async function deleteTrack(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('music_tracks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting track:', error);
    return false;
  }
}

export async function createPlaylist(name: string, userId: string, isPublic: boolean = false): Promise<{ id: string, name: string } | null> {
  try {
    const { data, error } = await supabase
      .from('playlists')
      .insert([{ name, user_id: userId, is_public: isPublic }])
      .select()
      .single();
    
    if (error) throw error;
    
    return { id: data.id, name: data.name };
  } catch (error) {
    console.error('Error creating playlist:', error);
    return null;
  }
}

export async function getUserPlaylists(userId: string): Promise<{ id: string, name: string }[]> {
  try {
    const { data, error } = await supabase
      .from('playlists')
      .select('id, name')
      .eq('user_id', userId)
      .order('name');
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return [];
  }
}

export async function addTrackToPlaylist(playlistId: string, trackId: string, position: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('playlist_tracks')
      .insert([{ playlist_id: playlistId, track_id: trackId, position }]);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error adding track to playlist:', error);
    return false;
  }
}

export async function getPlaylistTracks(playlistId: string): Promise<MusicTrack[]> {
  try {
    const { data, error } = await supabase
      .from('playlist_tracks')
      .select('track_id, music_tracks(*)')
      .eq('playlist_id', playlistId)
      .order('position');
    
    if (error) throw error;
    
    return data.map(item => {
      const track = item.music_tracks;
      return {
        id: track.id,
        title: track.title,
        artist: track.artist,
        url: track.file_url,
        coverImage: track.cover_image || '',
        duration: track.duration ? `${Math.floor(track.duration / 60)}:${String(track.duration % 60).padStart(2, '0')}` : undefined,
        category: track.category
      };
    });
  } catch (error) {
    console.error('Error fetching playlist tracks:', error);
    return [];
  }
}
