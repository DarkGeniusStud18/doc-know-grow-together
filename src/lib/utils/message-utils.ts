
// Utilitaires pour les messages et les discussions

/**
 * Formate la date d'un message pour l'affichage
 * @param date Date à formater
 * @returns Date formatée en français
 */
export function formatMessageDate(date: string | Date): string {
  const messageDate = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - messageDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  // Aujourd'hui
  if (messageDate.toDateString() === now.toDateString()) {
    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
    return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  }
  
  // Hier
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (messageDate.toDateString() === yesterday.toDateString()) {
    return `Hier à ${new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(messageDate)}`;
  }
  
  // Cette semaine
  if (diffDays < 7) {
    const weekdays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return `${weekdays[messageDate.getDay()]} à ${new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(messageDate)}`;
  }
  
  // Plus ancien
  return new Intl.DateTimeFormat('fr-FR', { 
    day: 'numeric', 
    month: 'long', 
    year: messageDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    hour: '2-digit', 
    minute: '2-digit' 
  }).format(messageDate);
}

/**
 * Formate le statut de lecture d'un message
 * @param isRead État de lecture du message
 * @returns Texte formaté pour l'état de lecture
 */
export function formatReadStatus(isRead: boolean): string {
  return isRead ? "Lu" : "Non lu";
}

/**
 * Formate le nom d'un groupe de discussion
 * @param name Nom du groupe
 * @param isPrivate Si le groupe est privé
 * @returns Nom formaté avec indicateur de confidentialité
 */
export function formatGroupName(name: string, isPrivate: boolean): string {
  return isPrivate ? `${name} (Privé)` : name;
}

