
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { Users, MessageSquare, FileText, Settings, UserPlus, Edit, Trash2, Calendar } from 'lucide-react';
import GroupMembers from '@/components/study-groups/GroupMembers';
import GroupDiscussions from '@/components/study-groups/GroupDiscussions';
import GroupResources from '@/components/study-groups/GroupResources';
import GroupSettings from '@/components/study-groups/GroupSettings';

type StudyGroup = {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  is_private: boolean;
  max_participants: number;
  created_at: string;
};

type Member = {
  id: string;
  user_id: string;
  group_id: string;
  role: string;
  joined_at: string;
  profile?: {
    display_name: string;
    profile_image?: string;
  };
};

const StudyGroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [group, setGroup] = useState<StudyGroup | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedGroup, setEditedGroup] = useState<Partial<StudyGroup>>({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (!id || !user) return;
    
    const fetchGroupDetails = async () => {
      setIsLoading(true);
      try {
        // Fetch group details
        const { data: groupData, error: groupError } = await supabase
          .from('study_groups')
          .select('*')
          .eq('id', id)
          .single();
          
        if (groupError) throw groupError;
        
        // Fetch group members with profiles
        const { data: membersData, error: membersError } = await supabase
          .from('study_group_members')
          .select(`
            *,
            profile:user_id(
              display_name,
              profile_image
            )
          `)
          .eq('group_id', id);
          
        if (membersError) throw membersError;
        
        // Check user role in this group
        const currentUserMembership = membersData.find(
          (member) => member.user_id === user.id
        );
        
        setGroup(groupData);
        setMembers(membersData);
        setUserRole(currentUserMembership?.role || null);
        setEditedGroup({
          name: groupData.name,
          description: groupData.description,
          is_private: groupData.is_private,
          max_participants: groupData.max_participants
        });
      } catch (error) {
        console.error('Error fetching study group details:', error);
        toast.error('Erreur lors du chargement du groupe d\'étude');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGroupDetails();
  }, [id, user]);
  
  const isAdmin = userRole === 'admin';
  const isModerator = userRole === 'moderator';
  const canManageGroup = isAdmin || isModerator;
  
  const handleSaveChanges = async () => {
    if (!group || !canManageGroup) return;
    
    try {
      const { error } = await supabase
        .from('study_groups')
        .update({
          name: editedGroup.name,
          description: editedGroup.description,
          is_private: editedGroup.is_private,
          max_participants: editedGroup.max_participants
        })
        .eq('id', group.id);
        
      if (error) throw error;
      
      setGroup({
        ...group,
        name: editedGroup.name || group.name,
        description: editedGroup.description || group.description,
        is_private: editedGroup.is_private ?? group.is_private,
        max_participants: editedGroup.max_participants || group.max_participants
      });
      
      setIsEditing(false);
      toast.success('Groupe mis à jour avec succès');
    } catch (error) {
      console.error('Error updating group:', error);
      toast.error('Erreur lors de la mise à jour du groupe');
    }
  };
  
  const handleDeleteGroup = async () => {
    if (!group || !isAdmin) return;
    
    try {
      const { error } = await supabase
        .from('study_groups')
        .delete()
        .eq('id', group.id);
        
      if (error) throw error;
      
      toast.success('Groupe supprimé avec succès');
      navigate('/study-groups');
    } catch (error) {
      console.error('Error deleting group:', error);
      toast.error('Erreur lors de la suppression du groupe');
    }
  };
  
  const joinGroup = async () => {
    if (!user || !group) return;
    
    try {
      const { error } = await supabase
        .from('study_group_members')
        .insert({
          group_id: group.id,
          user_id: user.id,
          role: 'member'
        });
        
      if (error) throw error;
      
      toast.success('Vous avez rejoint le groupe d\'étude');
      setUserRole('member');
    } catch (error) {
      console.error('Error joining group:', error);
      toast.error('Erreur lors de l\'ajout au groupe');
    }
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-teal"></div>
        </div>
      </MainLayout>
    );
  }
  
  if (!group) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-2xl font-bold mb-4">Groupe non trouvé</h2>
          <p className="text-gray-500 mb-6">Le groupe d'étude que vous recherchez n'existe pas ou a été supprimé.</p>
          <Button onClick={() => navigate('/study-groups')}>Retourner aux groupes</Button>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row justify-between gap-6 items-start">
          <div className="w-full lg:w-3/4">
            {isEditing ? (
              <Card>
                <CardHeader>
                  <CardTitle>Modifier le groupe d'étude</CardTitle>
                  <CardDescription>Modifiez les informations du groupe</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nom du groupe</label>
                    <Input
                      value={editedGroup.name || ''}
                      onChange={(e) => setEditedGroup({ ...editedGroup, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={editedGroup.description || ''}
                      onChange={(e) => setEditedGroup({ ...editedGroup, description: e.target.value })}
                      rows={5}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="private"
                      checked={editedGroup.is_private || false}
                      onChange={(e) => setEditedGroup({ ...editedGroup, is_private: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="private" className="text-sm font-medium cursor-pointer">Groupe privé</label>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nombre maximum de participants</label>
                    <Input
                      type="number"
                      min="2"
                      max="100"
                      value={editedGroup.max_participants || 50}
                      onChange={(e) => setEditedGroup({ ...editedGroup, max_participants: parseInt(e.target.value) })}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Annuler</Button>
                  <Button onClick={handleSaveChanges}>Enregistrer</Button>
                </CardFooter>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold">{group.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        {group.is_private && (
                          <Badge variant="secondary">Privé</Badge>
                        )}
                        <Badge variant="outline">
                          {members.length} membre{members.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </div>
                    {canManageGroup && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                          <Edit size={16} className="mr-1" /> Modifier
                        </Button>
                        {isAdmin && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => setShowDeleteDialog(true)}
                          >
                            <Trash2 size={16} className="mr-1" /> Supprimer
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{group.description}</p>
                </CardContent>
                {!userRole && (
                  <CardFooter>
                    <Button onClick={joinGroup} className="w-full">Rejoindre le groupe</Button>
                  </CardFooter>
                )}
              </Card>
            )}
            
            {userRole && (
              <Tabs defaultValue="discussions" className="mt-6">
                <TabsList className="mb-4 flex flex-wrap gap-2">
                  <TabsTrigger value="discussions">
                    <MessageSquare size={16} className="mr-2" /> Discussions
                  </TabsTrigger>
                  <TabsTrigger value="resources">
                    <FileText size={16} className="mr-2" /> Ressources
                  </TabsTrigger>
                  <TabsTrigger value="members">
                    <Users size={16} className="mr-2" /> Membres
                  </TabsTrigger>
                  <TabsTrigger value="calendar">
                    <Calendar size={16} className="mr-2" /> Calendrier
                  </TabsTrigger>
                  {canManageGroup && (
                    <TabsTrigger value="settings">
                      <Settings size={16} className="mr-2" /> Paramètres
                    </TabsTrigger>
                  )}
                </TabsList>
                
                <TabsContent value="discussions">
                  <GroupDiscussions groupId={group.id} userRole={userRole} />
                </TabsContent>
                
                <TabsContent value="resources">
                  <GroupResources groupId={group.id} userRole={userRole} />
                </TabsContent>
                
                <TabsContent value="members">
                  <GroupMembers 
                    groupId={group.id} 
                    members={members} 
                    userRole={userRole}
                    canManage={canManageGroup}
                    onMembersChange={setMembers}
                  />
                </TabsContent>
                
                <TabsContent value="calendar">
                  <Card>
                    <CardHeader>
                      <CardTitle>Calendrier du groupe</CardTitle>
                      <CardDescription>Planifiez des événements avec le groupe</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-500">Fonctionnalité en développement</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {canManageGroup && (
                  <TabsContent value="settings">
                    <GroupSettings 
                      group={group} 
                      isAdmin={isAdmin} 
                      onGroupUpdate={setGroup} 
                    />
                  </TabsContent>
                )}
              </Tabs>
            )}
          </div>
          
          <div className="w-full lg:w-1/4 space-y-6">
            {userRole === 'admin' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Gestion du groupe</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" size="sm">
                    <UserPlus size={16} className="mr-2" /> Inviter des membres
                  </Button>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">À propos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm">
                  <p className="text-gray-500">Créé le</p>
                  <p>{new Date(group.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500">Type</p>
                  <p>{group.is_private ? 'Privé' : 'Public'}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500">Nombre maximum de membres</p>
                  <p>{group.max_participants}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Membres actifs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {members.slice(0, 5).map((member) => (
                    <Avatar key={member.id} className="border-2 border-white">
                      <AvatarImage src={member.profile?.profile_image} />
                      <AvatarFallback className="bg-medical-teal text-white">
                        {member.profile?.display_name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {members.length > 5 && (
                    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                      +{members.length - 5}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce groupe d'étude ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Annuler</Button>
            <Button variant="destructive" onClick={handleDeleteGroup}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default StudyGroupDetail;
