
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
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/sonner';
import { Search, Plus, Users, Lock, Globe, Calendar, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type StudyGroup = {
  id: string;
  name: string;
  description: string;
  creator_id: string;
  is_private: boolean;
  max_members: number;
  created_at: string;
  member_count?: number;
  is_member?: boolean;
  user_role?: string;
};

const StudyGroups: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_private: false,
    max_members: 20
  });

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setLoading(true);
      
      // Get all groups with member count
      const { data: groupsData, error: groupsError } = await supabase
        .from('study_groups')
        .select(`
          *,
          study_group_members!inner(count)
        `);

      if (groupsError) throw groupsError;

      // For each group, get member count and check if current user is a member
      const enrichedGroups = await Promise.all(
        (groupsData || []).map(async (group) => {
          // Get member count
          const { count: memberCount } = await supabase
            .from('study_group_members')
            .select('*', { count: 'exact', head: true })
            .eq('group_id', group.id);

          // Check if current user is a member
          const { data: memberData } = await supabase
            .from('study_group_members')
            .select('role')
            .eq('group_id', group.id)
            .eq('user_id', user?.id)
            .single();

          return {
            ...group,
            member_count: memberCount || 0,
            is_member: !!memberData,
            user_role: memberData?.role || null
          };
        })
      );

      setGroups(enrichedGroups);
    } catch (error) {
      console.error('Error loading groups:', error);
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

    if (!formData.name.trim()) {
      toast.error('Le nom du groupe est requis');
      return;
    }

    try {
      // Create the group
      const { data: groupData, error: groupError } = await supabase
        .from('study_groups')
        .insert({
          name: formData.name,
          description: formData.description,
          creator_id: user.id,
          is_private: formData.is_private,
          max_members: formData.max_members
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Add creator as admin member
      const { error: memberError } = await supabase
        .from('study_group_members')
        .insert({
          group_id: groupData.id,
          user_id: user.id,
          role: 'admin'
        });

      if (memberError) throw memberError;

      toast.success('Groupe créé avec succès');
      setShowCreateDialog(false);
      setFormData({ name: '', description: '', is_private: false, max_members: 20 });
      loadGroups();
    } catch (error) {
      console.error('Error creating group:', error);
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
        .insert({
          group_id: groupId,
          user_id: user.id,
          role: 'member'
        });

      if (error) throw error;

      toast.success('Vous avez rejoint le groupe');
      loadGroups();
    } catch (error) {
      console.error('Error joining group:', error);
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
      loadGroups();
    } catch (error) {
      console.error('Error leaving group:', error);
      toast.error('Erreur lors de la sortie du groupe');
    }
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-teal"></div>
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
              Rejoignez ou créez des groupes d'étude collaboratifs
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher des groupes..."
                className="pl-9 w-full sm:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un groupe
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Créer un nouveau groupe d'étude</DialogTitle>
                  <DialogDescription>
                    Créez un espace de collaboration pour étudier ensemble
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom du groupe</Label>
                    <Input 
                      id="name" 
                      placeholder="Nom du groupe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Description du groupe..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxMembers">Nombre maximum de membres</Label>
                    <Input 
                      id="maxMembers" 
                      type="number"
                      min="5"
                      max="100"
                      value={formData.max_members}
                      onChange={(e) => setFormData({...formData, max_members: parseInt(e.target.value) || 20})}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="isPrivate" 
                      checked={formData.is_private}
                      onCheckedChange={(checked) => setFormData({...formData, is_private: checked})}
                    />
                    <Label htmlFor="isPrivate">Groupe privé</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Annuler</Button>
                  <Button onClick={createGroup} disabled={!formData.name.trim()}>
                    Créer le groupe
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {filteredGroups.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="bg-gray-100 rounded-full p-6 mb-4">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium">Aucun groupe trouvé</h3>
              <p className="text-gray-500 mt-2">Créez le premier groupe d'étude</p>
              <Button className="mt-6" onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Créer un groupe
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <Card key={group.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <div className="flex items-center space-x-1">
                      {group.is_private ? (
                        <Lock className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Globe className="h-4 w-4 text-gray-400" />
                      )}
                      {group.user_role === 'admin' && (
                        <Badge variant="secondary">Admin</Badge>
                      )}
                    </div>
                  </div>
                  {group.description && (
                    <CardDescription className="line-clamp-2">
                      {group.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{group.member_count || 0} membre{(group.member_count || 0) !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{new Date(group.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-3">
                  {group.is_member ? (
                    <div className="flex gap-2 w-full">
                      <Button 
                        className="flex-1"
                        onClick={() => navigate(`/study-groups/${group.id}`)}
                      >
                        Accéder au groupe
                      </Button>
                      {group.user_role !== 'admin' && (
                        <Button 
                          variant="outline"
                          onClick={() => leaveGroup(group.id)}
                        >
                          Quitter
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Button 
                      className="w-full"
                      onClick={() => joinGroup(group.id)}
                      disabled={(group.member_count || 0) >= group.max_members}
                    >
                      {(group.member_count || 0) >= group.max_members ? 'Groupe complet' : 'Rejoindre'}
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
