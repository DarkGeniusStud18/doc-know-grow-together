
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { Users, Search, Plus, Clock, Calendar, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

type StudyGroup = {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  is_private: boolean;
  max_participants: number;
  created_at: string;
  owner_name?: string;
  member_count?: number;
};

const StudyGroups: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    isPrivate: false,
    maxParticipants: 50
  });
  const [isCreating, setIsCreating] = useState(false);

  const fetchStudyGroups = async () => {
    if (!user) return [];
    
    console.log("Fetching study groups...");
    
    try {
      // First fetch the study groups
      const { data: groups, error: groupsError } = await supabase
        .from('study_groups')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (groupsError) {
        console.error("Error fetching study groups:", groupsError);
        throw new Error(`Error fetching study groups: ${groupsError.message}`);
      }
      
      console.log("Fetched groups:", groups);
      
      // Then for each group, fetch the owner's profile and member count
      const enrichedGroups = await Promise.all((groups || []).map(async (group) => {
        try {
          // Get owner profile
          const { data: ownerProfile, error: profileError } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('id', group.owner_id)
            .single();
          
          if (profileError) {
            console.error("Error fetching owner profile:", profileError);
          }
          
          // Get member count
          const { data: members, error: membersError } = await supabase
            .from('study_group_members')
            .select('id');
            
          if (membersError) {
            console.error("Error fetching members:", membersError);
          }
          
          return {
            ...group,
            owner_name: profileError ? 'Unknown' : ownerProfile?.display_name,
            member_count: membersError ? 0 : (members?.length || 0)
          };
        } catch (err) {
          console.error("Error enriching group:", err);
          return {
            ...group,
            owner_name: 'Unknown',
            member_count: 0
          };
        }
      }));
      
      console.log("Enriched groups:", enrichedGroups);
      return enrichedGroups;
    } catch (error) {
      console.error("Error in fetchStudyGroups:", error);
      toast.error("Erreur lors du chargement des groupes d'étude");
      return [];
    }
  };

  const { data: studyGroups = [], isLoading, error, refetch } = useQuery({
    queryKey: ['studyGroups'],
    queryFn: fetchStudyGroups
  });

  const filteredGroups = studyGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateGroup = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour créer un groupe');
      return;
    }
    
    // Validation
    if (!newGroup.name.trim()) {
      toast.error('Le nom du groupe est requis');
      return;
    }

    if (!newGroup.description.trim()) {
      toast.error('La description du groupe est requise');
      return;
    }

    setIsCreating(true);
    
    try {
      console.log("Creating study group with data:", {
        name: newGroup.name,
        description: newGroup.description,
        owner_id: user.id,
        is_private: newGroup.isPrivate,
        max_participants: newGroup.maxParticipants
      });
      
      // First, create the study group
      const { data, error } = await supabase
        .from('study_groups')
        .insert({
          name: newGroup.name,
          description: newGroup.description,
          owner_id: user.id,
          is_private: newGroup.isPrivate,
          max_participants: newGroup.maxParticipants
        })
        .select();
        
      if (error) {
        console.error("Error creating study group:", error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        throw new Error('Failed to create study group: No data returned');
      }
      
      const newGroupId = data[0].id;
      console.log("Study group created with ID:", newGroupId);
      
      // Add creator as member with admin role
      const { error: memberError } = await supabase
        .from('study_group_members')
        .insert({
          group_id: newGroupId,
          user_id: user.id,
          role: 'admin'
        });
        
      if (memberError) {
        console.error("Error adding creator as member:", memberError);
        throw memberError;
      }
      
      toast.success('Groupe d\'étude créé avec succès');
      setShowDialog(false);
      
      // Reset form
      setNewGroup({
        name: '',
        description: '',
        isPrivate: false,
        maxParticipants: 50
      });
      
      // Refresh the study groups list
      refetch();
      
      // Navigate to the new group
      navigate(`/study-groups/${newGroupId}`);
      
    } catch (error) {
      console.error('Error creating study group:', error);
      toast.error('Erreur lors de la création du groupe');
    } finally {
      setIsCreating(false);
    }
  };

  const joinGroup = async (groupId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('study_group_members')
        .insert({
          group_id: groupId,
          user_id: user.id,
          role: 'member'
        });
        
      if (error) throw error;
      
      toast.success('Vous avez rejoint le groupe d\'étude');
      refetch();
    } catch (error) {
      console.error('Error joining study group:', error);
      toast.error('Erreur lors de l\'ajout au groupe');
    }
  };
  
  if (!user) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-semibold mb-4">Connexion requise</h1>
          <p className="text-gray-600 mb-6">Veuillez vous connecter pour accéder aux groupes d'étude.</p>
          <Button onClick={() => navigate('/login')} className="hover-scale hover:bg-primary/90">Se connecter</Button>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-medical-navy">Groupes d'étude</h1>
            <p className="text-gray-500 mt-1">
              Collaborez avec d'autres étudiants et professionnels
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher des groupes..."
                className="pl-9 w-full sm:w-64 transition-all focus:ring-2 focus:ring-primary/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button className="hover-scale hover:bg-primary/90 transition-all duration-300">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un groupe
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Créer un groupe d'étude</DialogTitle>
                  <DialogDescription>
                    Définissez les détails de votre groupe d'étude collaboratif
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom du groupe</Label>
                    <Input 
                      id="name" 
                      placeholder="Ex: Cardiologie avancée"
                      value={newGroup.name}
                      onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                      className="transition-all focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Décrivez le but de ce groupe d'étude..."
                      value={newGroup.description}
                      onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                      className="transition-all focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="private"
                      checked={newGroup.isPrivate}
                      onCheckedChange={(checked) => setNewGroup({...newGroup, isPrivate: checked})}
                    />
                    <Label htmlFor="private" className="cursor-pointer">Groupe privé</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxParticipants">Nombre maximum de participants</Label>
                    <Input 
                      id="maxParticipants" 
                      type="number"
                      min="2"
                      max="100"
                      value={newGroup.maxParticipants}
                      onChange={(e) => setNewGroup({...newGroup, maxParticipants: parseInt(e.target.value) || 50})}
                      className="transition-all focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDialog(false)} className="hover-scale">Annuler</Button>
                  <Button 
                    onClick={handleCreateGroup}
                    disabled={!newGroup.name || !newGroup.description || isCreating}
                    className="hover-scale hover:bg-primary/90"
                  >
                    {isCreating ? 'Création...' : 'Créer'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-teal"></div>
          </div>
        ) : error ? (
          <Card className="hover-lift">
            <CardContent className="flex flex-col items-center justify-center py-12">
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
              <h3 className="text-xl font-medium">Erreur lors du chargement des groupes</h3>
              <p className="text-gray-500 mt-2">Veuillez réessayer plus tard</p>
              <Button className="mt-4 hover-scale" onClick={() => refetch()}>Réessayer</Button>
            </CardContent>
          </Card>
        ) : filteredGroups.length === 0 ? (
          <Card className="hover-lift">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="bg-gray-100 rounded-full p-6 mb-4">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium">Aucun groupe d'étude trouvé</h3>
              <p className="text-gray-500 mt-2">Créez votre premier groupe ou modifiez votre recherche</p>
              <Button className="mt-6 hover-scale hover:bg-primary/90" onClick={() => setShowDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Créer un groupe
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in">
            {filteredGroups.map((group) => (
              <Card key={group.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 hover-lift">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    {group.is_private && (
                      <Badge variant="secondary" className="mb-2">
                        <Shield className="h-3 w-3 mr-1" />
                        Privé
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{group.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{group.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 opacity-70" />
                      <span>{group.member_count} membre{group.member_count !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 opacity-70" />
                      <span>{new Date(group.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  <div className="mt-3 text-sm">
                    <span className="text-gray-600">Créé par: </span>
                    <span className="font-medium">{group.owner_name || 'Utilisateur'}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex gap-2">
                  <Button variant="outline" className="w-full hover-scale" onClick={() => navigate(`/study-groups/${group.id}`)}>
                    Voir le groupe
                  </Button>
                  {group.owner_id !== user.id && !studyGroups.some(g => g.id === group.id && g.member_count && g.member_count > 0) && (
                    <Button 
                      className="hover-scale" 
                      onClick={() => joinGroup(group.id)}
                    >
                      Rejoindre
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default StudyGroups;
