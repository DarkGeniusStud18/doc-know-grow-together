
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole, KycStatus } from "./types";

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // First check for demo users in localStorage for persistence
    const demoUser = localStorage.getItem('demoUser');
    if (demoUser === 'student') {
      return {
        id: "student-1",
        email: "student@example.com",
        displayName: "Alex Dupont",
        role: "student",
        kycStatus: "verified",
        university: "Université Paris Descartes",
        createdAt: new Date(),
      };
    } else if (demoUser === 'professional') {
      return {
        id: "professional-1",
        email: "doctor@example.com",
        displayName: "Dr. Marie Lambert",
        role: "professional",
        kycStatus: "verified",
        specialty: "Cardiologie",
        createdAt: new Date(),
      };
    }

    // Get session with autoRefreshToken enabled
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Error getting session:", error);
      return null;
    }

    if (!data.session) {
      return null;
    }
    
    console.log("Current session:", data.session);
    
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.session.user.id)
      .maybeSingle();
      
    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      return null;
    }
      
    if (profileData) {
      return {
        id: data.session.user.id,
        email: data.session.user.email || '',
        displayName: profileData.display_name,
        role: profileData.role as UserRole,
        kycStatus: profileData.kyc_status as KycStatus,
        profileImage: profileData.profile_image,
        university: profileData.university,
        specialty: profileData.specialty,
        createdAt: new Date(profileData.created_at),
      };
    } else {
      // If profile doesn't exist for some reason, create it
      const displayName = data.session.user.user_metadata.display_name || 
                          data.session.user.email?.split('@')[0] || 
                          'User';
      const role = data.session.user.user_metadata.role || 'student';
        
      const { error: createProfileError } = await supabase
        .from('profiles')
        .insert({
          id: data.session.user.id,
          display_name: displayName,
          role: role,
          kyc_status: 'not_submitted' as KycStatus,
          email: data.session.user.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
          
      if (createProfileError) {
        console.error("Error creating missing profile:", createProfileError);
        return null;
      }
      
      return {
        id: data.session.user.id,
        email: data.session.user.email || '',
        displayName: displayName,
        role: role as UserRole,
        kycStatus: 'not_submitted' as KycStatus,
        createdAt: new Date(),
      };
    }
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};
