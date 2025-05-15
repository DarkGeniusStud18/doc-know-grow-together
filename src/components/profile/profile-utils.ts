
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/lib/auth/types';
import { toast } from '@/components/ui/sonner';

/**
 * Uploads a profile image to Supabase Storage
 */
export const uploadProfileImage = async (file: File, user: User): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}-${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);
    
    if (uploadError) throw uploadError;

    // Get the public URL
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return data?.publicUrl || null;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    toast.error('Error uploading image');
    return null;
  }
};

/**
 * Updates user profile in Supabase
 */
export const updateUserProfile = async (
  userId: string,
  updates: { 
    display_name?: string; 
    university?: string | null; 
    specialty?: string | null;
    profile_image?: string | null;
  }
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating profile:', error);
    return false;
  }
};
