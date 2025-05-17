import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { UserPlus, Mail, Search, Shield, UserMinus } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

interface Profile {
  display_name: string;
  profile_image?: string;
}

type Member = {
  id: string;
  user_id: string;
  group_id: string;
  role: string;
  joined_at: string;
  profile?: Profile;
};

type GroupMembersProps = {
  groupId: string;
  members: Member[];
  userRole: string;
  canManage: boolean;
  onMembersChange: (members: Member[]) => void;
};

type StudyGroupMembersInsert = Database['public']['Tables']['study_group_members']['Insert'];

const GroupMembers: React.FC<GroupMembersProps> = ({ 
  groupId, 
  members, 
  userRole, 
  canManage, 
  onMembersChange 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [showEditRoleDialog, setShowEditRoleDialog] = useState(false);
  const [showRemoveMemberDialog, setShowRemoveMemberDialog] = useState(false);
  const [emailToInvite, setEmailToInvite] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [newRole, setNewRole] = useState<string>('');

  const handleInviteMember = async () => {
    if (!emailToInvite) return;
    
    try {
      // In a real application, this would send an invitation to the user
      // For now, we'll just add them directly if they exist
      // Perform a case-insensitive search for the email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id, display_name, profile_image')
        .ilike('email', emailToInvite)
        .single();
        
      if (userError || !userData) {
        toast.error('Utilisateur non trouvé');
        return;
      }
      
      // Check if already a member
      const existingMember = members.find(m => m.user_id === userData.id);
      if (existingMember) {
        toast.error('Cet utilisateur est déjà membre du groupe');
        return;
      }
      
      // Create new member object to insert with proper typing
      const newMemberData: StudyGroupMembersInsert = {
        group_id: groupId,
        user_id: userData.id,
        role: 'member'
      };
      
      const { data: memberData, error: memberError } = await supabase
        .from('study_group_members')
        .insert(newMemberData)
        .select()
        .single();
        
      if (memberError) throw memberError;
      
      // Add profile info to the new member
      const newMember = {
        ...memberData,
        profile: {
          display_name: userData.display_name,
          profile_image: userData.profile_image
        }
      };
      
      onMembersChange([...members, newMember]);
      setEmailToInvite('');
      setShowAddMemberDialog(false);
      toast.success('Membre ajouté avec succès');
    } catch (error) {
      console.error('Error inviting member:', error);
      toast.error('Erreur lors de l\'invitation');
    }
  };
  
  const handleChangeRole = async () => {
    if (!selectedMember || !newRole) return;
    
    try {
      // Create update object
      const updateData = { role: newRole };
      
      const { error } = await supabase
        .from('study_group_members')
        .update(updateData)
        .eq('id', selectedMember.id);
        
      if (error) throw error;
      
      // Update local state
      const updatedMembers = members.map(m => 
        m.id === selectedMember.id ? { ...m, role: newRole } : m
      );
      
      onMembersChange(updatedMembers);
      setSelectedMember(null);
      setNewRole('');
      setShowEditRoleDialog(false);
      toast.success('Rôle mis à jour avec succès');
    } catch (error) {
      console.error('Error changing role:', error);
      toast.error('Erreur lors de la mise à jour du rôle');
    }
  };
  
  const handleRemoveMember = async () => {
    if (!selectedMember) return;
    
    try {
      const { error } = await supabase
        .from('study_group_members')
        .delete()
        .eq('id', selectedMember.id);
        
      if (error) throw error;
      
      // Update local state
      const updatedMembers = members.filter(m => m.id !== selectedMember.id);
      onMembersChange(updatedMembers);
      setSelectedMember(null);
      setShowRemoveMemberDialog(false);
      toast.success('Membre retiré avec succès');
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error('Erreur lors du retrait du membre');
    }
  };
  
  const filteredMembers = members.filter(member => 
    member.profile?.display_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'moderator':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'moderator':
        return 'Modérateur';
      default:
        return 'Membre';
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Membres du groupe</CardTitle>
        <div className="flex gap-2">
          {canManage && (
            <Button size="sm" onClick={() => setShowAddMemberDialog(true)}>
              <UserPlus size={16} className="mr-2" />
              Inviter
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher des membres..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => (
              <div 
                key={member.id} 
                className="flex items-center justify-between p-3 rounded-md border hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.profile?.profile_image} />
                    <AvatarFallback className="bg-medical-teal text-white">
                      {member.profile?.display_name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.profile?.display_name}</p>
                    <div className={`text-xs px-2 py-0.5 rounded-full inline-block ${getRoleBadgeClass(member.role)}`}>
                      {getRoleLabel(member.role)}
                    </div>
                  </div>
                </div>
                {canManage && member.role !== 'admin' && (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => {
                        setSelectedMember(member);
                        setNewRole(member.role);
                        setShowEditRoleDialog(true);
                      }}
                    >
                      <Shield size={16} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => {
                        setSelectedMember(member);
                        setShowRemoveMemberDialog(true);
                      }}
                    >
                      <UserMinus size={16} />
                    </Button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">Aucun membre trouvé</p>
          )}
        </div>
      </CardContent>
      
      <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inviter un membre</DialogTitle>
            <DialogDescription>
              Entrez l'email de la personne que vous souhaitez inviter au groupe.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2">
              <Mail size={18} className="text-gray-500" />
              <Input 
                placeholder="Email" 
                value={emailToInvite}
                onChange={(e) => setEmailToInvite(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMemberDialog(false)}>Annuler</Button>
            <Button onClick={handleInviteMember}>Inviter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showEditRoleDialog} onOpenChange={setShowEditRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le rôle</DialogTitle>
            <DialogDescription>
              Changer le rôle de {selectedMember?.profile?.display_name} dans ce groupe.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Membre</SelectItem>
                <SelectItem value="moderator">Modérateur</SelectItem>
                {userRole === 'admin' && <SelectItem value="admin">Administrateur</SelectItem>}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditRoleDialog(false)}>Annuler</Button>
            <Button onClick={handleChangeRole}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showRemoveMemberDialog} onOpenChange={setShowRemoveMemberDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Retirer le membre</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir retirer {selectedMember?.profile?.display_name} du groupe ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRemoveMemberDialog(false)}>Annuler</Button>
            <Button variant="destructive" onClick={handleRemoveMember}>Retirer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default GroupMembers;
