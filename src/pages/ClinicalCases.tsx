
/**
 * 🏥 Cas Cliniques - Version Complète avec Contrôle d'Accès par Rôle
 * 
 * Fonctionnalités :
 * - Étudiants : consultation en lecture seule
 * - Professionnels de santé : création, modification, suppression
 * - Interface responsive et intuitive
 * - Système de filtrage et recherche
 */

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Stethoscope, 
  Plus, 
  Search, 
  Filter,
  Edit, 
  Trash2, 
  Eye,
  User,
  Calendar,
  BookOpen,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/sonner';

interface ClinicalCase {
  id: string;
  title: string;
  description?: string;
  content?: string;
  specialty?: string;
  difficultyLevel: number;
  isAnonymized: boolean;
  isPremium: boolean;
  createdBy?: string;
  authorId?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserProfile {
  id: string;
  role: string;
  displayName?: string;
}

// Spécialités médicales disponibles
const MEDICAL_SPECIALTIES = [
  'Cardiologie',
  'Pneumologie',
  'Neurologie',
  'Psychiatrie',
  'Dermatologie',
  'Gastroentérologie',
  'Endocrinologie',
  'Rhumatologie',
  'Urologie',
  'Gynécologie',
  'Pédiatrie',
  'Gériatrie',
  'Urgences',
  'Médecine générale',
  'Chirurgie générale',
  'Orthopédie',
  'Ophtalmologie',
  'ORL',
  'Radiologie',
  'Anesthésie'
];

const ClinicalCases: React.FC = () => {
  const { user } = useAuth();
  const [clinicalCases, setClinicalCases] = useState<ClinicalCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<ClinicalCase | null>(null);
  const [selectedCase, setSelectedCase] = useState<ClinicalCase | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // Filtres et recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  // Formulaire pour nouveau/édition cas
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    specialty: '',
    difficultyLevel: 1,
    isAnonymized: true,
    isPremium: false
  });

  // Charger le profil utilisateur et les cas
  useEffect(() => {
    if (user) {
      loadUserProfile();
      loadClinicalCases();
    }
  }, [user]);

  /**
   * 👤 Charger le profil utilisateur pour vérifier le rôle
   */
  const loadUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, role, display_name')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('❌ Erreur lors du chargement du profil:', error);
        return;
      }

      if (data) {
        setUserProfile({
          id: data.id,
          role: data.role,
          displayName: data.display_name
        });
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement du profil:', error);
    }
  };

  /**
   * 📋 Charger les cas cliniques
   */
  const loadClinicalCases = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clinical_cases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erreur lors du chargement des cas:', error);
        toast.error('Impossible de charger les cas cliniques');
        return;
      }

      if (data) {
        const formattedCases: ClinicalCase[] = data.map(case_item => ({
          id: case_item.id,
          title: case_item.title,
          description: case_item.description,
          content: case_item.content,
          specialty: case_item.specialty,
          difficultyLevel: case_item.difficulty_level || 1,
          isAnonymized: case_item.is_anonymized,
          isPremium: case_item.is_premium,
          createdBy: case_item.created_by,
          authorId: case_item.author_id,
          createdAt: case_item.created_at,
          updatedAt: case_item.updated_at
        }));
        
        setClinicalCases(formattedCases);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement:', error);
      toast.error('Erreur lors du chargement des cas cliniques');
    } finally {
      setLoading(false);
    }
  };

  /**
   * ➕ Créer un nouveau cas clinique (professionnels uniquement)
   */
  const createClinicalCase = async () => {
    if (!user || !userProfile || !canManageCases()) {
      toast.error('Vous n\'avez pas les permissions pour créer un cas clinique');
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Veuillez remplir au moins le titre et le contenu du cas');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('clinical_cases')
        .insert({
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          content: formData.content.trim(),
          specialty: formData.specialty || null,
          difficulty_level: formData.difficultyLevel,
          is_anonymized: formData.isAnonymized,
          is_premium: formData.isPremium,
          created_by: user.id,
          author_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Erreur lors de la création:', error);
        toast.error('Impossible de créer le cas clinique');
        return;
      }

      toast.success('Cas clinique créé avec succès !');
      setIsDialogOpen(false);
      resetForm();
      await loadClinicalCases();
    } catch (error) {
      console.error('❌ Erreur lors de la création:', error);
      toast.error('Erreur lors de la création du cas clinique');
    }
  };

  /**
   * ✏️ Modifier un cas clinique existant
   */
  const updateClinicalCase = async () => {
    if (!user || !userProfile || !editingCase || !canManageCases()) {
      toast.error('Vous n\'avez pas les permissions pour modifier ce cas');
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Veuillez remplir au moins le titre et le contenu du cas');
      return;
    }

    try {
      const { error } = await supabase
        .from('clinical_cases')
        .update({
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          content: formData.content.trim(),
          specialty: formData.specialty || null,
          difficulty_level: formData.difficultyLevel,
          is_anonymized: formData.isAnonymized,
          is_premium: formData.isPremium
        })
        .eq('id', editingCase.id);

      if (error) {
        console.error('❌ Erreur lors de la modification:', error);
        toast.error('Impossible de modifier le cas clinique');
        return;
      }

      toast.success('Cas clinique modifié avec succès !');
      setIsDialogOpen(false);
      setEditingCase(null);
      resetForm();
      await loadClinicalCases();
    } catch (error) {
      console.error('❌ Erreur lors de la modification:', error);
      toast.error('Erreur lors de la modification');
    }
  };

  /**
   * 🗑️ Supprimer un cas clinique
   */
  const deleteClinicalCase = async (caseId: string) => {
    if (!user || !userProfile || !canManageCases()) {
      toast.error('Vous n\'avez pas les permissions pour supprimer ce cas');
      return;
    }

    if (!confirm('Êtes-vous sûr de vouloir supprimer ce cas clinique ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('clinical_cases')
        .delete()
        .eq('id', caseId);

      if (error) {
        console.error('❌ Erreur lors de la suppression:', error);
        toast.error('Impossible de supprimer le cas clinique');
        return;
      }

      toast.success('Cas clinique supprimé avec succès');
      await loadClinicalCases();
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  /**
   * 🔐 Vérifier si l'utilisateur peut gérer les cas cliniques
   */
  const canManageCases = (): boolean => {
    return userProfile?.role === 'healthcare_professional' || userProfile?.role === 'professional' || userProfile?.role === 'admin';
  };

  /**
   * 👁️ Ouvrir un cas en mode lecture
   */
  const viewCase = (clinicalCase: ClinicalCase) => {
    setSelectedCase(clinicalCase);
    setIsViewMode(true);
  };

  /**
   * ✏️ Préparer l'édition d'un cas
   */
  const startEditing = (clinicalCase: ClinicalCase) => {
    if (!canManageCases()) {
      toast.error('Vous n\'avez pas les permissions pour modifier ce cas');
      return;
    }

    setEditingCase(clinicalCase);
    setFormData({
      title: clinicalCase.title,
      description: clinicalCase.description || '',
      content: clinicalCase.content || '',
      specialty: clinicalCase.specialty || '',
      difficultyLevel: clinicalCase.difficultyLevel,
      isAnonymized: clinicalCase.isAnonymized,
      isPremium: clinicalCase.isPremium
    });
    setIsDialogOpen(true);
  };

  /**
   * 📝 Réinitialiser le formulaire
   */
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      specialty: '',
      difficultyLevel: 1,
      isAnonymized: true,
      isPremium: false
    });
  };

  /**
   * 🔍 Filtrer les cas selon les critères
   */
  const filteredCases = clinicalCases.filter(clinicalCase => {
    const matchesSearch = clinicalCase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (clinicalCase.description && clinicalCase.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSpecialty = !selectedSpecialty || clinicalCase.specialty === selectedSpecialty;
    const matchesDifficulty = !selectedDifficulty || clinicalCase.difficultyLevel.toString() === selectedDifficulty;
    
    return matchesSearch && matchesSpecialty && matchesDifficulty;
  });

  /**
   * 🎨 Obtenir la couleur selon la difficulté
   */
  const getDifficultyColor = (level: number): string => {
    switch (level) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 3: return 'bg-orange-100 text-orange-800';
      case 4: return 'bg-red-100 text-red-800';
      case 5: return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  /**
   * 📊 Obtenir le libellé de difficulté
   */
  const getDifficultyLabel = (level: number): string => {
    const labels = ['', 'Facile', 'Moyen', 'Difficile', 'Expert', 'Maître'];
    return labels[level] || 'Non défini';
  };

  return (
    <MainLayout requireAuth={true}>
      <div className="container mx-auto py-4 px-4 max-w-6xl">
        {/* Mode visualisation d'un cas */}
        {isViewMode && selectedCase ? (
          <div className="space-y-6">
            {/* Bouton retour */}
            <Button
              variant="outline"
              onClick={() => {
                setIsViewMode(false);
                setSelectedCase(null);
              }}
              className="mb-4"
            >
              ← Retour à la liste
            </Button>

            {/* Contenu du cas */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl sm:text-2xl mb-2">{selectedCase.title}</CardTitle>
                    {selectedCase.description && (
                      <CardDescription className="text-base">{selectedCase.description}</CardDescription>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCase.specialty && (
                      <Badge variant="secondary">{selectedCase.specialty}</Badge>
                    )}
                    <Badge className={getDifficultyColor(selectedCase.difficultyLevel)}>
                      {getDifficultyLabel(selectedCase.difficultyLevel)}
                    </Badge>
                    {selectedCase.isPremium && (
                      <Badge variant="default" className="bg-yellow-500">Premium</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700">
                    {selectedCase.content || 'Aucun contenu disponible pour ce cas clinique.'}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 pt-4 border-t">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Créé le {new Date(selectedCase.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  {selectedCase.isAnonymized && (
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>Cas anonymisé</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            {/* En-tête normal */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Stethoscope className="h-6 w-6 sm:h-8 sm:w-8 text-medical-blue" />
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">Cas Cliniques</h1>
                  <p className="text-sm sm:text-base text-gray-500">
                    {canManageCases() 
                      ? 'Consultez et gérez les cas cliniques' 
                      : 'Consultez les cas cliniques pour votre formation'
                    }
                  </p>
                </div>
              </div>
              
              {/* Bouton de création pour professionnels */}
              {canManageCases() && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-medical-blue hover:bg-medical-blue/90 w-full sm:w-auto"
                      onClick={() => {
                        setEditingCase(null);
                        resetForm();
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Nouveau Cas
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingCase ? 'Modifier le cas clinique' : 'Créer un nouveau cas clinique'}
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Titre *</label>
                        <Input
                          placeholder="Ex: Cas de pneumonie atypique chez un patient de 65 ans"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Description courte</label>
                        <Textarea
                          placeholder="Résumé du cas en quelques lignes"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          rows={2}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Contenu du cas *</label>
                        <Textarea
                          placeholder="Décrivez le cas clinique en détail : anamnèse, examen clinique, examens complémentaires, évolution..."
                          value={formData.content}
                          onChange={(e) => setFormData({...formData, content: e.target.value})}
                          rows={8}
                          className="min-h-[200px]"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Spécialité</label>
                          <Select 
                            value={formData.specialty} 
                            onValueChange={(value) => setFormData({...formData, specialty: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choisir une spécialité" />
                            </SelectTrigger>
                            <SelectContent>
                              {MEDICAL_SPECIALTIES.map((specialty) => (
                                <SelectItem key={specialty} value={specialty}>
                                  {specialty}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Niveau de difficulté</label>
                          <Select 
                            value={formData.difficultyLevel.toString()} 
                            onValueChange={(value) => setFormData({...formData, difficultyLevel: parseInt(value)})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 - Facile</SelectItem>
                              <SelectItem value="2">2 - Moyen</SelectItem>
                              <SelectItem value="3">3 - Difficile</SelectItem>
                              <SelectItem value="4">4 - Expert</SelectItem>
                              <SelectItem value="5">5 - Maître</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="anonymized"
                            checked={formData.isAnonymized}
                            onCheckedChange={(checked) => setFormData({...formData, isAnonymized: checked})}
                          />
                          <label htmlFor="anonymized" className="text-sm font-medium">
                            Cas anonymisé (recommandé)
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="premium"
                            checked={formData.isPremium}
                            onCheckedChange={(checked) => setFormData({...formData, isPremium: checked})}
                          />
                          <label htmlFor="premium" className="text-sm font-medium">
                            Contenu premium
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-4">
                      <Button 
                        onClick={editingCase ? updateClinicalCase : createClinicalCase}
                        className="flex-1 bg-medical-blue hover:bg-medical-blue/90"
                        disabled={!formData.title.trim() || !formData.content.trim()}
                      >
                        {editingCase ? 'Modifier' : 'Créer'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsDialogOpen(false);
                          setEditingCase(null);
                          resetForm();
                        }}
                        className="flex-1"
                      >
                        Annuler
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {/* Badge de statut utilisateur */}
            {userProfile && (
              <div className="mb-4">
                <Badge variant={canManageCases() ? "default" : "secondary"} className="text-sm">
                  {canManageCases() ? '👨‍⚕️ Professionnel de santé - Accès complet' : '👨‍🎓 Étudiant - Lecture seule'}
                </Badge>
              </div>
            )}

            {/* Filtres et recherche */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Filter className="h-5 w-5" />
                  Filtres et recherche
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Recherche</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Rechercher un cas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Spécialité</label>
                    <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                      <SelectTrigger>
                        <SelectValue placeholder="Toutes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Toutes les spécialités</SelectItem>
                        {MEDICAL_SPECIALTIES.map((specialty) => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Difficulté</label>
                    <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                      <SelectTrigger>
                        <SelectValue placeholder="Toutes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Tous les niveaux</SelectItem>
                        <SelectItem value="1">Facile</SelectItem>
                        <SelectItem value="2">Moyen</SelectItem>
                        <SelectItem value="3">Difficile</SelectItem>
                        <SelectItem value="4">Expert</SelectItem>
                        <SelectItem value="5">Maître</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="sm:[grid-column:span-1] lg:[grid-column:span-1] flex items-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedSpecialty('');
                        setSelectedDifficulty('');
                      }}
                      className="w-full"
                    >
                      Réinitialiser
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Liste des cas cliniques */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-blue"></div>
              </div>
            ) : filteredCases.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {clinicalCases.length === 0 ? 'Aucun cas clinique' : 'Aucun résultat'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {clinicalCases.length === 0 
                      ? (canManageCases() ? 'Créez le premier cas clinique' : 'Aucun cas disponible pour le moment')
                      : 'Aucun cas ne correspond à vos critères de recherche'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCases.map((clinicalCase) => (
                  <Card key={clinicalCase.id} className="transition-all duration-200 hover:shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-lg leading-tight mb-2">{clinicalCase.title}</CardTitle>
                          {clinicalCase.description && (
                            <CardDescription className="text-sm line-clamp-2">{clinicalCase.description}</CardDescription>
                          )}
                        </div>
                        
                        {canManageCases() && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEditing(clinicalCase)}
                              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                              title="Modifier"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteClinicalCase(clinicalCase.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {clinicalCase.specialty && (
                          <Badge variant="secondary" className="text-xs">{clinicalCase.specialty}</Badge>
                        )}
                        <Badge className={`text-xs ${getDifficultyColor(clinicalCase.difficultyLevel)}`}>
                          {getDifficultyLabel(clinicalCase.difficultyLevel)}
                        </Badge>
                        {clinicalCase.isPremium && (
                          <Badge variant="default" className="text-xs bg-yellow-500">Premium</Badge>
                        )}
                        {clinicalCase.isAnonymized && (
                          <Badge variant="outline" className="text-xs">Anonymisé</Badge>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <p className="text-xs text-gray-600">
                          Créé le {new Date(clinicalCase.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                        
                        <Button
                          onClick={() => viewCase(clinicalCase)}
                          variant="outline"
                          size="sm"
                          className="w-full text-medical-blue border-medical-blue hover:bg-medical-blue hover:text-white"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Consulter le cas
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default ClinicalCases;
