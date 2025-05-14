
import { supabase } from '@/integrations/supabase/client';
import { EmailCheckResponse } from './types/validation-types';

export const checkEmail = async (email: string): Promise<EmailCheckResponse> => {
  try {
    // Check if the email exists in profiles
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email);
      
    return { data, error };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

// Update checkUserExists function to use the correct function name
export const checkUserExistsByEmail = async (email: string) => {
  const { data, error } = await checkEmail(email);
  if (error) throw error;
  return data && data.length > 0;
};
