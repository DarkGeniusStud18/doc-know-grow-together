
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User } from '@/lib/auth/types';
import { supabase } from '@/integrations/supabase/client';

export const convertToCustomUser = async (supabaseUser: SupabaseUser): Promise<User | null> => {
  try {
    console.log('Converting supabase user to custom user:', supabaseUser.id);
    
    // First try to get existing profile
    let { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching profile:', error);
      return null;
    }

    // If no profile exists, create one with retry logic
    if (!profile) {
      console.log('No profile found, creating new profile...');
      
      const profileData = {
        id: supabaseUser.id,
        display_name: supabaseUser.user_metadata?.display_name || 
                     supabaseUser.user_metadata?.name || 
                     supabaseUser.email?.split('@')[0] || 
                     'User',
        email: supabaseUser.email,
        role: (supabaseUser.user_metadata?.role as any) || 'student',
        kyc_status: 'not_submitted' as const,
        subscription_status: 'free' as const,
        university: supabaseUser.user_metadata?.university || null,
        specialty: supabaseUser.user_metadata?.specialty || null,
      };

      // Try to insert the profile with upsert to handle race conditions
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .upsert(profileData, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating profile:', insertError);
        
        // If upsert failed, try one more time to fetch existing profile
        const { data: existingProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', supabaseUser.id)
          .maybeSingle();

        if (fetchError || !existingProfile) {
          console.error('Failed to create or fetch profile after retry:', fetchError);
          return null;
        }
        
        profile = existingProfile;
      } else {
        profile = newProfile;
      }
    }

    if (!profile) {
      console.error('No profile available after conversion process');
      return null;
    }

    console.log('Profile converted successfully:', profile);

    return {
      id: profile.id,
      email: profile.email || supabaseUser.email || '',
      displayName: profile.display_name,
      role: profile.role,
      kycStatus: profile.kyc_status,
      subscriptionStatus: profile.subscription_status,
      subscriptionExpiry: profile.subscription_expiry ? new Date(profile.subscription_expiry) : null,
      university: profile.university,
      specialty: profile.specialty,
      profileImage: profile.profile_image,
      createdAt: new Date(profile.created_at),
      updatedAt: new Date(profile.updated_at),
    };
  } catch (error) {
    console.error('Unexpected error in convertToCustomUser:', error);
    return null;
  }
};
