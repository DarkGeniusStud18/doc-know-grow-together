
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole, KycStatus } from "./types";

export const signUp = async (
  email: string,
  password: string,
  role: UserRole,
  displayName: string
): Promise<boolean> => {
  try {
    // First check if user already exists
    const { data: existingUsers } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email as string)
      .limit(1);
      
    if (existingUsers && existingUsers.length > 0) {
      toast.error("Un compte avec cet email existe déjà");
      return false;
    }

    // Get the base URL for redirection, excluding any path or parameters
    const origin = window.location.origin;
    const redirectTo = `${origin}/email-confirmation`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          role: role
        },
        emailRedirectTo: redirectTo
      }
    });
    
    if (error) {
      console.error("Error signing up:", error);
      toast.error(error.message || "Erreur lors de l'inscription");
      return false;
    }
    
    if (data.user) {
      // Create user profile in our database
      const now = new Date().toISOString();
      
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          display_name: displayName,
          role: role,
          kyc_status: 'not_submitted' as KycStatus,
          email: email,
          created_at: now,
          updated_at: now
        });
      
      if (profileError) {
        console.error("Error creating profile:", profileError);
        toast.error("Erreur lors de la création du profil");
        return false;
      }
      
      // Display a prominent toast message about email verification
      toast.success("Inscription réussie!", {
        description: "Un email de confirmation a été envoyé. Veuillez vérifier votre boîte mail et cliquer sur le lien de vérification pour activer votre compte.",
        duration: 8000, // Show for a longer time to ensure the user sees it
      });
      
      return true;
    }
    
    return false;
  } catch (error: any) {
    console.error("Error signing up:", error);
    toast.error("Erreur lors de l'inscription", {
      description: error.message || "Veuillez réessayer plus tard."
    });
    return false;
  }
};

export const signIn = async (
  email: string,
  password: string
): Promise<User | null> => {
  try {
    // Handle demo accounts
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
      toast.success("Connexion réussie avec le compte démo étudiant!");
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
      toast.success("Connexion réussie avec le compte démo professionnel!");
      return user;
    }
    
    // Regular login flow
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error("Error signing in:", error);
      toast.error(error.message || "Email ou mot de passe incorrect");
      return null;
    }
    
    if (data.user) {
      // Get user profile from our database
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();
      
      if (profileError) {
        console.error("Error fetching profile:", profileError);
        toast.error("Erreur lors de la récupération du profil");
        return null;
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
        
        toast.success("Connexion réussie!");
        return user;
      } else {
        // If no profile found, create one
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
        
        toast.success("Connexion réussie!");
        return user;
      }
    }
    
    toast.error("Email ou mot de passe incorrect");
    return null;
  } catch (error: any) {
    console.error("Error signing in:", error);
    toast.error("Erreur lors de la connexion", {
      description: error.message || "Veuillez réessayer plus tard."
    });
    return null;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    toast.success("Déconnexion réussie");
  } catch (error: any) {
    console.error("Error signing out:", error);
    toast.error("Erreur lors de la déconnexion", {
      description: error.message || "Veuillez réessayer plus tard."
    });
  }
};

export const createUserProfile = async (user: User) => {
  // Convert Date to ISO string format for Supabase
  const createdAt = user.createdAt.toISOString();
  
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      display_name: user.displayName,
      role: user.role,
      kyc_status: user.kycStatus,
      created_at: createdAt,
      profile_image: user.profileImage || null,
      university: user.university || null,
      specialty: user.specialty || null,
    });

  if (error) {
    console.error('Error creating user profile:', error);
    throw new Error('Failed to create user profile');
  }

  return data;
};
