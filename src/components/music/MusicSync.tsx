
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * MusicSync component - Sets up real-time listeners for music data changes
 * Works invisibly in the background to keep music data in sync with Supabase
 */
export const MusicSync: React.FC = () => {
  const { user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  // Set up Supabase real-time listeners
  useEffect(() => {
    if (!user || isInitialized) return;

    // Get real-time updates when music tracks are changed
    const tracksChannel = supabase
      .channel('music-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'music_tracks',
        },
        (payload) => {
          // Invalidate React Query cache for music-tracks
          window.dispatchEvent(new CustomEvent('music-data-changed', {
            detail: { type: 'tracks', data: payload }
          }));
          
          if (payload.eventType === 'INSERT') {
            toast.info('Nouvelle piste musicale ajoutée', {
              description: `"${(payload.new as any).title}" est maintenant disponible`
            });
          }
        }
      )
      .subscribe();
      
    // Get real-time updates when playlists are changed
    const playlistsChannel = supabase
      .channel('playlist-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'playlists',
          filter: user ? `user_id=eq.${user.id}` : undefined,
        },
        (payload) => {
          // Invalidate React Query cache for playlists
          window.dispatchEvent(new CustomEvent('music-data-changed', {
            detail: { type: 'playlists', data: payload }
          }));
        }
      )
      .subscribe();

    setIsInitialized(true);

    return () => {
      supabase.removeChannel(tracksChannel);
      supabase.removeChannel(playlistsChannel);
    };
  }, [user, isInitialized]);

  // Nothing to render - this is a background service component
  return null;
};
