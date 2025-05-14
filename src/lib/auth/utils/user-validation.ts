
import { supabase } from '@/integrations/supabase/client';
import type { PostgrestError } from '@supabase/supabase-js';

// Check if user with given email exists in the database
export const checkUserExists = async (email: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();
      
    if (error) {
      console.error("Error checking if user exists:", error);
      return false;
    }
    
    return !!data;
  } catch (err) {
    console.error("Error checking if user exists:", err);
    return false;
  }
};

// Additional utility functions can be added here
