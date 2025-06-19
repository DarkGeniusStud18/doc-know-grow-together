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
import { Search, Plus, Calendar, BookOpen, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

type ClinicalCase = {
  id: string;
  created_by: string; // Use created_by instead of author_id
  title: string;
  description: string;
  content: string;
  specialty: string;
  is_anonymized?: boolean; // Make optional since it might not exist in DB
  created_at: string;
  author_name?: string;
};

// Medical specialties
const SPECIALTIES = [
  'Cardiologie',
  'Dermatologie',
  'Endocrinologie',
  'Gastro-entérologie',
  'Gériatrie',
  'Gynécologie',
  'Hématologie',
  'Immunologie',
  'Infectiologie',
  'Médecine d\'urgence',
  'Néphrologie',
  'Neurologie',
  'Oncologie',
  'Ophtalmologie',
  'Orthopédie',
  'ORL',
  'Pédiatrie',
  'Pneumologie',
  'Psychiatrie',
  'Radiologie',
  'Rhumatologie',
  'Urologie'
];

const ClinicalCases: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [activeSpecialty, setActiveSpecialty] = useState('all');
  const [showDialog, setShowDialog] = useState(false);
  
  const [newCase, setNewCase] = useState({
    title: '',
    description: '',
    content: '',
    specialty: '',
    isAnonymized: true
  });

  const fetchClinicalCases = async () => {
    if (!user) return [];
    
    // Only verified professionals can access clinical cases
    if (user.role !== 'professional' || user.kycStatus !== 'verified') {
      return [];
    }
    
    // First fetch the clinical cases
    const { data: cases, error: casesError } = await supabase
      .from('clinical_cases')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (casesError) {
      throw new Error(`Error fetching clinical cases: ${casesError.message}`);
    }
    
    // Then for each case, fetch the author profile if needed
    const enrichedCases = await Promise.all(cases.map(async (clinicalCase) => {
      // Only fetch author profile if the case is not anonymized
      const isAnonymized = clinicalCase.is_anonymized ?? true; // Default to true if field doesn't exist
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

  const filteredCases = clinicalCases.filter(clinicalCase => {
    const matchesQuery = clinicalCase.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        clinicalCase.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialty = activeSpecialty === 'all' || clinicalCase.specialty === activeSpecialty;
    
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'mine' && clinicalCase.created_by === user?.id);
    
    return matchesQuery && matchesSpecialty && matchesTab;
  });

  const handleCreateCase = async () => {
    if (!user) return;
    
    // Validate user is a verified professional
    if (user.role !== 'professional' || user.kycStatus !== 'verified') {
      toast.error('Vérification requise', {
        description: 'Seuls les professionnels vérifiés peuvent créer des cas cliniques.'
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('clinical_cases')
        .insert({
          created_by: user.id,
          title: newCase.title,
          description: newCase.description,
          content: newCase.content,
          specialty: newCase.specialty,
          is_anonymized: newCase.isAnonymized
        } as any);
        
      if (error) throw error;
      
      toast.success('Cas clinique créé avec succès');
      setShowDialog(false);
      
      // Reset form
      setNewCase({
        title: '',
        description: '',
        content: '',
        specialty: '',
        isAnonymized: true
      });
      
    } catch (error) {
      console.error('Error creating clinical case:', error);
      toast.error('Erreur lors de la création du cas clinique');
    }
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
  
  // Check if user is a professional
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
  
  // Check if user is verified
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
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-medical-navy">Cas Cliniques</h1>
            <p className="text-gray-500 mt-1">
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
            
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un cas
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>Créer un nouveau cas clinique</DialogTitle>
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
                  <Button variant="outline" onClick={() => setShowDialog(false)}>Annuler</Button>
                  <Button 
                    onClick={handleCreateCase}
                    disabled={!newCase.title || !newCase.description || !newCase.content || !newCase.specialty}
                  >
                    Publier
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Filtres</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <h4 className="text-sm font-medium mb-3">Afficher</h4>
                  <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-2 w-full h-auto">
                      <TabsTrigger value="all" className="text-sm py-1.5">Tous</TabsTrigger>
                      <TabsTrigger value="mine" className="text-sm py-1.5">Mes cas</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-3">Spécialités</h4>
                  <div className="space-y-2">
                    <Button 
                      variant={activeSpecialty === 'all' ? "default" : "ghost"}
                      className="w-full justify-start text-sm h-9"
                      onClick={() => setActiveSpecialty('all')}
                    >
                      Toutes les spécialités
                    </Button>
                    {SPECIALTIES.map(specialty => (
                      <Button 
                        key={specialty}
                        variant={activeSpecialty === specialty ? "default" : "ghost"}
                        className="w-full justify-start text-sm h-9"
                        onClick={() => setActiveSpecialty(specialty)}
                      >
                        {specialty}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-teal"></div>
              </div>
            ) : error ? (
              <Card>
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
                  <h3 className="text-xl font-medium">Erreur lors du chargement des cas cliniques</h3>
                  <p className="text-gray-500 mt-2">Veuillez réessayer plus tard</p>
                </CardContent>
              </Card>
            ) : filteredCases.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="bg-gray-100 rounded-full p-6 mb-4">
                    <FileText className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium">Aucun cas clinique trouvé</h3>
                  <p className="text-gray-500 mt-2">
                    {activeTab === 'mine' 
                      ? "Vous n'avez pas encore créé de cas clinique."
                      : "Aucun cas ne correspond à vos filtres ou aucun cas n'a été créé."}
                  </p>
                  <Button className="mt-6" onClick={() => setShowDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un cas
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {filteredCases.map((clinicalCase) => (
                  <Card key={clinicalCase.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <Badge className="mb-2 bg-medical-blue">{clinicalCase.specialty}</Badge>
                        <div className="text-sm text-gray-500">
                          {new Date(clinicalCase.created_at).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      <CardTitle className="text-xl">{clinicalCase.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{clinicalCase.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      {!(clinicalCase.is_anonymized ?? true) && clinicalCase.author_name && (
                        <div className="text-sm mb-3">
                          <span className="text-gray-600">Par: </span>
                          <span className="font-medium">{clinicalCase.author_name}</span>
                        </div>
                      )}
                      <p className="text-gray-700 line-clamp-3">{clinicalCase.content}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" onClick={() => navigate(`/clinical-cases/${clinicalCase.id}`)}>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Lire le cas complet
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ClinicalCases;
