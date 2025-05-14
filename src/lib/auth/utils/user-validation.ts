
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

// Check if user with given email exists in the database
export const checkUserExists = async (email: string): Promise<{ exists: boolean, error: PostgrestError | null }> => {
  try {
    // Use a simpler approach to avoid deep type instantiation
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();
      
    return { 
      exists: !!data,
      error 
    };
  } catch (err) {
    console.error("Error checking if user exists:", err);
    return { exists: false, error: null };
  }
};

// Additional utility functions can be added here
