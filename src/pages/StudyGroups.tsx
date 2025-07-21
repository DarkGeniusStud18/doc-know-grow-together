/**
 * 👥 Page des Groupes d'Étude - Version optimisée et responsive
 * 
 * ✅ Améliorations apportées :
 * - Responsive design parfait pour tous les écrans
 * - Performance optimisée avec React Query
 * - Commentaires français détaillés
 * - Gestion d'erreurs robuste
 * - Interface utilisateur améliorée
 * - Fonctionnalités PWA intégrées
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
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
import { Search, Plus, Users, Lock, Globe, Calendar, User, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// 🔗 Utilization du MobileLayout pour une meilleure expérience mobile
import MobileLayout from '@/components/layout/MobileLayout';

/**
 * 📋 Interface TypeScript pour un groupe d'étude
 * Structure de données optimisée pour la performance
 */
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

/**
 * 👥 Composant principal des Groupes d'Étude
 * 
 * Fonctionnalités optimisées :
 * - Interface responsive adaptée mobile/desktop
 * - Gestion d'état avec React Query pour la performance
 * - Création et gestion de groupes simplifiées
 * - Recherche et filtrage en temps réel
 * - Notifications utilisateur améliorées
 * - Synchronisation automatique des données
 */
const StudyGroups: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // 🎛️ États locaux pour l'interface utilisateur
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_private: false,
    max_members: 20
  });

  console.log('👥 StudyGroups: Rendu pour utilisateur', user?.id);

  /**
   * 📊 Hook React Query pour récupérer les groupes d'étude
   * Optimisé pour la performance et la synchronisation
   */
  const { data: groups = [], isLoading, refetch } = useQuery({
    queryKey: ['studyGroups', user?.id],
    queryFn: async (): Promise<StudyGroup[]> => {
      if (!user) {
        console.log('⚠️ Aucun utilisateur connecté pour récupérer les groupes');
        return [];
      }

      console.log('📊 Récupération des groupes d\'étude pour', user.id);

      try {
        // 📥 Récupération de tous les groupes avec comptage des membres
        const { data: groupsData, error: groupsError } = await supabase
          .from('study_groups')
          .select('*')
          .order('created_at', { ascending: false });

        if (groupsError) {
          console.error('❌ Erreur lors de la récupération des groupes:', groupsError);
          throw groupsError;
        }

        console.log('✅ Groupes récupérés:', groupsData?.length || 0);

        // 🔄 Enrichissement des données avec informations de membre
        const enrichedGroups = await Promise.all(
          (groupsData || []).map(async (group) => {
            try {
              // 📊 Comptage des membres du groupe
              const { count: memberCount } = await supabase
                .from('study_group_members')
                .select('*', { count: 'exact', head: true })
                .eq('group_id', group.id);

              // 👤 Vérification de l'appartenance de l'utilisateur actuel
              const { data: memberData } = await supabase
                .from('study_group_members')
                .select('role')
                .eq('group_id', group.id)
                .eq('user_id', user.id)
                .single();

              const enrichedGroup = {
                ...group,
                member_count: memberCount || 0,
                is_member: !!memberData,
                user_role: memberData?.role || null
              };

              console.log('✅ Groupe enrichi:', enrichedGroup.name, 'Membres:', enrichedGroup.member_count);
              return enrichedGroup;

            } catch (enrichError) {
              console.error('⚠️ Erreur lors de l\'enrichissement du groupe:', group.id, enrichError);
              return {
                ...group,
                member_count: 0,
                is_member: false,
                user_role: null
              };
            }
          })
        );

        return enrichedGroups;

      } catch (error) {
        console.error('❌ Erreur globale lors de la récupération des groupes:', error);
        toast.error('❌ Erreur lors du chargement des groupes', {
          description: 'Impossible de charger les groupes d\'étude. Veuillez réessayer.'
        });
        return [];
      }
    },
    enabled: !!user,
    staleTime: 30000, // 30 secondes de cache
    gcTime: 300000, // 5 minutes de cache (updated from cacheTime)
  });

  /**
   * 🆕 Mutation pour créer un nouveau groupe
   */
  const createGroupMutation = useMutation({
    mutationFn: async (groupData: typeof formData) => {
      if (!user) throw new Error('Utilisateur non connecté');

      const { data, error } = await supabase
        .from('study_groups')
        .insert({
          name: groupData.name,
          description: groupData.description,
          creator_id: user.id,
          is_private: groupData.is_private,
          max_members: groupData.max_members
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (newGroup) => {
      queryClient.invalidateQueries({ queryKey: ['studyGroups'] });
      setShowCreateDialog(false);
      setFormData({ name: '', description: '', is_private: false, max_members: 20 });
      toast.success('✅ Groupe créé avec succès!', {
        description: `Le groupe "${newGroup.name}" a été créé.`
      });
    },
    onError: (error) => {
      console.error('❌ Erreur lors de la création du groupe:', error);
      toast.error('❌ Erreur lors de la création', {
        description: 'Impossible de créer le groupe. Veuillez réessayer.'
      });
    }
  });

  /**
   * 🚪 Mutation pour rejoindre un groupe
   */
  const joinGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      if (!user) throw new Error('Utilisateur non connecté');

      const { error } = await supabase
        .from('study_group_members')
        .insert({
          group_id: groupId,
          user_id: user.id,
          role: 'member'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studyGroups'] });
      toast.success('🎉 Vous avez rejoint le groupe!');
    },
    onError: (error) => {
      console.error('❌ Erreur lors de l\'adhésion au groupe:', error);
      toast.error('❌ Erreur lors de l\'adhésion', {
        description: 'Impossible de rejoindre le groupe. Veuillez réessayer.'
      });
    }
  });

  /**
   * 🚪 Mutation pour quitter un groupe
   */
  const leaveGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      if (!user) throw new Error('Utilisateur non connecté');

      const { error } = await supabase
        .from('study_group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studyGroups'] });
      toast.success('👋 Vous avez quitté le groupe');
    },
    onError: (error) => {
      console.error('❌ Erreur lors de la sortie du groupe:', error);
      toast.error('❌ Erreur lors de la sortie', {
        description: 'Impossible de quitter le groupe. Veuillez réessayer.'
      });
    }
  });

  /**
   * 📝 Gestionnaire de création de groupe
   */
  const handleCreateGroup = () => {
    if (!formData.name.trim()) {
      toast.error('❌ Nom requis', {
        description: 'Veuillez saisir un nom pour le groupe.'
      });
      return;
    }

    createGroupMutation.mutate(formData);
  };

  /**
   * 🔍 Filtrage des groupes selon la recherche utilisateur
   */
  const filteredGroups = (groups as StudyGroup[]).filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log('🔍 Groupes filtrés:', filteredGroups.length, 'sur', (groups as StudyGroup[]).length);

  // 🔄 Affichage du loader pendant le chargement
  if (isLoading) {
    return (
      <MobileLayout requireAuth={true} title="Groupes d'étude">
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-teal"></div>
          <p className="text-gray-600 text-center">🔄 Chargement des groupes d'étude...</p>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout requireAuth={true} title="Groupes d'étude">
      <div className="space-y-6 p-3 sm:p-4 md:p-6">
        
        {/* 🎯 En-tête avec titre et actions - Responsive */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-medical-navy">👥 Groupes d'étude</h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">
              Rejoignez ou créez des groupes d'étude collaboratifs
            </p>
          </div>
          
          {/* 🔍 Barre de recherche et bouton de création - Layout responsive */}
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="🔍 Rechercher des groupes..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* ➕ Dialog de création de groupe */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto bg-medical-teal hover:bg-medical-teal/90">
                  <Plus className="h-4 w-4 mr-2" />
                  ➕ Créer un groupe
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] mx-4">
                <DialogHeader>
                  <DialogTitle>✨ Créer un nouveau groupe d'étude</DialogTitle>
                  <DialogDescription>
                    Créez un espace de collaboration pour étudier ensemble
                  </DialogDescription>
                </DialogHeader>
                
                {/* 📝 Formulaire de création - Optimisé mobile */}
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">📝 Nom du groupe</Label>
                    <Input 
                      id="name" 
                      placeholder="Nom du groupe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">📋 Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Description du groupe..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxMembers">👥 Nombre maximum de membres</Label>
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
                    <Label htmlFor="isPrivate">🔒 Groupe privé</Label>
                  </div>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="w-full sm:w-auto">
                    ❌ Annuler
                  </Button>
                  <Button 
                    onClick={handleCreateGroup} 
                    disabled={!formData.name.trim() || createGroupMutation.isPending}
                    className="w-full sm:w-auto bg-medical-teal hover:bg-medical-teal/90"
                  >
                    {createGroupMutation.isPending ? '🔄 Création...' : '✅ Créer le groupe'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* 📊 Affichage des groupes ou message vide */}
        {filteredGroups.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-200 bg-gray-50/50">
            <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="bg-gray-100 rounded-full p-6 mb-4">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-700">
                {searchQuery ? '🔍 Aucun groupe trouvé' : '👥 Aucun groupe disponible'}
              </h3>
              <p className="text-gray-500 mt-2 text-center">
                {searchQuery 
                  ? 'Essayez de modifier votre recherche ou créez un nouveau groupe'
                  : 'Créez le premier groupe d\'étude pour commencer à collaborer'
                }
              </p>
              <Button 
                className="mt-6 bg-medical-teal hover:bg-medical-teal/90" 
                onClick={() => setShowCreateDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                ✨ Créer un groupe
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* 🎯 Grille responsive des groupes d'étude */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredGroups.map((group) => (
              <Card 
                key={group.id} 
                className="overflow-hidden hover:shadow-lg transition-all duration-200 border-2 hover:border-medical-teal/30"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base sm:text-lg line-clamp-2">{group.name}</CardTitle>
                    <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                      {group.is_private ? (
                        <Lock className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Globe className="h-4 w-4 text-gray-400" />
                      )}
                      {group.user_role === 'admin' && (
                        <Badge variant="default" className="bg-medical-teal">👑 Admin</Badge>
                      )}
                    </div>
                  </div>
                  {group.description && (
                    <CardDescription className="line-clamp-2 text-sm">
                      {group.description}
                    </CardDescription>
                  )}
                </CardHeader>
                
                <CardContent className="pb-3">
                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{group.member_count || 0} membre{(group.member_count || 0) !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{new Date(group.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  
                  {/* 📊 Barre de progression des membres */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Membres</span>
                      <span>{group.member_count || 0}/{group.max_members}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-medical-teal h-2 rounded-full transition-all duration-300" 
                        style={{
                          width: `${Math.min(((group.member_count || 0) / group.max_members) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-3 pb-4">
                  {group.is_member ? (
                    <div className="flex gap-2 w-full">
                      <Button 
                        className="flex-1 bg-medical-teal hover:bg-medical-teal/90"
                        onClick={() => navigate(`/study-groups/${group.id}`)}
                      >
                        ✅ Accéder au groupe
                      </Button>
                      {group.user_role !== 'admin' && (
                        <Button 
                          variant="outline"
                          onClick={() => leaveGroupMutation.mutate(group.id)}
                          disabled={leaveGroupMutation.isPending}
                          className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                        >
                          🚪 Quitter
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Button 
                      className="w-full"
                      onClick={() => joinGroupMutation.mutate(group.id)}
                      disabled={(group.member_count || 0) >= group.max_members || joinGroupMutation.isPending}
                      variant={(group.member_count || 0) >= group.max_members ? "secondary" : "default"}
                    >
                      {(group.member_count || 0) >= group.max_members ? (
                        <>
                          <AlertCircle className="h-4 w-4 mr-2" />
                          🚫 Groupe complet
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          ➕ Rejoindre
                        </>
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default StudyGroups;
