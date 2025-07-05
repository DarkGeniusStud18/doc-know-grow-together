
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar as CalendarIcon, Plus, Clock, MapPin, 
  Users, ChevronLeft, ChevronRight, Filter,
  List, Grid3X3, Search
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';

const Calendar = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [searchTerm, setSearchTerm] = useState('');

  // Récupération des événements
  const { data: events, isLoading } = useQuery({
    queryKey: ['calendar-events', format(currentDate, 'yyyy-MM')],
    queryFn: async () => {
      if (!user) return [];
      
      const startDate = startOfMonth(currentDate);
      const endDate = endOfMonth(currentDate);
      
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id)
        .gte('start_date', startDate.toISOString())
        .lte('end_date', endDate.toISOString())
        .order('start_date');
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const getEventsForDate = (date: Date) => {
    return events?.filter(event => 
      isSameDay(new Date(event.start_date), date)
    ) || [];
  };

  const filteredEvents = events?.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const EventCard = ({ event }: { event: any }) => (
    <Card className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-medical-blue">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-sm sm:text-base line-clamp-1 group-hover:text-medical-blue">
            {event.title}
          </h3>
          <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
            {event.type}
          </Badge>
        </div>
        
        {event.description && (
          <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
            {event.description}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-gray-500">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
            <span>{format(new Date(event.start_date), 'HH:mm', { locale: fr })}</span>
          </div>
          
          {event.location && (
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const CalendarDay = ({ date }: { date: Date }) => {
    const dayEvents = getEventsForDate(date);
    const isSelected = isSameDay(date, selectedDate);
    const isCurrentDay = isToday(date);
    
    return (
      <div
        onClick={() => setSelectedDate(date)}
        className={`
          min-h-[60px] sm:min-h-[80px] p-1 sm:p-2 border border-gray-200 cursor-pointer
          hover:bg-gray-50 transition-colors relative
          ${isSelected ? 'bg-medical-blue/10 border-medical-blue' : ''}
          ${isCurrentDay ? 'bg-medical-teal/5' : ''}
        `}
      >
        <div className="flex items-center justify-between mb-1">
          <span className={`
            text-xs sm:text-sm font-medium
            ${isCurrentDay ? 'text-medical-teal font-bold' : 'text-gray-700'}
            ${isSelected ? 'text-medical-blue' : ''}
          `}>
            {format(date, 'd')}
          </span>
          
          {dayEvents.length > 0 && (
            <Badge variant="secondary" className="text-xs h-4 px-1">
              {dayEvents.length}
            </Badge>
          )}
        </div>
        
        <div className="space-y-1">
          {dayEvents.slice(0, 2).map((event, index) => (
            <div
              key={event.id}
              className="text-xs p-1 bg-medical-blue/20 text-medical-blue rounded truncate"
            >
              {event.title}
            </div>
          ))}
          
          {dayEvents.length > 2 && (
            <div className="text-xs text-gray-500 text-center">
              +{dayEvents.length - 2} autres
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <MainLayout requireAuth={true}>
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
        {/* Header responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-medical-navy mb-2">
              Calendrier
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Gérez vos événements et rendez-vous
            </p>
          </div>
          
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Nouvel événement
          </Button>
        </div>

        {/* Contrôles de navigation et recherche */}
        <div className="bg-white rounded-lg border p-4 mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Navigation mois */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="h-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <h2 className="text-lg font-semibold min-w-[140px] text-center">
                {format(currentDate, 'MMMM yyyy', { locale: fr })}
              </h2>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="h-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Modes d'affichage */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-8 w-full sm:w-48"
                />
              </div>
              
              <div className="hidden sm:flex border rounded-md">
                <Button
                  variant={viewMode === 'calendar' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode('calendar')}
                  className="h-8 rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'calendar' | 'list')} className="sm:hidden mb-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              Calendrier
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Liste
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Contenu principal */}
        {viewMode === 'calendar' ? (
          <div className="bg-white rounded-lg border overflow-hidden">
            {/* En-têtes des jours */}
            <div className="grid grid-cols-7 border-b bg-gray-50">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                <div key={day} className="p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-gray-700">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Grille du calendrier */}
            <div className="grid grid-cols-7">
              {monthDays.map((date) => (
                <CalendarDay key={date.toString()} date={date} />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <div className="text-center py-12">
                <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun événement
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm 
                    ? 'Aucun événement ne correspond à votre recherche'
                    : 'Aucun événement prévu pour ce mois'
                  }
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un événement
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Événements du jour sélectionné (vue calendrier seulement) */}
        {viewMode === 'calendar' && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">
              Événements du {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
            </h3>
            
            <div className="space-y-3">
              {getEventsForDate(selectedDate).length > 0 ? (
                getEventsForDate(selectedDate).map((event) => (
                  <EventCard key={event.id} event={event} />
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Aucun événement prévu pour cette date
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Calendar;
