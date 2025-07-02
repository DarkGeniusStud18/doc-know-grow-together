
/**
 * 👥 Page des Groupes d'Étude - Version Complète CRUD
 * Gestion complète des groupes d'étude avec interface responsive
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import MainLayout from '@/components/layout/MainLayout';
import { Users, Plus, Edit, Trash2, Lock, Globe, Calendar, MessageCircle, Settings } from 'lucide-react';

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  creator_id: string;
  is_private: boolean;
  max_members: number;
  created_at: string;
  updated_at: string;
}

interface GroupFormData {
  name: string;
  description: string;
  is_private: boolean;
  max_members: number;
}

const StudyGroups: React.FC = () => {
  const { user } = useAuth();
  
  // États principaux
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingGroup, setEditingGroup] = useState<StudyGroup | null>(null);
  
  // États du formulaire
  const [formData, setFormData] = useState<GroupFormData>({
    name: '',
    description: '',
    is_private: false,
    max_members: 20
  });

  /**
   * 📡 Chargement des groupes d'étude
   */
  const loadStudyGroups = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('study_groups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur chargement groupes d\'étude:', error);
        toast.error('Erreur lors du chargement des groupes');
        return;
      }

      setStudyGroups(data || []);
    } catch (error) {
      console.error('Erreur inattendue:', error);
      toast.error('Erreur inattendue lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  /**
   * ✨ Création d'un nouveau groupe d'étude
   */
  const createStudyGroup = async () => {
    if (!user || !formData.name.trim()) {
      toast.error('Nom du groupe requis');
      return;
    }

    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from('study_groups')
        .insert([{
          name: formData.name.trim(),
          description: formData.description.trim(),
          creator_id: user.id,
          is_private: formData.is_private,
          max_members: formData.max_members
        }])
        .select()
        .single();

      if (error) {
        console.error('Erreur création groupe:', error);
        toast.error('Erreur lors de la création du groupe');
        return;
      }

      toast.success('Groupe d\'étude créé avec succès !');
      setStudyGroups(prev => [data, ...prev]);
      resetForm();
    } catch (error) {
      console.error('Erreur inattendue création:', error);
      toast.error('Erreur inattendue lors de la création');
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * ✏️ Modification d'un groupe d'étude
   */
  const updateStudyGroup = async () => {
    if (!editingGroup || !user || !formData.name.trim()) {
      toast.error('Données du groupe requises');
      return;
    }

    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from('study_groups')
        .update({
          name: formData.name.trim(),
          description: formData.description.trim(),
          is_private: formData.is_private,
          max_members: formData.max_members,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingGroup.id)
        .eq('creator_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Erreur modification groupe:', error);
        toast.error('Erreur lors de la modification du groupe');
        return;
      }

      toast.success('Groupe d\'étude modifié avec succès !');
      setStudyGroups(prev => 
        prev.map(group => group.id === editingGroup.id ? data : group)
      );
      resetForm();
    } catch (error) {
      console.error('Erreur inattendue modification:', error);
      toast.error('Erreur inattendue lors de la modification');
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * 🗑️ Suppression d'un groupe d'étude
   */
  const deleteStudyGroup = async (groupId: string) => {
    if (!user) return;

    if (!confirm('Êtes-vous sûr de vouloir supprimer ce groupe d\'étude ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('study_groups')
        .delete()
        .eq('id', groupId)
        .eq('creator_id', user.id);

      if (error) {
        console.error('Erreur suppression groupe:', error);
        toast.error('Erreur lors de la suppression du groupe');
        return;
      }

      toast.success('Groupe d\'étude supprimé avec succès');
      setStudyGroups(prev => prev.filter(group => group.id !== groupId));
    } catch (error) {
      console.error('Erreur inattendue suppression:', error);
      toast.error('Erreur inattendue lors de la suppression');
    }
  };

  /**
   * 🔄 Réinitialisation du formulaire
   */
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      is_private: false,
      max_members: 20
    });
    setEditingGroup(null);
  };

  /**
   * ✏️ Préparation de l'édition d'un groupe
   */
  const startEditing = (group: StudyGroup) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      description: group.description || '',
      is_private: group.is_private,
      max_members: group.max_members
    });
  };

  /**
   * 👤 Vérification des permissions utilisateur
   */
  const canManageGroup = (group: StudyGroup): boolean => {
    return user?.id === group.creator_id;
  };

  // Chargement initial des données
  useEffect(() => {
    loadStudyGroups();
  }, [user]);

  return (
    <MainLayout requireAuth={true}>
      <div className="container mx-auto py-4 px-4 space-y-6 max-w-6xl">
        {/* En-tête avec actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-medical-blue" />
              Groupes d'Étude
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Créez et rejoignez des groupes d'étude collaboratifs
            </p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto bg-medical-blue hover:bg-medical-blue/90">
                <Plus className="h-4 w-4 mr-2" />
                Créer un Groupe
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingGroup ? 'Modifier le Groupe' : 'Créer un Nouveau Groupe'}
                </DialogTitle>
                <DialogDescription>
                  {editingGroup 
                    ? 'Modifiez les informations de votre groupe d\'étude'
                    : 'Créez un groupe d\'étude pour collaborer avec d\'autres étudiants'
                  }
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Nom du groupe */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nom du Groupe *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Anatomie Cardio-Vasculaire"
                    className="w-full"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Décrivez l'objectif et le contenu de ce groupe..."
                    rows={3}
                    className="w-full"
                  />
                </div>

                {/* Nombre maximum de membres */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nombre Maximum de Membres
                  </label>
                  <Select
                    value={formData.max_members.toString()}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, max_members: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 membres</SelectItem>
                      <SelectItem value="20">20 membres</SelectItem>
                      <SelectItem value="30">30 membres</SelectItem>
                      <SelectItem value="50">50 membres</SelectItem>
                      <SelectItem value="100">100 membres</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Visibilité du groupe */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">
                      Groupe Privé
                    </label>
                    <p className="text-xs text-gray-500">
                      Seuls les membres invités peuvent rejoindre
                    </p>
                  </div>
                  <Switch
                    checked={formData.is_private}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_private: checked }))}
                  />
                </div>

                {/* Boutons d'action */}
                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  <Button
                    onClick={editingGroup ? updateStudyGroup : createStudyGroup}
                    disabled={isCreating || !formData.name.trim()}
                    className="flex-1"
                  >
                    {isCreating ? '⏳ En cours...' : editingGroup ? '✏️ Modifier' : '✨ Créer'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={resetForm}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Liste des groupes d'étude */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-teal"></div>
          </div>
        ) : studyGroups.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Aucun Groupe d'Étude
            </h3>
            <p className="text-gray-500 mb-4">
              Créez votre premier groupe d'étude pour commencer à collaborer
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studyGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {group.is_private ? (
                          <Lock className="h-4 w-4 text-amber-500" />
                        ) : (
                          <Globe className="h-4 w-4 text-green-500" />
                        )}
                        {group.name}
                      </CardTitle>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={group.is_private ? "secondary" : "default"}>
                          {group.is_private ? 'Privé' : 'Public'}
                        </Badge>
                        <Badge variant="outline">
                          Max {group.max_members} membres
                        </Badge>
                      </div>
                    </div>

                    {canManageGroup(group) && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditing(group)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteStudyGroup(group.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    {group.description && (
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {group.description}
                      </p>
                    )}

                    <div className="text-xs text-gray-400">
                      Créé le {new Date(group.created_at).toLocaleDateString('fr-FR')}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button size="sm" className="flex-1">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Rejoindre
                      </Button>
                      
                      {canManageGroup(group) && (
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-1" />
                          Gérer
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Bouton de rechargement */}
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={loadStudyGroups}
            disabled={loading}
          >
            {loading ? '🔄 Chargement...' : '🔄 Actualiser'}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudyGroups;
