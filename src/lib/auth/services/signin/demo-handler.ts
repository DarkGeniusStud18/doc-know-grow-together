
import { toast } from "@/components/ui/sonner";
import { User } from "../../types";
import { getCurrentUser } from "../../user-service";

/**
 * Handles the login process for a demo account
 * @param email - Email of the demo account
 * @returns Demo user object or null in case of error
 */
export const handleDemoLogin = async (email: string): Promise<User | null> => {
  console.log('AuthSignin: Traitement d\'un compte de démonstration pour:', email);
  
  try {
    // Simulate a realistic network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Determine the type of demo user
    const demoUserType = email === 'student@example.com' ? 'student' : 'professional';
    
    // Securely store the demo user type
    localStorage.setItem('demoUser', demoUserType);
    console.log('AuthSignin: Type d\'utilisateur de démo défini:', demoUserType);
    
    // Retrieve the demo user via the user service
    const demoUser = await getCurrentUser();
    
    if (demoUser) {
      console.log('AuthSignin: Connexion de démonstration réussie pour:', demoUser.displayName);
      toast.success('Connexion de démonstration réussie', { 
        id: 'demo-login-success',
        description: `Bienvenue ${demoUser.displayName} !`
      });
      return demoUser;
    }
    
    console.error('AuthSignin: Impossible de créer l\'utilisateur de démonstration');
    toast.error('Erreur lors de la création du compte de démonstration');
    return null;
    
  } catch (error) {
    console.error('AuthSignin: Erreur lors de la connexion de démonstration:', error);
    toast.error('Erreur lors de la connexion de démonstration');
    return null;
  }
};
