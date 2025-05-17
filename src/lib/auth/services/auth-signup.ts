
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { z } from 'zod';
import { checkUserExists } from '../utils/user-validation';

// Define SignUpSchema directly here since we can't import it without circular dependency
const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(2),
  role: z.enum(["student", "professional"]),
  university: z.string().optional(),
  specialty: z.string().optional()
});

type SignUpInput = z.infer<typeof SignUpSchema>;

export const signUp = async (formData: SignUpInput) => {
  try {
    // Check if user exists already
    const userExists = await checkUserExists(formData.email);
    if (userExists) {
      toast.error('Un compte avec cette adresse email existe déjà.');
      return null;
    }

    const redirectUrl = `${window.location.origin}/email-confirmation`;
    console.log("Email redirect URL:", redirectUrl);

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          display_name: formData.displayName,
          role: formData.role,
          university: formData.university,
          specialty: formData.specialty
        },
        emailRedirectTo: redirectUrl
      },
    });

    if (error) {
      console.error('Error during sign up:', error);
      toast.error('Erreur lors de l\'inscription');
      return null;
    }

    console.log("Signup successful, email confirmation sent");
    return data;
  } catch (error) {
    console.error('Unexpected error during sign up:', error);
    toast.error('Une erreur inattendue s\'est produite');
    return null;
  }
};
