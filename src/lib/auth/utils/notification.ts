
import { toast } from "@/components/ui/sonner";

/**
 * Affiche un message toast de succès pour l'inscription
 */
export function showSignupSuccessMessage(): void {
  toast.success("Inscription réussie!", {
    description: "Un email de confirmation a été envoyé. Veuillez vérifier votre boîte mail et cliquer sur le lien de vérification pour activer votre compte.",
    duration: 8000, // Afficher plus longtemps pour que l'utilisateur le voie
  });
}

/**
 * Affiche un message toast d'erreur
 * @param message - Message d'erreur principal
 * @param description - Description détaillée de l'erreur
 */
export function showErrorMessage(message: string, description?: string): void {
  toast.error(message, {
    description: description || "Veuillez réessayer plus tard."
  });
}
