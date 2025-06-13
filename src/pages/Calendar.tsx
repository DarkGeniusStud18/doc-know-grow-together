
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { Plus, Calendar as CalendarIcon, Clock, Edit, Trash2 } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  created_at: string;
}

const Calendar: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: ''
  });

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Erreur lors du chargement des événements');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    if (!formData.title.trim() || !formData.start_time || !formData.end_time) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (new Date(formData.start_time) >= new Date(formData.end_time)) {
      toast.error('L\'heure de fin doit être après l\'heure de début');
      return;
    }

    try {
      if (editingEvent) {
        // Update existing event
        const { error } = await supabase
          .from('calendar_events')
          .update({
            title: formData.title,
            description: formData.description,
            start_time: formData.start_time,
            end_time: formData.end_time,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingEvent.id)
          .eq('user_id', user.id);

        if (error) throw error;
        toast.success('Événement mis à jour avec succès');
      } else {
        // Create new event
        const { error } = await supabase
          .from('calendar_events')
          .insert({
            user_id: user.id,
            title: formData.title,
            description: formData.description,
            start_time: formData.start_time,
            end_time: formData.end_time
          });

        if (error) throw error;
        toast.success('Événement créé avec succès');
      }

      setShowDialog(false);
      setEditingEvent(null);
      setFormData({ title: '', description: '', start_time: '', end_time: '' });
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (event: CalendarEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      start_time: event.start_time.slice(0, 16), // Format for datetime-local input
      end_time: event.end_time.slice(0, 16)
    });
    setShowDialog(true);
  };

  const handleDelete = async (eventId: string) => {
    if (!user) return;
    
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', eventId)
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success('Événement supprimé avec succès');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleNewEvent = () => {
    setEditingEvent(null);
    setFormData({ title: '', description: '', start_time: '', end_time: '' });
    setShowDialog(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isUpcoming = (startTime: string) => {
    return new Date(startTime) > new Date();
  };

  if (loading) {
    return (
      <MainLayout requireAuth={true}>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <p className="text-lg">Chargement du calendrier...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout requireAuth={true}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-medical-navy">Calendrier</h1>
            <p className="text-gray-600 mt-2">
              Planifiez et organisez vos événements d'étude
            </p>
          </div>
          
          <Button onClick={handleNewEvent}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel événement
          </Button>
        </div>

        {/* Events List */}
        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id} className={`hover:shadow-lg transition-shadow ${isUpcoming(event.start_time) ? 'border-l-4 border-l-medical-teal' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-medical-teal" />
                        {event.title}
                        {isUpcoming(event.start_time) && (
                          <span className="bg-medical-teal text-white text-xs px-2 py-1 rounded-full">À venir</span>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <Clock className="h-4 w-4" />
                        Du {formatDate(event.start_time)} au {formatDate(event.end_time)}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(event)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(event.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {event.description && (
                  <CardContent>
                    <p className="text-gray-700">{event.description}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun événement planifié
            </h3>
            <p className="text-gray-500 mb-6">
              Commencez par créer votre premier événement
            </p>
            <Button onClick={handleNewEvent}>
              <Plus className="h-4 w-4 mr-2" />
              Créer mon premier événement
            </Button>
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? 'Modifier l\'événement' : 'Nouvel événement'}
              </DialogTitle>
              <DialogDescription>
                {editingEvent ? 'Modifiez votre événement' : 'Planifiez un nouvel événement dans votre calendrier'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Titre de l'événement..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_time">Début</Label>
                  <Input
                    id="start_time"
                    type="datetime-local"
                    value={formData.start_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_time">Fin</Label>
                  <Input
                    id="end_time"
                    type="datetime-local"
                    value={formData.end_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (optionnelle)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description de l'événement..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Annuler
              </Button>
              <Button onClick={handleSubmit} disabled={!formData.title.trim() || !formData.start_time || !formData.end_time}>
                {editingEvent ? 'Mettre à jour' : 'Créer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Calendar;
