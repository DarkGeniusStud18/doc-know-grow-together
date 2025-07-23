/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calculator, Heart, Stethoscope, Activity, Brain, Zap } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const MedicalCalculators = () => {
  const [selectedCalculator, setSelectedCalculator] = useState('bmi');
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, any>>({});

  const calculators = [
    {
      id: 'bmi',
      name: 'IMC (Indice de Masse Corporelle)',
      description: 'Calculez votre indice de masse corporelle',
      icon: Activity,
      color: 'bg-blue-500',
      category: 'Anthropométrie'
    },
    {
      id: 'cardiac-risk',
      name: 'Risque Cardiovasculaire',
      description: 'Évaluation du risque cardiovasculaire',
      icon: Heart,
      color: 'bg-red-500',
      category: 'Cardiologie'
    },
    {
      id: 'gfr',
      name: 'DFG (Débit de Filtration Glomérulaire)',
      description: 'Calcul de la fonction rénale',
      icon: Stethoscope,
      color: 'bg-green-500',
      category: 'Néphrologie'
    },
    {
      id: 'drug-dosage',
      name: 'Dosage Médicamenteux',
      description: 'Calcul de dosage selon le poids',
      icon: Zap,
      color: 'bg-purple-500',
      category: 'Pharmacologie'
    },
    {
      id: 'apgar',
      name: 'Score d\'Apgar',
      description: 'Évaluation néonatale',
      icon: Brain,
      color: 'bg-orange-500',
      category: 'Pédiatrie'
    }
  ];

  const getCalculatorForm = () => {
    switch (selectedCalculator) {
      case 'bmi':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">Poids (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  value={inputs.weight || ''}
                  onChange={(e) => setInputs({...inputs, weight: e.target.value})}
                  className="bg-gray-50 border-2 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <Label htmlFor="height">Taille (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="175"
                  value={inputs.height || ''}
                  onChange={(e) => setInputs({...inputs, height: e.target.value})}
                  className="bg-gray-50 border-2 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>
        );
      
      case 'cardiac-risk':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Âge</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="45"
                  value={inputs.age || ''}
                  onChange={(e) => setInputs({...inputs, age: e.target.value})}
                  className="bg-gray-50 border-2 focus:border-red-500 transition-all"
                />
              </div>
              <div>
                <Label htmlFor="gender">Sexe</Label>
                <Select value={inputs.gender || ''} onValueChange={(value) => setInputs({...inputs, gender: value})}>
                  <SelectTrigger className="bg-gray-50 border-2 focus:border-red-500">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Homme</SelectItem>
                    <SelectItem value="female">Femme</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="systolic">Pression systolique</Label>
                <Input
                  id="systolic"
                  type="number"
                  placeholder="120"
                  value={inputs.systolic || ''}
                  onChange={(e) => setInputs({...inputs, systolic: e.target.value})}
                  className="bg-gray-50 border-2 focus:border-red-500 transition-all"
                />
              </div>
              <div>
                <Label htmlFor="cholesterol">Cholestérol total</Label>
                <Input
                  id="cholesterol"
                  type="number"
                  placeholder="200"
                  value={inputs.cholesterol || ''}
                  onChange={(e) => setInputs({...inputs, cholesterol: e.target.value})}
                  className="bg-gray-50 border-2 focus:border-red-500 transition-all"
                />
              </div>
            </div>
          </div>
        );
      
      case 'gfr':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="creatinine">Créatinine (mg/dL)</Label>
                <Input
                  id="creatinine"
                  type="number"
                  step="0.1"
                  placeholder="1.0"
                  value={inputs.creatinine || ''}
                  onChange={(e) => setInputs({...inputs, creatinine: e.target.value})}
                  className="bg-gray-50 border-2 focus:border-green-500 transition-all"
                />
              </div>
              <div>
                <Label htmlFor="age">Âge</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="50"
                  value={inputs.age || ''}
                  onChange={(e) => setInputs({...inputs, age: e.target.value})}
                  className="bg-gray-50 border-2 focus:border-green-500 transition-all"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="gender">Sexe</Label>
              <Select value={inputs.gender || ''} onValueChange={(value) => setInputs({...inputs, gender: value})}>
                <SelectTrigger className="bg-gray-50 border-2 focus:border-green-500">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Homme</SelectItem>
                  <SelectItem value="female">Femme</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case 'drug-dosage':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">Poids (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  value={inputs.weight || ''}
                  onChange={(e) => setInputs({...inputs, weight: e.target.value})}
                  className="bg-gray-50 border-2 focus:border-purple-500 transition-all"
                />
              </div>
              <div>
                <Label htmlFor="dose">Dose (mg/kg)</Label>
                <Input
                  id="dose"
                  type="number"
                  step="0.1"
                  placeholder="10"
                  value={inputs.dose || ''}
                  onChange={(e) => setInputs({...inputs, dose: e.target.value})}
                  className="bg-gray-50 border-2 focus:border-purple-500 transition-all"
                />
              </div>
            </div>
          </div>
        );
      
      case 'apgar':
        return (
          <div className="space-y-4">
            {['appearance', 'pulse', 'grimace', 'activity', 'respiration'].map((criterion) => (
              <div key={criterion}>
                <Label htmlFor={criterion} className="capitalize">
                  {criterion === 'appearance' && 'Couleur'}
                  {criterion === 'pulse' && 'Fréquence cardiaque'}
                  {criterion === 'grimace' && 'Réactivité'}
                  {criterion === 'activity' && 'Tonus musculaire'}
                  {criterion === 'respiration' && 'Respiration'}
                </Label>
                <Select value={inputs[criterion] || ''} onValueChange={(value) => setInputs({...inputs, [criterion]: value})}>
                  <SelectTrigger className="bg-gray-50 border-2 focus:border-orange-500">
                    <SelectValue placeholder="Score 0-2" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  const calculateResult = () => {
    switch (selectedCalculator) {
      case 'bmi':
        if (inputs.weight && inputs.height) {
          const weight = parseFloat(inputs.weight);
          const height = parseFloat(inputs.height) / 100; // Convert cm to m
          const bmi = weight / (height * height);
          let category = '';
          let color = '';
          
          if (bmi < 18.5) {
            category = 'Insuffisance pondérale';
            color = 'text-blue-600';
          } else if (bmi < 25) {
            category = 'Poids normal';
            color = 'text-green-600';
          } else if (bmi < 30) {
            category = 'Surpoids';
            color = 'text-yellow-600';
          } else {
            category = 'Obésité';
            color = 'text-red-600';
          }
          
          setResults({
            value: bmi.toFixed(1),
            category,
            color,
            unit: 'kg/m²'
          });
        }
        break;
      
      case 'cardiac-risk':
        if (inputs.age && inputs.gender && inputs.systolic && inputs.cholesterol) {
          // Simplified Framingham risk calculation
          let risk = 0;
          const age = parseInt(inputs.age);
          const systolic = parseInt(inputs.systolic);
          const cholesterol = parseInt(inputs.cholesterol);
          
          if (inputs.gender === 'male') {
            risk += age > 45 ? 2 : 0;
          } else {
            risk += age > 55 ? 2 : 0;
          }
          
          risk += systolic > 140 ? 2 : systolic > 120 ? 1 : 0;
          risk += cholesterol > 240 ? 2 : cholesterol > 200 ? 1 : 0;
          
          let riskLevel = '';
          let color = '';
          
          if (risk <= 2) {
            riskLevel = 'Faible';
            color = 'text-green-600';
          } else if (risk <= 4) {
            riskLevel = 'Modéré';
            color = 'text-yellow-600';
          } else {
            riskLevel = 'Élevé';
            color = 'text-red-600';
          }
          
          setResults({
            value: risk,
            category: riskLevel,
            color,
            unit: 'points'
          });
        }
        break;
      
      case 'gfr':
        if (inputs.creatinine && inputs.age && inputs.gender) {
          const creatinine = parseFloat(inputs.creatinine);
          const age = parseInt(inputs.age);
          const genderFactor = inputs.gender === 'female' ? 0.85 : 1;
          
          const gfr = ((140 - age) * 72 * genderFactor) / creatinine;
          
          let category = '';
          let color = '';
          
          if (gfr >= 90) {
            category = 'Normal';
            color = 'text-green-600';
          } else if (gfr >= 60) {
            category = 'Légèrement diminué';
            color = 'text-yellow-600';
          } else if (gfr >= 30) {
            category = 'Modérément diminué';
            color = 'text-orange-600';
          } else {
            category = 'Sévèrement diminué';
            color = 'text-red-600';
          }
          
          setResults({
            value: gfr.toFixed(0),
            category,
            color,
            unit: 'mL/min/1.73m²'
          });
        }
        break;
      
      case 'drug-dosage':
        if (inputs.weight && inputs.dose) {
          const weight = parseFloat(inputs.weight);
          const dose = parseFloat(inputs.dose);
          const totalDose = weight * dose;
          
          setResults({
            value: totalDose.toFixed(1),
            category: 'Dose totale calculée',
            color: 'text-purple-600',
            unit: 'mg'
          });
        }
        break;
      
      case 'apgar':
        const scores = ['appearance', 'pulse', 'grimace', 'activity', 'respiration'];
        const total = scores.reduce((sum, criterion) => {
          return sum + (parseInt(inputs[criterion]) || 0);
        }, 0);
        
        let category = '';
        let color = '';
        
        if (total >= 7) {
          category = 'Normal';
          color = 'text-green-600';
        } else if (total >= 4) {
          category = 'Surveillance nécessaire';
          color = 'text-yellow-600';
        } else {
          category = 'Réanimation nécessaire';
          color = 'text-red-600';
        }
        
        setResults({
          value: total,
          category,
          color,
          unit: '/10'
        });
        break;
    }
    
    toast.success('Calcul effectué avec succès');
  };

  const currentCalculator = calculators.find(calc => calc.id === selectedCalculator);
  const IconComponent = currentCalculator?.icon || Calculator;

  return (
    <MainLayout requireAuth={true}>
      <div className="container mx-auto py-6 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">
            Calculatrices Médicales
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Outils de calcul médical avancés pour l'aide à la décision clinique
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calculator Selection */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-medical-navy">Sélectionner un calculateur</h2>
            <div className="space-y-3">
              {calculators.map((calc) => {
                const IconComponent = calc.icon;
                return (
                  <Card 
                    key={calc.id} 
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                      selectedCalculator === calc.id 
                        ? 'border-medical-blue shadow-lg bg-gradient-to-r from-blue-50 to-teal-50' 
                        : 'border-gray-200 hover:border-medical-blue/50'
                    }`}
                    onClick={() => {
                      setSelectedCalculator(calc.id);
                      setInputs({});
                      setResults({});
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 rounded-lg ${calc.color} flex items-center justify-center flex-shrink-0`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{calc.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{calc.description}</p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {calc.category}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Calculator Form and Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Calculator */}
            <Card className="border-2 border-medical-blue/20 bg-gradient-to-br from-white to-gray-50/50">
              <CardHeader className="bg-gradient-to-r from-medical-blue to-medical-teal text-white rounded-t-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{currentCalculator?.name}</CardTitle>
                    <CardDescription className="text-white/80">
                      {currentCalculator?.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {getCalculatorForm()}
                
                <Separator className="my-6" />
                
                <Button 
                  onClick={calculateResult}
                  className="w-full bg-gradient-to-r from-medical-blue to-medical-teal hover:from-medical-blue/90 hover:to-medical-teal/90 text-white font-medium py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
                  size="lg"
                >
                  <Calculator className="h-5 w-5 mr-2" />
                  Calculer
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            {results.value && (
              <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Résultats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="text-5xl font-bold text-green-600">
                      {results.value}
                      <span className="text-lg text-gray-500 ml-2">{results.unit}</span>
                    </div>
                    <div className={`text-xl font-semibold ${results.color}`}>
                      {results.category}
                    </div>
                    
                    {/* Additional information based on calculator */}
                    {selectedCalculator === 'bmi' && (
                      <div className="mt-4 p-4 bg-white rounded-lg border">
                        <h4 className="font-semibold mb-2">Interprétation IMC</h4>
                        <div className="text-sm space-y-1 text-left">
                          <div>• &lt; 18.5 : Insuffisance pondérale</div>
                          <div>• 18.5 - 24.9 : Poids normal</div>
                          <div>• 25.0 - 29.9 : Surpoids</div>
                          <div>• ≥ 30.0 : Obésité</div>
                        </div>
                      </div>
                    )}
                    
                    {selectedCalculator === 'gfr' && (
                      <div className="mt-4 p-4 bg-white rounded-lg border">
                        <h4 className="font-semibold mb-2">Classification DFG</h4>
                        <div className="text-sm space-y-1 text-left">
                          <div>• ≥ 90 : Normal</div>
                          <div>• 60-89 : Légèrement diminué</div>
                          <div>• 30-59 : Modérément diminué</div>
                          <div>• &lt; 30 : Sévèrement diminué</div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MedicalCalculators;
