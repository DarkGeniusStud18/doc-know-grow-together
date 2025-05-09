
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

export type UserRole = 'student' | 'professional' | 'admin';

export type KycStatus = 'pending' | 'verified' | 'rejected' | 'not_submitted';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  kycStatus: KycStatus;
  profileImage?: string;
  university?: string;
  specialty?: string;
  createdAt: Date;
}

export const signUp = async (
  email: string,
  password: string,
  role: UserRole,
  displayName: string
): Promise<User | null> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          role: role
        }
      }
    });
    
    if (error) throw error;
    
    if (data.user) {
      // Create user profile in our database
      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        displayName: displayName,
        role: role,
        kycStatus: 'not_submitted',
        createdAt: new Date(),
      };
      
      toast.success("Inscription réussie!", {
        description: "Vous êtes maintenant inscrit à MedCollab."
      });
      
      return user;
    }
    
    return null;
  } catch (error) {
    console.error("Error signing up:", error);
    toast.error("Erreur lors de l'inscription", {
      description: "Veuillez réessayer plus tard."
    });
    return null;
  }
};

export const signIn = async (
  email: string,
  password: string
): Promise<User | null> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    if (data.user) {
      // Get user profile from our database
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
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
      }
      
      // For demo purposes, if no profile is found
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
        return user;
      }
    }
    
    toast.error("Email ou mot de passe incorrect");
    return null;
  } catch (error) {
    console.error("Error signing in:", error);
    toast.error("Erreur lors de la connexion", {
      description: "Veuillez réessayer plus tard."
    });
    return null;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    toast.success("Déconnexion réussie");
  } catch (error) {
    console.error("Error signing out:", error);
    toast.error("Erreur lors de la déconnexion", {
      description: "Veuillez réessayer plus tard."
    });
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data } = await supabase.auth.getSession();
    if (!data.session) return null;
    
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.session.user.id)
      .single();
      
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

export const submitKycDocuments = async (files: File[], userId: string): Promise<boolean> => {
  try {
    // Upload files to storage
    const uploadPromises = files.map(async (file) => {
      const filePath = `${userId}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('kyc_documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the URL
      const { data } = supabase.storage
        .from('kyc_documents')
        .getPublicUrl(filePath);
      
      // Insert document reference into kyc_documents table
      const { error: insertError } = await supabase
        .from('kyc_documents')
        .insert({
          user_id: userId,
          document_type: file.type,
          document_url: data.publicUrl
        });

      if (insertError) throw insertError;
    });
    
    await Promise.all(uploadPromises);
    
    // Update user KYC status
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ kyc_status: 'pending' })
      .eq('id', userId);
      
    if (updateError) throw updateError;
    
    toast.success("Documents soumis avec succès", {
      description: "Nous examinerons votre demande dans les 48h."
    });
    return true;
  } catch (error) {
    console.error("Error submitting KYC documents:", error);
    toast.error("Erreur lors de l'envoi des documents", {
      description: "Veuillez réessayer plus tard."
    });
    return false;
  }
};
