
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/lib/auth/types';

export const convertToCustomUser = async (supabaseUser: any): Promise<User | null> => {
  if (!supabaseUser) return null;

  try {
    console.log('Converting user:', supabaseUser.id);
    
    // First, try to get existing profile
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
      return null;
    }

    if (!profileData) {
      console.log('Profile not found, creating new profile...');
      
      const displayName = supabaseUser.user_metadata?.display_name || 
                         supabaseUser.user_metadata?.name || 
                         supabaseUser.email?.split('@')[0] || 
                         'User';
      
      const role = supabaseUser.user_metadata?.role || 'student';
      
      // Use upsert to handle potential race conditions
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .upsert({
          id: supabaseUser.id,
          display_name: displayName,
          role: role,
          kyc_status: 'not_submitted',
          email: supabaseUser.email,
          subscription_status: 'free'
        }, {
          onConflict: 'id'
        })
        .select()
        .single();
        
      if (createError) {
        console.error('Error creating profile:', createError);
        // If profile creation fails due to RLS, the trigger might handle it
        // Let's try to fetch again after a short delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { data: retryProfile, error: retryError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', supabaseUser.id)
          .single();
          
        if (retryError || !retryProfile) {
          console.error('Failed to create or fetch profile after retry:', retryError);
          return null;
        }
        
        return {
          id: supabaseUser.id,
          email: supabaseUser.email || retryProfile.email,
          displayName: retryProfile.display_name,
          role: retryProfile.role,
          kycStatus: retryProfile.kyc_status,
          profileImage: retryProfile.profile_image,
          university: retryProfile.university,
          specialty: retryProfile.specialty,
          subscriptionStatus: retryProfile.subscription_status,
          subscriptionExpiry: retryProfile.subscription_expiry ? new Date(retryProfile.subscription_expiry) : null,
          createdAt: new Date(retryProfile.created_at),
          updatedAt: retryProfile.updated_at ? new Date(retryProfile.updated_at) : undefined,
        };
      }
      
      console.log('New profile created successfully');
      return {
        id: supabaseUser.id,
        email: supabaseUser.email || newProfile.email,
        displayName: newProfile.display_name,
        role: newProfile.role,
        kycStatus: newProfile.kyc_status,
        profileImage: newProfile.profile_image,
        university: newProfile.university,
        specialty: newProfile.specialty,
        subscriptionStatus: newProfile.subscription_status,
        subscriptionExpiry: newProfile.subscription_expiry ? new Date(newProfile.subscription_expiry) : null,
        createdAt: new Date(newProfile.created_at),
        updatedAt: newProfile.updated_at ? new Date(newProfile.updated_at) : undefined,
      };
    }

    console.log('Using existing profile');
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || profileData.email,
      displayName: profileData.display_name,
      role: profileData.role,
      kycStatus: profileData.kyc_status,
      profileImage: profileData.profile_image,
      university: profileData.university,
      specialty: profileData.specialty,
      subscriptionStatus: profileData.subscription_status,
      subscriptionExpiry: profileData.subscription_expiry ? new Date(profileData.subscription_expiry) : null,
      createdAt: new Date(profileData.created_at),
      updatedAt: profileData.updated_at ? new Date(profileData.updated_at) : undefined,
    };
  } catch (error) {
    console.error('Error converting user:', error);
    return null;
  }
};
