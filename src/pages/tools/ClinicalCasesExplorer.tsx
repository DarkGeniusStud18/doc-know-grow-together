
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Microscope, Search, Filter, BookOpen, Clock, User } from 'lucide-react';

type ClinicalCase = {
  id: string;
  title: string;
  specialty: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  duration: string;
  description: string;
  author: string;
  tags: string[];
};

const ClinicalCasesExplorer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // Données d'exemple
  const clinicalCases: ClinicalCase[] = [
    {
      id: '1',
      title: 'Douleur thoracique chez un homme de 45 ans',
      specialty: 'Cardiologie',
      difficulty: 'Intermédiaire',
      duration: '15 min',
      description: 'Patient présentant une douleur thoracique aiguë avec facteurs de risque cardiovasculaires',
      author: 'Dr. Martin Dubois',
      tags: ['Infarctus', 'ECG', 'Urgence']
    },
    {
      id: '2',
      title: 'Convulsions chez un enfant de 3 ans',
      specialty: 'Pédiatrie',
      difficulty: 'Avancé',
      duration: '20 min',
      description: 'Enfant présentant des crises convulsives fébriles récurrentes',
      author: 'Dr. Sophie Laurent',
      tags: ['Convulsions', 'Fièvre', 'Pédiatrie']
    },
    {
      id: '3',
      title: 'Dyspnée progressive chez une femme âgée',
      specialty: 'Pneumologie',
      difficulty: 'Débutant',
      duration: '10 min',
      description: 'Patiente de 75 ans avec essoufflement progressif et toux chronique',
      author: 'Dr. Pierre Moreau',
      tags: ['BPCO', 'Dyspnée', 'Gériatrie']
    },
    {
      id: '4',
      title: 'Traumatisme crânien après accident',
      specialty: 'Neurologie',
      difficulty: 'Avancé',
      duration: '25 min',
      description: 'Patient polytraumatisé avec suspicion de lésion cérébrale',
      author: 'Dr. Claire Bernard',
      tags: ['Traumatisme', 'Imagerie', 'Urgence']
    },
    {
      id: '5',
      title: 'Diabète de découverte récente',
      specialty: 'Endocrinologie',
      difficulty: 'Débutant',
      duration: '12 min',
      description: 'Patient jeune avec polyurie, polydipsie et amaigrissement',
      author: 'Dr. Anne Petit',
      tags: ['Diabète', 'Métabolisme', 'Diagnostic']
    },
    {
      id: '6',
      title: 'Eruption cutanée généralisée',
      specialty: 'Dermatologie',
      difficulty: 'Intermédiaire',
      duration: '18 min',
      description: 'Patiente avec éruption cutanée prurigineuse apparue après prise médicamenteuse',
      author: 'Dr. Thomas Roux',
      tags: ['Allergie', 'Médicaments', 'Rash']
    }
  ];

  const specialties = ['all', 'Cardiologie', 'Pédiatrie', 'Pneumologie', 'Neurologie', 'Endocrinologie', 'Dermatologie'];
  const difficulties = ['all', 'Débutant', 'Intermédiaire', 'Avancé'];

  const filteredCases = clinicalCases.filter(case_ => {
    const matchesSearch = case_.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         case_.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         case_.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSpecialty = selectedSpecialty === 'all' || case_.specialty === selectedSpecialty;
    const matchesDifficulty = selectedDifficulty === 'all' || case_.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesSpecialty && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Débutant': return 'bg-green-100 text-green-800';
      case 'Intermédiaire': return 'bg-yellow-100 text-yellow-800';
      case 'Avancé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Microscope className="h-8 w-8 text-medical-teal" />
              Explorateur de cas cliniques
            </h1>
            <p className="text-gray-600 mt-2">Accédez à une bibliothèque de cas cliniques pour votre formation</p>
          </div>
        </div>

        {/* Filtres */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtres de recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Recherche</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher par titre, description ou tag..."
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Spécialité</label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>
                      {specialty === 'all' ? 'Toutes les spécialités' : specialty}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Difficulté</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty === 'all' ? 'Tous les niveaux' : difficulty}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-medical-teal">{filteredCases.length}</div>
              <div className="text-sm text-gray-600">Cas trouvés</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-medical-blue">{specialties.length - 1}</div>
              <div className="text-sm text-gray-600">Spécialités</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-medical-green">
                {filteredCases.filter(c => c.difficulty === 'Débutant').length}
              </div>
              <div className="text-sm text-gray-600">Cas débutant</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-medical-red">
                {filteredCases.filter(c => c.difficulty === 'Avancé').length}
              </div>
              <div className="text-sm text-gray-600">Cas avancés</div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des cas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCases.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Microscope className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucun cas trouvé</h3>
              <p className="text-gray-500">Essayez de modifier vos filtres de recherche</p>
            </div>
          ) : (
            filteredCases.map((case_) => (
              <Card key={case_.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{case_.title}</CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{case_.specialty}</Badge>
                        <Badge className={getDifficultyColor(case_.difficulty)}>
                          {case_.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="mb-4">
                    {case_.description}
                  </CardDescription>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {case_.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {case_.author}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {case_.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button className="w-full">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Étudier ce cas
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

export default ClinicalCasesExplorer;
