
import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

/**
 * Hook personnalisé pour la synchronisation en temps réel avec Supabase
 * Permet d'écouter les changements de données et de maintenir l'interface à jour
 * 
 * @param table - Nom de la table à surveiller
 * @param onUpdate - Fonction de callback appelée lors des mises à jour
 */
export const useRealtimeSync = (table: string, onUpdate: () => void) => {
  const { user } = useAuth();

  // Fonction memoized pour optimiser les performances
  const handleUpdate = useCallback(() => {
    console.log(`Realtime: Mise à jour détectée pour la table ${table}`);
    onUpdate();
  }, [onUpdate, table]);

  useEffect(() => {
    // Ne pas établir de connexion si l'utilisateur n'est pas connecté
    if (!user) {
      console.log('Realtime: Pas d\'utilisateur connecté, abandon de la synchronisation');
      return;
    }

    console.log(`Realtime: Établissement de la connexion pour la table ${table}`);

    // Création du canal de communication en temps réel
    const channel = supabase
      .channel(`${table}_changes_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Écouter tous les événements (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: table,
          filter: `user_id=eq.${user.id}` // Filtrer par utilisateur pour la sécurité
        },
        (payload) => {
          console.log(`Realtime: Changement détecté:`, payload);
          handleUpdate();
        }
      )
      .subscribe((status) => {
        console.log(`Realtime: Statut de la souscription pour ${table}:`, status);
      });

    // Fonction de nettoyage pour éviter les fuites mémoire
    return () => {
      console.log(`Realtime: Déconnexion du canal ${table}`);
      supabase.removeChannel(channel);
    };
  }, [user, table, handleUpdate]);
};
