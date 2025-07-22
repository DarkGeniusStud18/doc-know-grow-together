/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * 📚 Page Groupes d'Étude - Gestion complète des groupes d'étude
 * Fonctionnalités : création, modification, suppression, gestion des membres
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Users, Plus, Settings, UserPlus, MessageSquare, BookOpen, Calendar, Search, Filter } from 'lucide-react';

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  subject: string;
  creator_id: string;
  is_private: boolean;
  max_members: number;
  created_at: string;
  updated_at: string;
  member_count: number;
  is_member: boolean;
  user_role: string;
  study_group_members: any[];
}

const StudyGroups: React.FC = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [myGroups, setMyGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    subject: '',
    is_private: false,
    max_members: 10
  });

  // Sujets disponibles pour les groupes d'étude
  const subjects = [
    { value: 'all', label: 'Tous les sujets' },
    { value: 'anatomie', label: 'Anatomie' },
    { value: 'physiologie', label: 'Physiologie' },
    { value: 'pharmacologie', label: 'Pharmacologie' },
    { value: 'pathologie', label: 'Pathologie' },
    { value: 'cardiologie', label: 'Cardiologie' },
    { value: 'neurologie', label: 'Neurologie' },
    { value: 'chirurgie', label: 'Chirurgie' },
    { value: 'medecine_generale', label: 'Médecine générale' },
    { value: 'pediatrie', label: 'Pédiatrie' },
    { value: 'gynecologie', label: 'Gynécologie' },
    { value: 'psychiatrie', label: 'Psychiatrie' },
    { value: 'autre', label: 'Autre' }
  ];

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      
      // Récupérer tous les groupes avec les informations des membres
      const { data: groupsData, error: groupsError } = await supabase
        .from('study_groups')
        .select(`
          *,
          study_group_members (
            id,
            user_id,
            role,
            joined_at,
            profiles (
              display_name,
              email
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (groupsError) throw groupsError;

      if (groupsData) {
        // Traiter les données pour calculer le nombre de membres et le statut utilisateur
        const processedGroups = groupsData.map(group => {
          const memberCount = group.study_group_members?.length || 0;
          const currentUserMembership = group.study_group_members?.find(
            member => member.user_id === user?.id
          );
          
          return {
            ...group,
            member_count: memberCount,
            is_member: !!currentUserMembership,
            user_role: currentUserMembership?.role || 'none',
            subject: group.subject || 'Non spécifié' // Gérer les cas où subject est null
          };
        });

        setGroups(processedGroups);
        
        // Filtrer les groupes où l'utilisateur est membre
        if (user) {
          const userGroups = processedGroups.filter(group => group.is_member);
          setMyGroups(userGroups);
        }
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des groupes:', error);
      toast.error('Erreur lors du chargement des groupes');
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour créer un groupe');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('study_groups')
        .insert([
          {
            ...newGroup,
            creator_id: user.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        // Ajouter le créateur comme membre admin
        await supabase
          .from('study_group_members')
          .insert([
            {
              group_id: data.id,
              user_id: user.id,
              role: 'admin'
            }
          ]);

        toast.success('Groupe créé avec succès !');
        setIsCreateDialogOpen(false);
        setNewGroup({
          name: '',
          description: '',
          subject: '',
          is_private: false,
          max_members: 10
        });
        fetchGroups();
      }
    } catch (error: any) {
      console.error('Erreur lors de la création du groupe:', error);
      toast.error('Erreur lors de la création du groupe');
    }
  };

  const joinGroup = async (groupId: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour rejoindre un groupe');
      return;
    }

    try {
      const { error } = await supabase
        .from('study_group_members')
        .insert([
          {
            group_id: groupId,
            user_id: user.id,
            role: 'member'
          }
        ]);

      if (error) throw error;

      toast.success('Vous avez rejoint le groupe !');
      fetchGroups();
    } catch (error: any) {
      console.error('Erreur lors de l\'adhésion au groupe:', error);
      toast.error('Erreur lors de l\'adhésion au groupe');
    }
  };

  const leaveGroup = async (groupId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('study_group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Vous avez quitté le groupe');
      fetchGroups();
    } catch (error: any) {
      console.error('Erreur lors de la sortie du groupe:', error);
      toast.error('Erreur lors de la sortie du groupe');
    }
  };

  const deleteGroup = async (groupId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('study_groups')
        .delete()
        .eq('id', groupId)
        .eq('creator_id', user.id);

      if (error) throw error;

      toast.success('Groupe supprimé avec succès');
      fetchGroups();
    } catch (error: any) {
      console.error('Erreur lors de la suppression du groupe:', error);
      toast.error('Erreur lors de la suppression du groupe');
    }
  };

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || group.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-blue mx-auto mb-4"></div>
          <p className="text-lg">Chargement des groupes d'étude...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* En-tête avec titre et bouton de création */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-medical-navy flex items-center gap-3">
            <Users className="h-8 w-8 text-medical-blue" />
            Groupes d'Étude
          </h1>
          <p className="text-gray-600 mt-2">
            Rejoignez des groupes d'étude ou créez le vôtre pour étudier ensemble
          </p>
        </div>

        {user && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-medical-blue hover:bg-medical-blue/90 w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Créer un Groupe
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Créer un nouveau groupe d'étude</DialogTitle>
                <DialogDescription>
                  Remplissez les informations pour créer votre groupe d'étude
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nom du groupe</label>
                  <Input
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    placeholder="Entrez le nom du groupe"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                    placeholder="Décrivez votre groupe d'étude"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Sujet</label>
                  <Select value={newGroup.subject} onValueChange={(value) => setNewGroup({ ...newGroup, subject: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisissez un sujet" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.filter(s => s.value !== 'all').map(subject => (
                        <SelectItem key={subject.value} value={subject.value}>
                          {subject.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Nombre maximum de membres</label>
                  <Input
                    type="number"
                    value={newGroup.max_members}
                    onChange={(e) => setNewGroup({ ...newGroup, max_members: parseInt(e.target.value) || 10 })}
                    min={2}
                    max={50}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={createGroup} disabled={!newGroup.name || !newGroup.subject}>
                    Créer le Groupe
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Mes groupes */}
      {user && myGroups.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-medical-navy">Mes Groupes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {group.user_role === 'admin' ? 'Admin' : 'Membre'}
                    </Badge>
                  </div>
                  <CardDescription>{group.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen className="h-4 w-4" />
                      <span>{group.subject}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{group.member_count} membre(s)</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Chat
                      </Button>
                      {group.user_role === 'admin' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteGroup(group.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Supprimer
                        </Button>
                      )}
                      {group.user_role !== 'admin' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => leaveGroup(group.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Quitter
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Filtres de recherche */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher des groupes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {subjects.map(subject => (
              <SelectItem key={subject.value} value={subject.value}>
                {subject.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tous les groupes */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-medical-navy">
          Tous les Groupes ({filteredGroups.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGroups.map((group) => (
            <Card key={group.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <div className="flex gap-2">
                    {group.is_private && (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                        Privé
                      </Badge>
                    )}
                    <Badge className="bg-blue-100 text-blue-800">
                      {group.subject}
                    </Badge>
                  </div>
                </div>
                <CardDescription>{group.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{group.member_count}/{group.max_members} membres</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Créé le {new Date(group.created_at).toLocaleDateString('fr-FR')}
                  </div>
                  
                  {user && (
                    <div className="flex gap-2">
                      {group.is_member ? (
                        <Button size="sm" variant="outline" className="flex-1">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Accéder
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => joinGroup(group.id)}
                          disabled={group.member_count >= group.max_members}
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          {group.member_count >= group.max_members ? 'Complet' : 'Rejoindre'}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGroups.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Aucun groupe trouvé
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedSubject !== 'all'
                  ? 'Aucun groupe ne correspond à vos critères de recherche'
                  : 'Aucun groupe d\'étude disponible pour le moment'
                }
              </p>
              {user && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer le premier groupe
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudyGroups;
