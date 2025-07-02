/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';
import { Search, Plus, Calendar, BookOpen, FileText, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type ClinicalCase = {
  id: string;
  created_by: string;
  title: string;
  description: string;
  content: string;
  specialty: string;
  is_anonymized?: boolean;
  created_at: string;
  author_name?: string;
};

// Medical specialties
const SPECIALTIES = [
  'Cardiologie', 'Dermatologie', 'Endocrinologie', 'Gastro-entérologie', 'Gériatrie',
  'Gynécologie', 'Hématologie', 'Immunologie', 'Infectiologie', 'Médecine d\'urgence',
  'Néphrologie', 'Neurologie', 'Oncologie', 'Ophtalmologie', 'Orthopédie',
  'ORL', 'Pédiatrie', 'Pneumologie', 'Psychiatrie', 'Radiologie', 'Rhumatologie', 'Urologie'
];

const ClinicalCases: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSpecialty, setActiveSpecialty] = useState('all');
  const [showDialog, setShowDialog] = useState(false);
  const [editingCase, setEditingCase] = useState<ClinicalCase | null>(null);
  
  const [newCase, setNewCase] = useState({
    title: '',
    description: '',
    content: '',
    specialty: '',
    isAnonymized: true
  });

  const fetchClinicalCases = async () => {
    if (!user) return [];
    
    if (user.role !== 'professional' || user.kycStatus !== 'verified') {
      return [];
    }
    
    const { data: cases, error: casesError } = await supabase
      .from('clinical_cases')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (casesError) {
      throw new Error(`Error fetching clinical cases: ${casesError.message}`);
    }
    
    const enrichedCases = await Promise.all(cases.map(async (clinicalCase) => {
      const isAnonymized = clinicalCase.is_anonymized ?? true;
      if (!isAnonymized && clinicalCase.created_by) {
        const { data: authorProfile, error: profileError } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', clinicalCase.created_by)
          .single();
          
        return {
          ...clinicalCase,
          author_name: profileError ? 'Unknown' : authorProfile?.display_name
        };
      }
      
      return clinicalCase;
    }));
    
    return enrichedCases as ClinicalCase[];
  };

  const { data: clinicalCases = [], isLoading, error } = useQuery({
    queryKey: ['clinicalCases'],
    queryFn: fetchClinicalCases
  });

  const createCaseMutation = useMutation({
    mutationFn: async (caseData: any) => {
      if (!user || user.role !== 'professional' || user.kycStatus !== 'verified') {
        throw new Error('Accès non autorisé');
      }

      const { error } = await supabase
        .from('clinical_cases')
        .insert({
          created_by: user.id,
          title: caseData.title,
          description: caseData.description,
          content: caseData.content,
          specialty: caseData.specialty,
          is_anonymized: caseData.isAnonymized
        });
        
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Cas clinique créé avec succès');
      setShowDialog(false);
      setNewCase({
        title: '',
        description: '',
        content: '',
        specialty: '',
        isAnonymized: true
      });
      queryClient.invalidateQueries({ queryKey: ['clinicalCases'] });
    },
    onError: (error) => {
      console.error('Error creating clinical case:', error);
      toast.error('Erreur lors de la création du cas clinique');
    }
  });

  const updateCaseMutation = useMutation({
    mutationFn: async ({ id, ...caseData }: any) => {
      if (!user || user.role !== 'professional') {
        throw new Error('Accès non autorisé');
      }

      const { error } = await supabase
        .from('clinical_cases')
        .update({
          title: caseData.title,
          description: caseData.description,
          content: caseData.content,
          specialty: caseData.specialty,
          is_anonymized: caseData.isAnonymized
        })
        .eq('id', id)
        .eq('created_by', user.id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Cas clinique modifié avec succès');
      setEditingCase(null);
      setShowDialog(false);
      queryClient.invalidateQueries({ queryKey: ['clinicalCases'] });
    },
    onError: (error) => {
      console.error('Error updating clinical case:', error);
      toast.error('Erreur lors de la modification');
    }
  });

  const deleteCaseMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user || user.role !== 'professional') {
        throw new Error('Accès non autorisé');
      }

      const { error } = await supabase
        .from('clinical_cases')
        .delete()
        .eq('id', id)
        .eq('created_by', user.id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Cas clinique supprimé');
      queryClient.invalidateQueries({ queryKey: ['clinicalCases'] });
    },
    onError: (error) => {
      console.error('Error deleting clinical case:', error);
      toast.error('Erreur lors de la suppression');
    }
  });

  const filteredCases = clinicalCases.filter(clinicalCase => {
    const matchesQuery = clinicalCase.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        clinicalCase.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialty = activeSpecialty === 'all' || clinicalCase.specialty === activeSpecialty;
    
    return matchesQuery && matchesSpecialty;
  });

  const handleCreateCase = () => {
    createCaseMutation.mutate(newCase);
  };

  const handleEditCase = (clinicalCase: ClinicalCase) => {
    setEditingCase(clinicalCase);
    setNewCase({
      title: clinicalCase.title,
      description: clinicalCase.description,
      content: clinicalCase.content,
      specialty: clinicalCase.specialty,
      isAnonymized: clinicalCase.is_anonymized ?? true
    });
    setShowDialog(true);
  };

  const handleUpdateCase = () => {
    if (editingCase) {
      updateCaseMutation.mutate({
        id: editingCase.id,
        ...newCase
      });
    }
  };

  const handleDeleteCase = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cas clinique ?')) {
      deleteCaseMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setEditingCase(null);
    setNewCase({
      title: '',
      description: '',
      content: '',
      specialty: '',
      isAnonymized: true
    });
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-semibold mb-4">Connexion requise</h1>
          <p className="text-gray-600 mb-6">Veuillez vous connecter pour accéder aux cas cliniques.</p>
          <Button onClick={() => navigate('/login')}>Se connecter</Button>
        </div>
      </MainLayout>
    );
  }
  
  if (user.role !== 'professional') {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6">
            <FileText className="h-8 w-8 text-amber-600" />
          </div>
          <h1 className="text-2xl font-semibold mb-4">Accès réservé aux professionnels</h1>
          <p className="text-gray-600 max-w-md text-center">
            Les cas cliniques sont réservés aux professionnels de santé vérifiés.
          </p>
        </div>
      </MainLayout>
    );
  }
  
  if (user.kycStatus !== 'verified') {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-600"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold mb-4">Vérification requise</h1>
          <p className="text-gray-600 max-w-md text-center mb-6">
            Pour accéder aux cas cliniques, vous devez compléter le processus de vérification KYC.
          </p>
          <Button onClick={() => navigate('/kyc')}>Vérifier mon identité</Button>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container py-4 px-4 space-y-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-medical-navy">Cas Cliniques</h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1">
              Partagez et consultez des cas cliniques avec d'autres professionnels
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher des cas..."
                className="pl-9 w-full sm:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Dialog open={showDialog} onOpenChange={(open) => {
              setShowDialog(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un cas
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingCase ? 'Modifier le cas clinique' : 'Créer un nouveau cas clinique'}
                  </DialogTitle>
                  <DialogDescription>
                    Partagez un cas clinique intéressant avec la communauté médicale
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre du cas</Label>
                    <Input 
                      id="title" 
                      placeholder="Ex: Insuffisance cardiaque chez un patient jeune"
                      value={newCase.title}
                      onChange={(e) => setNewCase({...newCase, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Spécialité</Label>
                    <Select value={newCase.specialty} onValueChange={(value) => setNewCase({...newCase, specialty: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une spécialité" />
                      </SelectTrigger>
                      <SelectContent>
                        {SPECIALTIES.map(specialty => (
                          <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Résumé</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Bref résumé du cas clinique..."
                      value={newCase.description}
                      onChange={(e) => setNewCase({...newCase, description: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Description complète</Label>
                    <Textarea 
                      id="content" 
                      placeholder="Description détaillée du cas clinique..."
                      className="min-h-[150px]"
                      value={newCase.content}
                      onChange={(e) => setNewCase({...newCase, content: e.target.value})}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="anonymized"
                      checked={newCase.isAnonymized}
                      onCheckedChange={(checked) => setNewCase({...newCase, isAnonymized: checked})}
                    />
                    <Label htmlFor="anonymized" className="cursor-pointer">Cas anonymisé (recommandé)</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setShowDialog(false);
                    resetForm();
                  }}>
                    Annuler
                  </Button>
                  <Button 
                    onClick={editingCase ? handleUpdateCase : handleCreateCase}
                    disabled={!newCase.title || !newCase.specialty || !newCase.content}
                  >
                    {editingCase ? 'Modifier' : 'Créer'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeSpecialty === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveSpecialty('all')}
          >
            Toutes les spécialités
          </Button>
          {SPECIALTIES.slice(0, 6).map(specialty => (
            <Button
              key={specialty}
              variant={activeSpecialty === specialty ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveSpecialty(specialty)}
              className="hidden sm:inline-flex"
            >
              {specialty}
            </Button>
          ))}
        </div>

        {/* Liste des cas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-teal mx-auto mb-4"></div>
              <p>Chargement des cas cliniques...</p>
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucun cas trouvé</h3>
              <p className="text-gray-500">Essayez de modifier vos filtres de recherche</p>
            </div>
          ) : (
            filteredCases.map((clinicalCase) => (
              <Card key={clinicalCase.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base sm:text-lg mb-2">{clinicalCase.title}</CardTitle>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant="outline">{clinicalCase.specialty}</Badge>
                        {clinicalCase.is_anonymized && (
                          <Badge variant="secondary" className="text-xs">Anonymisé</Badge>
                        )}
                      </div>
                    </div>
                    {user.id === clinicalCase.created_by && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditCase(clinicalCase)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCase(clinicalCase.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="mb-4 text-sm">
                    {clinicalCase.description}
                  </CardDescription>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        {new Date(clinicalCase.created_at).toLocaleDateString('fr-FR')}
                      </span>
                      {!clinicalCase.is_anonymized && clinicalCase.author_name && (
                        <span className="flex items-center gap-1">
                          Dr. {clinicalCase.author_name}
                        </span>
                      )}
                    </div>
                    
                    <Button className="w-full" size="sm">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Consulter le cas
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ClinicalCases;
