
/**
 * 📅 Carte d'Événement Optimisée
 * 
 * Composant dédié à l'affichage d'un événement de calendrier
 * - Design responsive adapté aux écrans mobiles
 * - Actions rapides (édition, suppression)
 * - Indicateurs visuels pour les événements à venir
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, Edit, Trash2 } from 'lucide-react';

/**
 * Interface pour un événement de calendrier
 */
interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  created_at: string;
}

interface EventCardProps {
  event: CalendarEvent;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
}

/**
 * Composant carte d'événement avec gestion responsive
 */
const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onDelete }) => {
  
  /**
   * 📅 Formatage intelligent de la date
   * Adapte l'affichage selon la taille d'écran
   */
  const formatDate = (dateString: string, isCompact: boolean = false) => {
    const date = new Date(dateString);
    
    if (isCompact) {
      // Format compact pour mobile
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    // Format complet pour desktop
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * ⏰ Détermine si l'événement est à venir
   */
  const isUpcoming = (startTime: string): boolean => {
    return new Date(startTime) > new Date();
  };

  /**
   * 🎨 Obtient la classe CSS pour l'état de l'événement
   */
  const getEventStateClass = (): string => {
    return isUpcoming(event.start_time) 
      ? 'border-l-4 border-l-medical-teal bg-gradient-to-r from-teal-50 to-white' 
      : 'bg-white hover:bg-gray-50';
  };

  return (
    <Card className={`
      group hover:shadow-lg transition-all duration-300 
      ${getEventStateClass()}
    `}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* 🏷️ Titre de l'événement avec icône */}
            <CardTitle className="text-base sm:text-lg flex items-start gap-2 mb-2">
              <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-medical-teal flex-shrink-0 mt-0.5" />
              <span className="break-words line-clamp-2">{event.title}</span>
              {isUpcoming(event.start_time) && (
                <span className="bg-medical-teal text-white text-xs px-2 py-1 rounded-full flex-shrink-0 ml-auto">
                  À venir
                </span>
              )}
            </CardTitle>
            
            {/* ⏱️ Informations temporelles */}
            <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="font-medium">Début:</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                {/* Affichage mobile compact */}
                <span className="sm:hidden">{formatDate(event.start_time, true)}</span>
                {/* Affichage desktop complet */}
                <span className="hidden sm:inline">{formatDate(event.start_time)}</span>
                
                <span className="text-gray-400 hidden sm:inline">—</span>
                
                <div className="flex items-center gap-1 sm:hidden">
                  <span className="font-medium">Fin:</span>
                  <span>{formatDate(event.end_time, true)}</span>
                </div>
                <span className="hidden sm:inline">{formatDate(event.end_time)}</span>
              </div>
            </CardDescription>
          </div>
          
          {/* 🔧 Boutons d'action */}
          <div className="flex gap-1 sm:gap-2 flex-shrink-0">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(event)}
              className="h-8 w-8 p-0 hover:bg-medical-teal hover:text-white transition-colors"
              title="Modifier l'événement"
            >
              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDelete(event.id)}
              className="h-8 w-8 p-0 hover:bg-red-500 hover:text-white transition-colors"
              title="Supprimer l'événement"
            >
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* 📝 Description de l'événement */}
      {event.description && (
        <CardContent className="pt-0">
          <p className="text-sm sm:text-base text-gray-700 break-words line-clamp-3">
            {event.description}
          </p>
        </CardContent>
      )}
    </Card>
  );
};

export default EventCard;
