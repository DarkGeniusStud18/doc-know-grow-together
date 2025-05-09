
import { toast } from "@/components/ui/sonner";

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

// Mock authentication functions
// In production, these would connect to a backend

export const signUp = async (
  email: string,
  password: string,
  role: UserRole,
  displayName: string
): Promise<User | null> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Real implementation would call an API
    const user: User = {
      id: crypto.randomUUID(),
      email,
      displayName,
      role,
      kycStatus: 'not_submitted',
      createdAt: new Date(),
    };
    
    // In production we would save this to a real backend
    localStorage.setItem('medcollab_user', JSON.stringify(user));
    
    toast.success("Inscription réussie!", {
      description: "Vous êtes maintenant inscrit à MedCollab."
    });
    
    return user;
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
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user for demo purposes
    // In production this would be validated against a backend
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
      
      localStorage.setItem('medcollab_user', JSON.stringify(user));
      toast.success("Connexion réussie!");
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
      
      localStorage.setItem('medcollab_user', JSON.stringify(user));
      toast.success("Connexion réussie!");
      return user;
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

export const signOut = (): void => {
  localStorage.removeItem('medcollab_user');
  toast.success("Déconnexion réussie");
};

export const getCurrentUser = (): User | null => {
  const userString = localStorage.getItem('medcollab_user');
  if (!userString) return null;
  
  try {
    return JSON.parse(userString) as User;
  } catch {
    return null;
  }
};

export const submitKycDocuments = async (files: File[], userId: string): Promise<boolean> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In production, this would upload files to a secure storage
    // and update the user's KYC status in the database
    
    // Update local storage for demo
    const user = getCurrentUser();
    if (user) {
      user.kycStatus = 'pending';
      localStorage.setItem('medcollab_user', JSON.stringify(user));
    }
    
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
