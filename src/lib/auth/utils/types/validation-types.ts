
// Types for validation functions
export interface EmailCheckResponse {
  data: { id: string }[] | null;
  error: Error | null;
}

// Sign up schema for validation
import { z } from 'zod';

export const SignUpSchema = z.object({
  email: z.string().email({ message: "Un email valide est requis" }),
  password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
  displayName: z.string().min(2, { message: "Le nom d'affichage est requis" }),
  role: z.enum(["student", "professional"]),
  university: z.string().optional(),
  specialty: z.string().optional()
});

// Type definition for Group Message
export interface GroupMessage {
  id: string;
  group_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// Extended Message type with sender info
export interface EnrichedGroupMessage extends GroupMessage {
  sender_name?: string;
  sender_avatar?: string;
}
