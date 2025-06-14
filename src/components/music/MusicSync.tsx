
/**
 * Composant de synchronisation en temps réel pour les données musicales
 * 
 * Fonctionnalités avancées :
 * - Écoute des changements en temps réel via Supabase Realtime
 * - Invalidation automatique du cache React Query lors des modifications
 * - Notifications utilisateur pour les nouveaux contenus musicaux
 * - Gestion intelligente des événements personnalisés pour la mise à jour de l'UI
 * - Optimisation des performances avec gestion des abonnements
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Composant MusicSync - Configure les écouteurs en temps réel pour les données musicales
 * Fonctionne de manière invisible en arrière-plan pour maintenir la synchronisation
 * avec la base de données Supabase
 */
export const MusicSync: React.FC = () => {
  const { user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  // Configuration des écouteurs en temps réel Supabase
  useEffect(() => {
    // Vérification de la présence utilisateur et éviter la double initialisation
    if (!user || isInitialized) {
      console.log('MusicSync: Conditions non remplies pour l\'initialisation');
      return;
    }

    console.log('MusicSync: Initialisation des écouteurs en temps réel pour l\'utilisateur:', user.id);

    // Écouteur pour les modifications des pistes musicales
    const tracksChannel = supabase
      .channel('music-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Écoute tous les événements (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'music_tracks',
        },
        (payload) => {
          console.log('MusicSync: Changement détecté dans music_tracks:', payload.eventType);
          
          // Dispatch d'un événement personnalisé pour invalider le cache React Query
          window.dispatchEvent(new CustomEvent('music-data-changed', {
            detail: { type: 'tracks', data: payload }
          }));
          
          // Notification utilisateur pour les nouvelles pistes
          if (payload.eventType === 'INSERT') {
            const newTrack = payload.new as any;
            toast.info('Nouvelle piste musicale ajoutée', {
              description: `"${newTrack.title}" est maintenant disponible dans la bibliothèque`,
              duration: 4000,
            });
          }
        }
      )
      .subscribe((status) => {
        console.log('MusicSync: Statut de l\'abonnement music_tracks:', status);
      });
      
    // Écouteur pour les modifications des playlists utilisateur
    const playlistsChannel = supabase
      .channel('playlist-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'playlists',
          filter: user ? `user_id=eq.${user.id}` : undefined, // Filtrage par utilisateur
        },
        (payload) => {
          console.log('MusicSync: Changement détecté dans playlists pour l\'utilisateur:', payload.eventType);
          
          // Dispatch d'un événement pour invalider le cache des playlists
          window.dispatchEvent(new CustomEvent('music-data-changed', {
            detail: { type: 'playlists', data: payload }
          }));
          
          // Notifications pour les actions sur les playlists
          if (payload.eventType === 'INSERT') {
            const newPlaylist = payload.new as any;
            toast.success('Playlist créée', {
              description: `Votre playlist "${newPlaylist.name}" a été créée avec succès`,
              duration: 3000,
            });
          } else if (payload.eventType === 'DELETE') {
            toast.info('Playlist supprimée', {
              description: 'Une de vos playlists a été supprimée',
              duration: 3000,
            });
          }
        }
      )
      .subscribe((status) => {
        console.log('MusicSync: Statut de l\'abonnement playlists:', status);
      });

    // Écouteur pour les pistes de playlist (relations many-to-many)
    const playlistTracksChannel = supabase
      .channel('playlist-tracks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'playlist_tracks',
        },
        (payload) => {
          console.log('MusicSync: Changement détecté dans playlist_tracks:', payload.eventType);
          
          // Invalidation du cache pour les relations playlist-tracks
          window.dispatchEvent(new CustomEvent('music-data-changed', {
            detail: { type: 'playlist_tracks', data: payload }
          }));
        }
      )
      .subscribe();

    // Marquer comme initialisé
    setIsInitialized(true);
    console.log('MusicSync: Synchronisation musicale initialisée avec succès');

    // Fonction de nettoyage pour éviter les fuites mémoire
    return () => {
      console.log('MusicSync: Nettoyage des canaux de synchronisation musicale');
      supabase.removeChannel(tracksChannel);
      supabase.removeChannel(playlistsChannel);
      supabase.removeChannel(playlistTracksChannel);
      setIsInitialized(false);
    };
  }, [user, isInitialized]);

  // Composant invisible - aucun rendu UI nécessaire
  return null;
};
