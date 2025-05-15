
// This file is kept for backward compatibility
// All functionality has been moved to src/lib/auth/ directory
export * from './auth/index';

// Ajout de messages en français pour l'authentification
export const authMessagesFrench = {
  loginSuccess: "Connexion réussie ! Bienvenue sur MedCollab.",
  loginError: "Erreur de connexion. Veuillez vérifier vos identifiants.",
  logoutSuccess: "Vous avez été déconnecté avec succès.",
  registrationSuccess: "Inscription réussie ! Un email de confirmation a été envoyé.",
  registrationError: "Erreur lors de l'inscription. Veuillez réessayer.",
  passwordResetSent: "Instructions de réinitialisation envoyées à votre email.",
  passwordResetSuccess: "Votre mot de passe a été réinitialisé avec succès.",
  emailVerificationRequired: "Veuillez vérifier votre email pour activer votre compte.",
  accountNotVerified: "Votre compte n'est pas encore vérifié.",
  sessionExpired: "Votre session a expiré. Veuillez vous reconnecter."
};

