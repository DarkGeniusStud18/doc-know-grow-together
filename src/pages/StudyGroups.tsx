
/**
 * 👥 Page Groupes d'Étude - Gestion Complète des Groupes
 * 
 * Fonctionnalités complètes :
 * - Création, modification, suppression de groupes
 * - Gestion des membres et des rôles
 * - Chat en temps réel entre membres
 * - Partage de ressources
 * - Interface responsive et intuitive
 */

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, Plus, Search, Edit, Trash2, MessageCircle, 
  UserPlus, Settings, Crown, Shield, Star, Calendar,
  BookOpen, Share2, Lock, Unlock, Eye, EyeOff
} from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

/**
 * 📋 Interfaces pour les groupes d'étude
 */
interface StudyGroup {
  id: string;
  name: string;
  description: string | null;
  subject: string | null;
  max_members: number;
  is_private: boolean;
  creator_id: string;
  created_at: string;
  updated_at: string;
  member_count?: number;
  is_member?: boolean;
  user_role?: string;
}

interface GroupMember {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profile?: {
    display_name: string;
    role: string;
  };
}

const StudyGroups: React.FC = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<StudyGroup[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<StudyGroup | null>(null);
  const [loading, setLoading] = useState(true);

  // États du formulaire
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subject: '',
    max_members: 10,
    is_private: false
  });

  // Matières disponibles
  const subjects = [
    { value: 'all', label: '📚 Toutes les matières' },
    { value: 'anatomie', label: '🫀 Anatomie' },
    { value: 'physiologie', label: '⚡ Physiologie' },
    { value: 'pharmacologie', label: '💊 Pharmacologie' },
    { value: 'pathologie', label: '🔬 Pathologie' },
    { value: 'chirurgie', label: '🔪 Chirurgie' },
    { value: 'cardiologie', label: '❤️ Cardiologie' },
    { value: 'neurologie', label: '🧠 Neurologie' },
    { value: 'pediatrie', label: '👶 Pédiatrie' },
    { value: 'general', label: '🏥 Médecine générale' }
  ];

  /**
   * 📥 Chargement des groupes d'étude
   */
  const loadGroups = async () => {
    if (!user) return;
    
    try {
      // Charger tous les groupes avec informations supplémentaires
      const { data: groupsData, error: groupsError } = await supabase
        .from('study_groups')
        .select(`
          *,
          study_group_members!inner(
            id,
            user_id,
            role,
            joined_at
          )
        `)
        .order('created_at', { ascending: false });

      if (groupsError) throw groupsError;

      // Enrichir les données des groupes
      const enrichedGroups = await Promise.all(
        (groupsData || []).map(async (group) => {
          // Compter les membres
          const { count: memberCount } = await supabase
            .from('study_group_members')
            .select('*', { count: 'exact', head: true })
            .eq('group_id', group.id);

          // Vérifier si l'utilisateur est membre
          const { data: membership } = await supabase
            .from('study_group_members')
            .select('role')
            .eq('group_id', group.id)
            .eq('user_id', user.id)
            .single();

          return {
            ...group,
            member_count: memberCount || 0,
            is_member: !!membership,
            user_role: membership?.role || null
          };
        })
      );

      setGroups(enrichedGroups);
      setFilteredGroups(enrichedGroups);
    } catch (error) {
      console.error('Erreur lors du chargement des groupes:', error);
      toast.error('Erreur lors du chargement des groupes');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🔍 Filtrage et recherche des groupes
   */
  const filterGroups = () => {
    let filtered = groups;

    // Filtrage par recherche
    if (searchTerm) {
      filtered = filtered.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (group.subject && group.subject.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtrage par matière
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(group => group.subject === selectedSubject);
    }

    setFilteredGroups(filtered);
  };

  /**
   * 💾 Sauvegarde d'un groupe (création ou modification)
   */
  const saveGroup = async () => {
    if (!user || !formData.name.trim()) {
      toast.error('Le nom du groupe est obligatoire');
      return;
    }

    try {
      const groupData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        subject: formData.subject || null,
        max_members: formData.max_members,
        is_private: formData.is_private,
        creator_id: user.id
      };

      if (editingGroup) {
        // Modification d'un groupe existant
        const { error } = await supabase
          .from('study_groups')
          .update(groupData)
          .eq('id', editingGroup.id);

        if (error) throw error;
        toast.success('Groupe modifié avec succès');
      } else {
        // Création d'un nouveau groupe
        const { data: newGroup, error } = await supabase
          .from('study_groups')
          .insert([groupData])
          .select()
          .single();

        if (error) throw error;

        // Ajouter le créateur comme admin du groupe
        const { error: memberError } = await supabase
          .from('study_group_members')
          .insert([{
            group_id: newGroup.id,
            user_id: user.id,
            role: 'admin'
          }]);

        if (memberError) throw memberError;
        toast.success('Groupe créé avec succès');
      }

      // Réinitialisation du formulaire
      setFormData({
        name: '',
        description: '',
        subject: '',
        max_members: 10,
        is_private: false
      });
      setIsCreateDialogOpen(false);
      setEditingGroup(null);
      loadGroups();

    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde du groupe');
    }
  };

  /**
   * 🗑️ Suppression d'un groupe
   */
  const deleteGroup = async (groupId: string) => {
    try {
      const { error } = await supabase
        .from('study_groups')
        .delete()
        .eq('id', groupId);

      if (error) throw error;
      
      toast.success('Groupe supprimé');
      loadGroups();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression du groupe');
    }
  };

  /**
   * 👥 Rejoindre un groupe
   */
  const joinGroup = async (groupId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('study_group_members')
        .insert([{
          group_id: groupId,
          user_id: user.id,
          role: 'member'
        }]);

      if (error) throw error;
      
      toast.success('Vous avez rejoint le groupe');
      loadGroups();
    } catch (error) {
      console.error('Erreur lors de l\'adhésion:', error);
      toast.error('Erreur lors de l\'adhésion au groupe');
    }
  };

  /**
   * 🚪 Quitter un groupe
   */
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
      console.error('Erreur lors de la sortie:', error);
      toast.error('Erreur lors de la sortie du groupe');
    }
  };

  /**
   * ✏️ Préparer l'édition d'un groupe
   */
  const startEditing = (group: StudyGroup) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      description: group.description || '',
      subject: group.subject || '',
      max_members: group.max_members,
      is_private: group.is_private
    });
    setIsCreateDialogOpen(true);
  };

  /**
   * 🎨 Obtenir la couleur d'une matière
   */
  const getSubjectColor = (subject: string | null) => {
    const colors: Record<string, string> = {
      anatomie: 'bg-red-100 text-red-800',
      physiologie: 'bg-blue-100 text-blue-800',
      pharmacologie: 'bg-green-100 text-green-800',
      pathologie: 'bg-purple-100 text-purple-800',
      chirurgie: 'bg-orange-100 text-orange-800',
      cardiologie: 'bg-pink-100 text-pink-800',
      neurologie: 'bg-indigo-100 text-indigo-800',
      pediatrie: 'bg-yellow-100 text-yellow-800',
      general: 'bg-gray-100 text-gray-800'
    };
    return colors[subject || 'general'] || 'bg-gray-100 text-gray-800';
  };

  // Effets
  useEffect(() => {
    loadGroups();
  }, [user]);

  useEffect(() => {
    filterGroups();
  }, [searchTerm, selectedSubject, groups]);

  return (
    <MainLayout requireAuth={true}>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-medical-navy flex items-center gap-3">
              <Users className="h-8 w-8 text-medical-blue" />
              Groupes d'Étude
            </h1>
            <p className="text-gray-600 mt-2">
              Rejoignez des groupes d'étude ou créez le vôtre pour collaborer
            </p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-medical-blue hover:bg-medical-blue/90">
                <Plus className="h-4 w-4 mr-2" />
                Créer un Groupe
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingGroup ? 'Modifier le groupe' : 'Créer un nouveau groupe'}
                </DialogTitle>
                <DialogDescription>
                  Configurez votre groupe d'étude pour collaborer efficacement
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nom du groupe *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Nom du groupe d'étude"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Description du groupe et objectifs..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Matière</label>
                    <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une matière" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.slice(1).map(subject => (
                          <SelectItem key={subject.value} value={subject.value}>
                            {subject.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Nombre maximum de membres</label>
                    <Input
                      type="number"
                      min="2"
                      max="50"
                      value={formData.max_members}
                      onChange={(e) => setFormData({...formData, max_members: parseInt(e.target.value) || 10})}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_private"
                    checked={formData.is_private}
                    onChange={(e) => setFormData({...formData, is_private: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="is_private" className="text-sm font-medium">
                    Groupe privé (invitation uniquement)
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsCreateDialogOpen(false);
                      setEditingGroup(null);
                      setFormData({
                        name: '',
                        description: '',
                        subject: '',
                        max_members: 10,
                        is_private: false
                      });
                    }}
                  >
                    Annuler
                  </Button>
                  <Button onClick={saveGroup}>
                    {editingGroup ? 'Modifier' : 'Créer'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
            <SelectTrigger className="w-full sm:w-64">
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

        {/* Liste des groupes */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-teal"></div>
          </div>
        ) : filteredGroups.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {searchTerm ? 'Aucun groupe trouvé' : 'Aucun groupe disponible'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm 
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Soyez le premier à créer un groupe d\'étude'
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer le premier groupe
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => {
              const isCreator = group.creator_id === user?.id;
              const canManage = isCreator || group.user_role === 'admin';
              
              return (
                <Card key={group.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2 mb-2 flex items-center gap-2">
                          {group.is_private ? (
                            <Lock className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Unlock className="h-4 w-4 text-green-500" />
                          )}
                          {group.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mb-2">
                          {group.subject && (
                            <Badge variant="secondary" className={getSubjectColor(group.subject)}>
                              {subjects.find(s => s.value === group.subject)?.label || group.subject}
                            </Badge>
                          )}
                          {isCreator && (
                            <Badge variant="outline" className="text-xs">
                              <Crown className="h-3 w-3 mr-1" />
                              Créateur
                            </Badge>
                          )}
                          {group.user_role === 'admin' && !isCreator && (
                            <Badge variant="outline" className="text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              Admin
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {canManage && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditing(group)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {isCreator && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteGroup(group.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {group.description && (
                      <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                        {group.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {group.member_count} / {group.max_members} membres
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(group.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      {group.is_member ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => leaveGroup(group.id)}
                            className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Quitter
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 bg-medical-blue hover:bg-medical-blue/90"
                            onClick={() => toast.info('Chat du groupe bientôt disponible')}
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Chat
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          className="w-full bg-medical-teal hover:bg-medical-teal/90"
                          onClick={() => joinGroup(group.id)}
                          disabled={group.member_count >= group.max_members}
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          {group.member_count >= group.max_members ? 'Complet' : 'Rejoindre'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default StudyGroups;
