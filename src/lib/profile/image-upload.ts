
/**
 * Profile image upload utilities
 */
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { User } from '@/lib/auth/types';

/**
 * Uploads a profile image to Supabase Storage
 */
export const uploadProfileImage = async (file: File, user: User): Promise<string | null> => {
  try {
    console.log('Début du téléchargement de l\'image de profil pour l\'utilisateur:', user.id);
    
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}-${Date.now()}.${fileExt}`;
    
    // Validation checks
    if (file.size > 2 * 1024 * 1024) {
      console.error('Fichier trop volumineux:', file.size);
      toast.error('Le fichier est trop volumineux (max 2MB)');
      return null;
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      console.error('Type de fichier non supporté:', file.type);
      toast.error('Format de fichier non supporté (JPG, PNG ou GIF uniquement)');
      return null;
    }
    
    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false
      });
    
    if (uploadError) {
      console.error('Erreur lors du téléchargement:', uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    console.log('Image téléchargée avec succès:', data?.publicUrl);
    return data?.publicUrl || null;
  } catch (error) {
    console.error('Erreur lors du téléchargement de l\'image de profil:', error);
    toast.error('Erreur lors du téléchargement de l\'image');
    return null;
  }
};
