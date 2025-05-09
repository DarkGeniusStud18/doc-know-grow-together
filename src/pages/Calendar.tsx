
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import { Clock, Calendar as CalendarIcon, MapPin, Trash2, Plus, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type CalendarEvent = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  location: string | null;
  is_recurring: boolean;
  recurrence_rule: string | null;
  created_at: string;
  updated_at: string;
};

const Calendar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<CalendarEvent | null>(null);
  const queryClient = useQueryClient();
  
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    location: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endDate: format(new Date(), 'yyyy-MM-dd'),
    endTime: '10:00',
    isRecurring: false,
    recurrenceRule: ''
  });

  const fetchEvents = async () => {
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('user_id', user.id)
      .order('start_time', { ascending: true });
      
    if (error) {
      throw new Error(`Error fetching events: ${error.message}`);
    }
    
    return data as CalendarEvent[];
  };

  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['calendarEvents', user?.id],
    queryFn: fetchEvents,
    enabled: !!user
  });

  const createEventMutation = useMutation({
    mutationFn: async (event: {
      title: string;
      description: string;
      location: string;
      startDateTime: string;
      endDateTime: string;
      isRecurring: boolean;
      recurrenceRule: string;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('calendar_events')
        .insert({
          user_id: user.id,
          title: event.title,
          description: event.description || null,
          start_time: event.startDateTime,
          end_time: event.endDateTime,
          location: event.location || null,
          is_recurring: event.isRecurring,
          recurrence_rule: event.isRecurring ? event.recurrenceRule : null
        });
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendarEvents', user?.id] });
      toast.success('Événement créé avec succès');
      setShowCreateDialog(false);
      resetForm();
    },
    onError: (error) => {
      console.error('Error creating event:', error);
      toast.error('Erreur lors de la création de l\'événement');
    }
  });

  const updateEventMutation = useMutation({
    mutationFn: async (event: {
      id: string;
      title: string;
      description: string;
      location: string;
      startDateTime: string;
      endDateTime: string;
      isRecurring: boolean;
      recurrenceRule: string;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('calendar_events')
        .update({
          title: event.title,
          description: event.description || null,
          start_time: event.startDateTime,
          end_time: event.endDateTime,
          location: event.location || null,
          is_recurring: event.isRecurring,
          recurrence_rule: event.isRecurring ? event.recurrenceRule : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', event.id)
        .eq('user_id', user.id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendarEvents', user?.id] });
      toast.success('Événement mis à jour avec succès');
      setShowEditDialog(false);
      resetForm();
    },
    onError: (error) => {
      console.error('Error updating event:', error);
      toast.error('Erreur lors de la mise à jour de l\'événement');
    }
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', eventId)
        .eq('user_id', user.id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendarEvents', user?.id] });
      toast.success('Événement supprimé avec succès');
    },
    onError: (error) => {
      console.error('Error deleting event:', error);
      toast.error('Erreur lors de la suppression de l\'événement');
    }
  });

  const handleCreateEvent = () => {
    const startDateTime = `${eventForm.startDate}T${eventForm.startTime}:00`;
    const endDateTime = `${eventForm.endDate}T${eventForm.endTime}:00`;
    
    createEventMutation.mutate({
      title: eventForm.title,
      description: eventForm.description,
      location: eventForm.location,
      startDateTime,
      endDateTime,
      isRecurring: eventForm.isRecurring,
      recurrenceRule: eventForm.recurrenceRule
    });
  };

  const handleUpdateEvent = () => {
    if (!currentEvent) return;
    
    const startDateTime = `${eventForm.startDate}T${eventForm.startTime}:00`;
    const endDateTime = `${eventForm.endDate}T${eventForm.endTime}:00`;
    
    updateEventMutation.mutate({
      id: currentEvent.id,
      title: eventForm.title,
      description: eventForm.description,
      location: eventForm.location,
      startDateTime,
      endDateTime,
      isRecurring: eventForm.isRecurring,
      recurrenceRule: eventForm.recurrenceRule
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      deleteEventMutation.mutate(eventId);
    }
  };

  const openEditDialog = (event: CalendarEvent) => {
    const startDate = new Date(event.start_time);
    const endDate = new Date(event.end_time);
    
    setCurrentEvent(event);
    setEventForm({
      title: event.title,
      description: event.description || '',
      location: event.location || '',
      startDate: format(startDate, 'yyyy-MM-dd'),
      startTime: format(startDate, 'HH:mm'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      endTime: format(endDate, 'HH:mm'),
      isRecurring: event.is_recurring,
      recurrenceRule: event.recurrence_rule || ''
    });
    setShowEditDialog(true);
  };

  const resetForm = () => {
    setEventForm({
      title: '',
      description: '',
      location: '',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      startTime: '09:00',
      endDate: format(new Date(), 'yyyy-MM-dd'),
      endTime: '10:00',
      isRecurring: false,
      recurrenceRule: ''
    });
    setCurrentEvent(null);
  };

  // Filter events for the selected date
  const selectedDateEvents = events.filter(event => {
    if (!date) return false;
    
    const eventDate = new Date(event.start_time);
    return (
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    );
  }).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  
  if (!user) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-semibold mb-4">Connexion requise</h1>
          <p className="text-gray-600 mb-6">Veuillez vous connecter pour accéder à votre calendrier.</p>
          <Button onClick={() => navigate('/login')}>Se connecter</Button>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-medical-navy">Calendrier</h1>
            <p className="text-gray-500 mt-1">
              Gérez vos événements et planifiez votre temps efficacement
            </p>
          </div>
          
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel événement
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardContent className="p-0">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                locale={fr}
              />
            </CardContent>
            
            <CardFooter className="flex justify-center pt-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setDate(new Date())}
              >
                Aujourd'hui
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                {date ? (
                  <span>
                    Événements du {format(date, 'EEEE d MMMM yyyy', { locale: fr })}
                  </span>
                ) : (
                  <span>Sélectionnez une date</span>
                )}
              </CardTitle>
              <CardDescription>
                {selectedDateEvents.length} événement{selectedDateEvents.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-teal"></div>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="text-red-500 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium">Erreur lors du chargement des événements</h3>
                  <p className="text-gray-500 mt-2">Veuillez réessayer plus tard</p>
                </div>
              ) : selectedDateEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="bg-gray-100 rounded-full p-6 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium">Aucun événement pour cette date</h3>
                  <Button className="mt-6" onClick={() => setShowCreateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un événement
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDateEvents.map((event) => {
                    const startTime = new Date(event.start_time);
                    const endTime = new Date(event.end_time);
                    
                    return (
                      <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <Badge className="mb-2 bg-medical-blue">
                              <Clock className="h-3 w-3 mr-1" />
                              {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
                            </Badge>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => openEditDialog(event)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteEvent(event.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-3">
                          {event.description && (
                            <p className="text-gray-700 mb-3">{event.description}</p>
                          )}
                          
                          {event.location && (
                            <div className="flex items-center text-gray-500 text-sm">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{event.location}</span>
                            </div>
                          )}
                          
                          {event.is_recurring && (
                            <Badge variant="outline" className="mt-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-1"
                              >
                                <path d="M17 2.1l4 4-4 4" />
                                <path d="M3 12.2v-2a4 4 0 0 1 4-4h12.8" />
                                <path d="M7 21.9l-4-4 4-4" />
                                <path d="M21 11.8v2a4 4 0 0 1-4 4H4.2" />
                              </svg>
                              Récurrent
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Create Event Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={(open) => {
        setShowCreateDialog(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Créer un nouvel événement</DialogTitle>
            <DialogDescription>
              Ajoutez un événement à votre calendrier
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input 
                id="title" 
                placeholder="Titre de l'événement"
                value={eventForm.title}
                onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Date de début</Label>
                <Input 
                  id="startDate" 
                  type="date"
                  value={eventForm.startDate}
                  onChange={(e) => setEventForm({...eventForm, startDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startTime">Heure de début</Label>
                <Input 
                  id="startTime" 
                  type="time"
                  value={eventForm.startTime}
                  onChange={(e) => setEventForm({...eventForm, startTime: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="endDate">Date de fin</Label>
                <Input 
                  id="endDate" 
                  type="date"
                  value={eventForm.endDate}
                  onChange={(e) => setEventForm({...eventForm, endDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">Heure de fin</Label>
                <Input 
                  id="endTime" 
                  type="time"
                  value={eventForm.endTime}
                  onChange={(e) => setEventForm({...eventForm, endTime: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Lieu (optionnel)</Label>
              <Input 
                id="location" 
                placeholder="Lieu de l'événement"
                value={eventForm.location}
                onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (optionnelle)</Label>
              <Textarea 
                id="description" 
                placeholder="Description de l'événement..."
                value={eventForm.description}
                onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="recurring"
                checked={eventForm.isRecurring}
                onCheckedChange={(checked) => setEventForm({...eventForm, isRecurring: checked})}
              />
              <Label htmlFor="recurring" className="cursor-pointer">Événement récurrent</Label>
            </div>
            
            {eventForm.isRecurring && (
              <div className="space-y-2">
                <Label htmlFor="recurrenceRule">Règle de récurrence</Label>
                <Input 
                  id="recurrenceRule" 
                  placeholder="Ex: FREQ=WEEKLY;COUNT=10"
                  value={eventForm.recurrenceRule}
                  onChange={(e) => setEventForm({...eventForm, recurrenceRule: e.target.value})}
                />
                <p className="text-xs text-gray-500">
                  Exemple: FREQ=WEEKLY (hebdomadaire), FREQ=MONTHLY (mensuel), COUNT=10 (10 occurrences)
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Annuler</Button>
            <Button 
              onClick={handleCreateEvent}
              disabled={!eventForm.title || createEventMutation.isPending}
            >
              {createEventMutation.isPending ? 'Création...' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Event Dialog */}
      <Dialog open={showEditDialog} onOpenChange={(open) => {
        setShowEditDialog(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier l'événement</DialogTitle>
            <DialogDescription>
              Mettez à jour les informations de l'événement
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Titre</Label>
              <Input 
                id="edit-title" 
                placeholder="Titre de l'événement"
                value={eventForm.title}
                onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-startDate">Date de début</Label>
                <Input 
                  id="edit-startDate" 
                  type="date"
                  value={eventForm.startDate}
                  onChange={(e) => setEventForm({...eventForm, startDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-startTime">Heure de début</Label>
                <Input 
                  id="edit-startTime" 
                  type="time"
                  value={eventForm.startTime}
                  onChange={(e) => setEventForm({...eventForm, startTime: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-endDate">Date de fin</Label>
                <Input 
                  id="edit-endDate" 
                  type="date"
                  value={eventForm.endDate}
                  onChange={(e) => setEventForm({...eventForm, endDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-endTime">Heure de fin</Label>
                <Input 
                  id="edit-endTime" 
                  type="time"
                  value={eventForm.endTime}
                  onChange={(e) => setEventForm({...eventForm, endTime: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-location">Lieu (optionnel)</Label>
              <Input 
                id="edit-location" 
                placeholder="Lieu de l'événement"
                value={eventForm.location}
                onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (optionnelle)</Label>
              <Textarea 
                id="edit-description" 
                placeholder="Description de l'événement..."
                value={eventForm.description}
                onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-recurring"
                checked={eventForm.isRecurring}
                onCheckedChange={(checked) => setEventForm({...eventForm, isRecurring: checked})}
              />
              <Label htmlFor="edit-recurring" className="cursor-pointer">Événement récurrent</Label>
            </div>
            
            {eventForm.isRecurring && (
              <div className="space-y-2">
                <Label htmlFor="edit-recurrenceRule">Règle de récurrence</Label>
                <Input 
                  id="edit-recurrenceRule" 
                  placeholder="Ex: FREQ=WEEKLY;COUNT=10"
                  value={eventForm.recurrenceRule}
                  onChange={(e) => setEventForm({...eventForm, recurrenceRule: e.target.value})}
                />
                <p className="text-xs text-gray-500">
                  Exemple: FREQ=WEEKLY (hebdomadaire), FREQ=MONTHLY (mensuel), COUNT=10 (10 occurrences)
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Annuler</Button>
            <Button 
              onClick={handleUpdateEvent}
              disabled={!eventForm.title || updateEventMutation.isPending}
            >
              {updateEventMutation.isPending ? 'Mise à jour...' : 'Mettre à jour'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Calendar;
