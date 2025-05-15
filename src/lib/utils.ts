
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Dictionnaire français-anglais pour les termes couramment utilisés
export const frenchDictionary = {
  // Common actions
  login: "Connexion",
  logout: "Déconnexion",
  register: "S'inscrire",
  submit: "Soumettre",
  cancel: "Annuler",
  save: "Enregistrer",
  delete: "Supprimer",
  edit: "Modifier",
  view: "Voir",
  search: "Rechercher",
  
  // Common terms
  dashboard: "Tableau de bord",
  profile: "Profil",
  settings: "Paramètres",
  courses: "Cours",
  resources: "Ressources",
  community: "Communauté",
  calendar: "Calendrier",
  notifications: "Notifications",
  
  // Status terms
  verified: "Vérifié",
  notVerified: "Non vérifié",
  pending: "En attente",
  loading: "Chargement",
  error: "Erreur",
  success: "Succès",
  
  // Medical terms
  medicine: "Médecine",
  student: "Étudiant",
  professional: "Professionnel",
  specialty: "Spécialité",
  clinicalCases: "Cas cliniques",
  anatomy: "Anatomie",
  cardiology: "Cardiologie",
  neurology: "Neurologie",
  pediatrics: "Pédiatrie",
  
  // Tools
  tools: "Outils",
  flashcards: "Fiches",
  notes: "Notes",
  studyPlanner: "Planificateur d'études",
  examSimulator: "Simulateur d'examen",
  
  // Auth messages
  welcomeBack: "Bienvenue à nouveau",
  forgotPassword: "Mot de passe oublié ?",
  createAccount: "Créer un compte",
  verifyIdentity: "Vérifier votre identité",
  
  // Tooltips and messages
  required: "Requis",
  optional: "Facultatif",
  enterValidEmail: "Entrez un email valide",
  passwordTooShort: "Le mot de passe est trop court",
  
  // Dates
  today: "Aujourd'hui",
  yesterday: "Hier",
  tomorrow: "Demain",
  
  // Navigation
  home: "Accueil",
  back: "Retour",
  next: "Suivant",
  previous: "Précédent"
};

// Formatter pour les dates en français
export function formatDateFrench(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

// Formatter pour les heures en français
export function formatTimeFrench(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Formatter pour la date et l'heure en français
export function formatDateTimeFrench(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

