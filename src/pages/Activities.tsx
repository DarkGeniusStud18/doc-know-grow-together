
// Page d'historique de toutes les activités de l'utilisateur
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Book, Calendar, Clock, FileText, MessageSquare, Search } from 'lucide-react';

// Type pour les éléments d'activité
type ActivityItem = {
  id: string;
  type: 'resource' | 'event' | 'course' | 'message' | 'exam';
  title: string;
  description: string;
  date: string;
  icon: React.ElementType;
  category?: string;
};

const Activities = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Données fictives pour la démo
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'resource',
      title: 'Nouvelles ressources ajoutées',
      description: '10 nouveaux documents ont été ajoutés à la base de connaissances',
      date: '2025-05-10T14:30:00',
      icon: Book,
      category: 'Cardiologie'
    },
    {
      id: '2',
      type: 'event',
      title: 'Événement à venir',
      description: 'Webinaire: Les avancées en médecine d\'urgence',
      date: '2025-05-12T18:00:00',
      icon: Calendar
    },
    {
      id: '3',
      type: 'course',
      title: 'Cours complété',
      description: 'Anatomie du système nerveux central - Module 3',
      date: '2025-05-09T10:15:00',
      icon: FileText,
      category: 'Neurologie'
    },
    {
      id: '4',
      type: 'message',
      title: 'Nouvelle discussion',
      description: 'Dr. Martin a répondu à votre question sur le traitement de l\'hypertension',
      date: '2025-05-08T09:45:00',
      icon: MessageSquare
    },
    {
      id: '5',
      type: 'exam',
      title: 'Examen complété',
      description: 'QCM Cardiologie - Score: 78%',
      date: '2025-05-07T16:20:00',
      icon: FileText,
      category: 'Cardiologie'
    },
    {
      id: '6',
      type: 'resource',
      title: 'Document consulté',
      description: 'Guide des protocoles de traitement en oncologie',
      date: '2025-05-06T11:30:00',
      icon: Book,
      category: 'Oncologie'
    },
    {
      id: '7',
      type: 'event',
      title: 'Rappel d\'événement',
      description: 'Conférence: Nouvelles approches en psychiatrie',
      date: '2025-05-15T09:00:00',
      icon: Calendar
    },
    {
      id: '8',
      type: 'exam',
      title: 'Examen planifié',
      description: 'Simulation de cas cliniques - Pneumologie',
      date: '2025-05-14T13:00:00',
      icon: Clock,
      category: 'Pneumologie'
    }
  ];

  // Filtrage des activités en fonction de la recherche et du filtre actif
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'all') {
      return matchesSearch;
    } else {
      return matchesSearch && activity.type === activeFilter;
    }
  });

  // Formatage de la date pour l'affichage
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    }).format(date);
  };

  return (
    <MainLayout>
      <div className="container py-6 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Historique des activités</h1>
          <p className="text-gray-500">Consultez l'ensemble de vos activités récentes sur MedCollab</p>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Rechercher dans vos activités..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Tabs defaultValue="all" className="w-full md:w-auto" value={activeFilter} onValueChange={setActiveFilter}>
            <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full md:w-auto">
              <TabsTrigger value="all">Tout</TabsTrigger>
              <TabsTrigger value="resource">Ressources</TabsTrigger>
              <TabsTrigger value="event">Événements</TabsTrigger>
              <TabsTrigger value="exam">Examens</TabsTrigger>
              <TabsTrigger value="message">Messages</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Liste des activités */}
        <Card>
          <CardHeader>
            <CardTitle>Activités ({filteredActivities.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border-b last:border-b-0 hover:bg-gray-50 rounded-md transition-colors">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 
                      ${activity.type === 'resource' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'event' ? 'bg-purple-100 text-purple-600' :
                        activity.type === 'course' ? 'bg-green-100 text-green-600' :
                        activity.type === 'message' ? 'bg-amber-100 text-amber-600' :
                        'bg-red-100 text-red-600'}`}>
                      <activity.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                        <h3 className="font-medium">{activity.title}</h3>
                        <span className="text-xs text-gray-500">{formatDate(activity.date)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      {activity.category && (
                        <div className="mt-2">
                          <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {activity.category}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">Aucune activité ne correspond à votre recherche</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery('');
                      setActiveFilter('all');
                    }}
                    className="mt-2"
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Activities;
