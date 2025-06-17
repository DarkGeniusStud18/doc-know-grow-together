
/**
 * Service pour la récupération et la gestion des utilisateurs
 * VERSION OPTIMISÉE - Supprime les vérifications excessives
 */
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole, KycStatus, isValidData } from "./types";

/**
 * Récupère l'utilisateur actuellement connecté - VERSION RAPIDE
 * Supprime les vérifications inutiles pour un accès immédiat
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    console.log("🚀 UserService: Récupération utilisateur optimisée...");
    
    // Vérification des utilisateurs de démo FIRST - plus rapide
    const demoUser = localStorage.getItem('demoUser');
    if (demoUser === 'student') {
      console.log("✅ UserService: Utilisateur étudiant de démonstration");
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
      console.log("✅ UserService: Utilisateur professionnel de démonstration");
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

    // Récupération de la session Supabase - VERSION DIRECTE
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("❌ UserService: Erreur session:", sessionError);
      return null;
    }

    if (!sessionData.session) {
      console.log("ℹ️ UserService: Aucune session");
      return null;
    }
    
    console.log("✅ UserService: Session trouvée:", sessionData.session.user.id);

    // Récupération du profil utilisateur - DIRECTE sans retry excessif
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', sessionData.session.user.id)
      .maybeSingle();
        
    if (profileError) {
      console.error("❌ UserService: Erreur profil:", profileError);
      return null;
    }
        
    if (profileData && isValidData(profileData)) {
      console.log("✅ UserService: Profil récupéré");
      
      // Conversion DIRECTE des données du profil au format User
      return {
        id: sessionData.session.user.id,
        email: sessionData.session.user.email || '',
        displayName: profileData.display_name,
        role: profileData.role as UserRole,
        kycStatus: profileData.kyc_status as KycStatus,
        profileImage: profileData.profile_image || undefined,
        university: profileData.university || undefined,
        specialty: profileData.specialty || undefined,
        subscriptionStatus: profileData.subscription_status as any,
        subscriptionExpiry: profileData.subscription_expiry ? new Date(profileData.subscription_expiry) : null,
        createdAt: new Date(profileData.created_at),
        updatedAt: new Date(profileData.updated_at)
      };
    } else {
      // Création automatique du profil manquant - VERSION SIMPLIFIÉE
      console.log("⚠️ UserService: Création profil manquant...");
      
      const displayName = sessionData.session.user.user_metadata.display_name || 
                        sessionData.session.user.user_metadata.name || 
                        sessionData.session.user.email?.split('@')[0] || 
                        'Utilisateur';
      
      const role = sessionData.session.user.user_metadata.role || 'student';
        
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
        console.error("❌ UserService: Erreur création profil:", createProfileError);
        return null;
      }
      
      console.log("✅ UserService: Profil créé");
      
      // Retour IMMÉDIAT du profil nouvellement créé
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
    }
  } catch (error) {
    console.error("💥 UserService: Erreur critique:", error);
    return null;
  }
};
