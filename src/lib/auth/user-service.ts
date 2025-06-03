
/**
 * Service pour la récupération et la gestion des utilisateurs
 * Adapté pour fonctionner avec la nouvelle structure Supabase
 */
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole, KycStatus, isValidData } from "./types";

/**
 * Récupère l'utilisateur actuellement connecté depuis Supabase ou localStorage
 * Cette fonction gère à la fois les vrais utilisateurs et les utilisateurs de démonstration
 * @returns Utilisateur connecté ou null si non connecté
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    console.log("Récupération de l'utilisateur actuel...");
    
    // Vérification des utilisateurs de démo dans localStorage pour la persistance
    const demoUser = localStorage.getItem('demoUser');
    if (demoUser === 'student') {
      console.log("Retour de l'utilisateur étudiant de démonstration");
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
      console.log("Retour de l'utilisateur professionnel de démonstration");
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

    // Récupération de la session Supabase avec autoRefreshToken activé
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Erreur lors de la récupération de la session:", sessionError);
      return null;
    }

    if (!sessionData.session) {
      console.log("Aucune session trouvée");
      return null;
    }
    
    console.log("Session actuelle trouvée:", sessionData.session.user.id);

    try {
      // Récupération du profil utilisateur depuis la table profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionData.session.user.id)
        .maybeSingle(); // Utilisation de maybeSingle pour éviter les erreurs
        
      if (profileError) {
        console.error("Erreur lors de la récupération du profil utilisateur:", profileError);
        return null;
      }
        
      if (profileData && isValidData(profileData)) {
        console.log("Profil trouvé dans la base de données:", profileData.id);
        
        // Conversion des données du profil au format User
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
        // Si le profil n'existe pas, en créer un nouveau
        console.log("Aucun profil trouvé, création d'un nouveau profil...");
        
        // Détermination du nom d'affichage par défaut
        const displayName = sessionData.session.user.user_metadata.display_name || 
                          sessionData.session.user.user_metadata.name || 
                          sessionData.session.user.email?.split('@')[0] || 
                          'Utilisateur';
        
        // Détermination du rôle par défaut
        const role = sessionData.session.user.user_metadata.role || 'student';
          
        try {
          // Création d'un nouveau profil dans la base de données
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
            console.error("Erreur lors de la création du profil manquant:", createProfileError);
            return null;
          }
          
          console.log("Nouveau profil créé avec succès");
          
          // Retour du profil nouvellement créé
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
          console.error("Erreur lors de la création du nouveau profil:", error);
          return null;
        }
      }
    } catch (profileError) {
      console.error("Erreur dans la gestion du profil:", profileError);
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur actuel:", error);
    return null;
  }
};
