
/**
 * Service pour la récupération et la gestion des utilisateurs
 * Adapté pour fonctionner avec la nouvelle structure Supabase
 */
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole, KycStatus, isSupabaseResponseError } from "./types";

/**
 * Récupère l'utilisateur actuellement connecté
 * @returns Utilisateur connecté ou null si non connecté
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    console.log("Getting current user...");
    
    // Vérifier d'abord les utilisateurs de démo dans localStorage pour la persistance
    const demoUser = localStorage.getItem('demoUser');
    if (demoUser === 'student') {
      console.log("Returning demo student user");
      return {
        id: "student-1",
        email: "student@example.com",
        displayName: "Alex Dupont",
        role: "student",
        kycStatus: "verified",
        university: "Université Paris Descartes",
        subscriptionStatus: "free",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } else if (demoUser === 'professional') {
      console.log("Returning demo professional user");
      return {
        id: "professional-1",
        email: "doctor@example.com",
        displayName: "Dr. Marie Lambert",
        role: "professional",
        kycStatus: "verified",
        specialty: "Cardiologie",
        subscriptionStatus: "free",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    // Obtenir la session avec autoRefreshToken activé
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Error getting session:", sessionError);
      return null;
    }

    if (!sessionData.session) {
      console.log("No session found");
      return null;
    }
    
    console.log("Current session:", sessionData.session);

    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionData.session.user.id)
        .maybeSingle();
        
      if (profileError) {
        console.error("Error fetching user profile:", profileError);
        return null;
      }
        
      if (profileData) {
        // Vérifier que profileData n'est pas une erreur
        if (isSupabaseResponseError(profileData)) {
          console.error("Profile data is an error object:", profileData);
          return null;
        }
        
        console.log("Profile found:", profileData);
        return {
          id: sessionData.session.user.id,
          email: sessionData.session.user.email || '',
          displayName: profileData.display_name,
          role: profileData.role as UserRole,
          kycStatus: profileData.kyc_status as KycStatus,
          profileImage: profileData.profile_image,
          university: profileData.university,
          specialty: profileData.specialty,
          subscriptionStatus: profileData.subscription_status,
          subscriptionExpiry: profileData.subscription_expiry ? new Date(profileData.subscription_expiry) : null,
          createdAt: new Date(profileData.created_at),
          updatedAt: new Date(profileData.updated_at)
        };
      } else {
        // Si le profil n'existe pas pour une raison quelconque, en créer un nouveau
        console.log("No profile found, creating one...");
        
        const displayName = sessionData.session.user.user_metadata.display_name || 
                          sessionData.session.user.email?.split('@')[0] || 
                          'User';
        const role = sessionData.session.user.user_metadata.role || 'student';
          
        try {
          const { error: createProfileError } = await supabase
            .from('profiles')
            .insert({
              id: sessionData.session.user.id,
              display_name: displayName,
              role: role,
              kyc_status: 'not_submitted' as KycStatus,
              email: sessionData.session.user.email,
              subscription_status: 'free',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
              
          if (createProfileError) {
            console.error("Error creating missing profile:", createProfileError);
            return null;
          }
          
          return {
            id: sessionData.session.user.id,
            email: sessionData.session.user.email || '',
            displayName: displayName,
            role: role as UserRole,
            kycStatus: 'not_submitted' as KycStatus,
            subscriptionStatus: 'free',
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        } catch (error) {
          console.error("Error creating new profile:", error);
          return null;
        }
      }
    } catch (profileError) {
      console.error("Error in profile handling:", profileError);
      return null;
    }
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};
