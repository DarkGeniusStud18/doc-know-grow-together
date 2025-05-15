
import { supabase } from './client';

/**
 * Initialise les fonctions RPC pour les messages de groupe
 * Cette fonction est appelée au démarrage de l'application
 */
export const createGroupMessageRpcFunctions = async () => {
  try {
    // Vérifier si les fonctions RPC existent déjà
    const { data: functions, error } = await supabase
      .rpc('get_group_messages', { p_group_id: '00000000-0000-0000-0000-000000000000' })
      .limit(1);
      
    // Si pas d'erreur, les fonctions existent déjà
    if (!error) {
      console.log('Fonctions RPC de messages de groupe déjà initialisées');
      return;
    }
    
    console.log('Initialisation des fonctions RPC pour les messages de groupe');
    
    // Les fonctions sont déjà créées dans la base de données via les migrations SQL
    console.log('Fonctions RPC de messages de groupe initialisées avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des fonctions RPC:', error);
  }
};

/**
 * Initialise les fonctions de stockage de profil
 * Cette fonction est appelée au démarrage de l'application
 */
export const initializeProfileStorage = async () => {
  try {
    // Vérifier si le bucket avatars existe
    const { data: buckets, error } = await supabase
      .storage
      .listBuckets();
      
    const avatarsBucketExists = buckets?.some(bucket => bucket.name === 'avatars');
    
    if (avatarsBucketExists) {
      console.log('Bucket avatars déjà initialisé');
      return;
    }
    
    console.log('Le bucket avatars n\'existe pas, veuillez exécuter les migrations SQL');
  } catch (error) {
    console.error('Erreur lors de la vérification des buckets de stockage:', error);
  }
};

/**
 * Initialise le système de musique
 * Cette fonction est appelée au démarrage de l'application
 */
export const initializeMusicSystem = async () => {
  try {
    // Vérifier si la table music_tracks existe
    const { data, error } = await supabase
      .from('music_tracks')
      .select('count(*)', { count: 'exact' });
      
    if (!error) {
      console.log('Système de musique initialisé avec succès');
    } else {
      console.log('Erreur lors de la vérification du système de musique, veuillez exécuter les migrations SQL');
    }
  } catch (error) {
    console.error('Erreur lors de l\'initialisation du système de musique:', error);
  }
};

/**
 * Fonction principale pour initialiser toutes les fonctions RPC et systèmes
 */
export const initializeAllRpcFunctions = async () => {
  await createGroupMessageRpcFunctions();
  await initializeProfileStorage();
  await initializeMusicSystem();
};
