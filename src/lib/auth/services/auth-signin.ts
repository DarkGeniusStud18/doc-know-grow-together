
// Service pour la gestion de la connexion des utilisateurs
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole, KycStatus } from "../types";

/**
 * Gère le processus de connexion d'un utilisateur
 * @param email - Email de l'utilisateur
 * @param password - Mot de passe de l'utilisateur
 * @returns Promise<User | null> - Informations de l'utilisateur connecté ou null si échec
 */
export const signIn = async (
  email: string,
  password: string
): Promise<User | null> => {
  try {
    console.log('Attempting sign in for:', email);
    
    // Gestion des comptes de démonstration
    if (email === "student@example.com" && password === "password") {
      const user: User = {
        id: "student-1",
        email: "student@example.com",
        displayName: "Alex Dupont",
        role: "student",
        kycStatus: "verified",
        university: "Université Paris Descartes",
        createdAt: new Date(),
      };
      console.log('Demo student login successful');
      // Store demo user in localStorage for persistence
      localStorage.setItem('demoUser', 'student');
      return user;
    } else if (email === "doctor@example.com" && password === "password") {
      const user: User = {
        id: "professional-1",
        email: "doctor@example.com",
        displayName: "Dr. Marie Lambert",
        role: "professional",
        kycStatus: "verified",
        specialty: "Cardiologie",
        createdAt: new Date(),
      };
      console.log('Demo professional login successful');
      // Store demo user in localStorage for persistence
      localStorage.setItem('demoUser', 'professional');
      return user;
    }
    
    // Flux de connexion standard
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error("Error signing in:", error);
      throw new Error(error.message || "Email ou mot de passe incorrect");
    }
    
    if (data.user) {
      console.log("User signed in:", data.user);
      
      // Récupération du profil utilisateur de notre base de données
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();
      
      if (profileError) {
        console.error("Error fetching profile:", profileError);
        throw new Error("Erreur lors de la récupération du profil");
      }
      
      if (profileData) {
        const user: User = {
          id: data.user.id,
          email: data.user.email || '',
          displayName: profileData.display_name,
          role: profileData.role as UserRole,
          kycStatus: profileData.kyc_status as KycStatus,
          profileImage: profileData.profile_image,
          university: profileData.university,
          specialty: profileData.specialty,
          createdAt: new Date(profileData.created_at),
        };
        
        console.log("User profile found:", user);
        return user;
      } else {
        // Si aucun profil n'est trouvé, en créer un
        console.log("No profile found, creating one...");
        const displayName = data.user.user_metadata.display_name || email.split('@')[0];
        const role = data.user.user_metadata.role || 'student';
        
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            display_name: displayName,
            role: role,
            kyc_status: 'not_submitted' as KycStatus,
            email: data.user.email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        if (createProfileError) {
          console.error("Error creating missing profile:", createProfileError);
        }
        
        const user: User = {
          id: data.user.id,
          email: data.user.email || '',
          displayName: displayName,
          role: role as UserRole,
          kycStatus: 'not_submitted' as KycStatus,
          createdAt: new Date(),
        };
        
        console.log("Created new profile:", user);
        return user;
      }
    }
    
    throw new Error("Email ou mot de passe incorrect");
  } catch (error: any) {
    console.error("Error signing in:", error);
    throw error;
  }
};
