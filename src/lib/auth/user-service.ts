
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole, KycStatus } from "./types";

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data } = await supabase.auth.getSession();
    
    if (!data.session) {
      // Check for demo users in localStorage
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
      return null;
    }
    
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.session.user.id)
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching user profile:", error);
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
    }
    
    return null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};
