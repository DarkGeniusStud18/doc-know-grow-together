
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calculator, Heart, Activity, Thermometer, Droplets, History } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';

interface CalculatorResult {
  id: string;
  calculator_type: string;
  input_values: any;
  result_value: number;
  result_unit: string;
  notes?: string;
  created_at: string;
}

const MedicalCalculators: React.FC = () => {
  const { user } = useAuth();
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null);
  const [results, setResults] = useState<CalculatorResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // BMI Calculator state
  const [bmiInputs, setBmiInputs] = useState({ weight: '', height: '' });
  const [bmiResult, setBmiResult] = useState<number | null>(null);

  // Heart Rate Calculator state
  const [hrInputs, setHrInputs] = useState({ age: '', restingHR: '' });
  const [hrResult, setHrResult] = useState<{ min: number; max: number } | null>(null);

  // Body Surface Area Calculator state
  const [bsaInputs, setBsaInputs] = useState({ weight: '', height: '' });
  const [bsaResult, setBsaResult] = useState<number | null>(null);

  // Creatinine Clearance Calculator state
  const [crcInputs, setCrcInputs] = useState({ age: '', weight: '', creatinine: '', gender: 'male' });
  const [crcResult, setCrcResult] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      loadResults();
    }
  }, [user]);

  const loadResults = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('calculator_results')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error loading results:', error);
    } else {
      setResults(data || []);
    }
  };

  const saveResult = async (calculatorType: string, inputValues: any, resultValue: number, resultUnit: string, notes?: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('calculator_results')
      .insert({
        user_id: user.id,
        calculator_type: calculatorType,
        input_values: inputValues,
        result_value: resultValue,
        result_unit: resultUnit,
        notes,
      });

    if (error) {
      console.error('Error saving result:', error);
    } else {
      loadResults();
      toast.success('Résultat sauvegardé !');
    }
  };

  const calculateBMI = () => {
    const weight = parseFloat(bmiInputs.weight);
    const height = parseFloat(bmiInputs.height);

    if (!weight || !height) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    setBmiResult(bmi);
    
    saveResult('bmi', { weight, height }, bmi, 'kg/m²');
  };

  const calculateTargetHeartRate = () => {
    const age = parseInt(hrInputs.age);
    const restingHR = parseInt(hrInputs.restingHR);

    if (!age || !restingHR) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const maxHR = 220 - age;
    const hrReserve = maxHR - restingHR;
    const targetMin = Math.round(restingHR + (hrReserve * 0.5));
    const targetMax = Math.round(restingHR + (hrReserve * 0.85));

    setHrResult({ min: targetMin, max: targetMax });
    saveResult('target_heart_rate', { age, restingHR }, targetMin, 'bpm', `Zone cible: ${targetMin}-${targetMax} bpm`);
  };

  const calculateBSA = () => {
    const weight = parseFloat(bsaInputs.weight);
    const height = parseFloat(bsaInputs.height);

    if (!weight || !height) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    // Formule de Dubois
    const bsa = 0.007184 * Math.pow(weight, 0.425) * Math.pow(height, 0.725);
    setBsaResult(bsa);
    
    saveResult('body_surface_area', { weight, height }, bsa, 'm²');
  };

  const calculateCreatinineClearance = () => {
    const age = parseInt(crcInputs.age);
    const weight = parseFloat(crcInputs.weight);
    const creatinine = parseFloat(crcInputs.creatinine);

    if (!age || !weight || !creatinine) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    // Formule de Cockcroft-Gault
    let clearance = ((140 - age) * weight) / (72 * creatinine);
    if (crcInputs.gender === 'female') {
      clearance *= 0.85;
    }

    setCrcResult(clearance);
    saveResult('creatinine_clearance', { age, weight, creatinine, gender: crcInputs.gender }, clearance, 'mL/min');
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Insuffisance pondérale', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Poids normal', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Surpoids', color: 'text-yellow-600' };
    return { category: 'Obésité', color: 'text-red-600' };
  };

  const calculators = [
    {
      id: 'bmi',
      title: "IMC (Indice de Masse Corporelle)",
      description: "Calculez l'indice de masse corporelle d'un individu avec précision",
      icon: <Activity className="h-6 w-6 text-blue-500" />,
      category: "Général",
    },
    {
      id: 'heart_rate',
      title: "Fréquence cardiaque cible",
      description: "Déterminez votre zone de fréquence cardiaque optimale",
      icon: <Heart className="h-6 w-6 text-red-500" />,
      category: "Cardiologie",
    },
    {
      id: 'bsa',
      title: "Surface corporelle",
      description: "Calculez la surface corporelle selon la formule de Dubois",
      icon: <Thermometer className="h-6 w-6 text-orange-500" />,
      category: "Général",
    },
    {
      id: 'creatinine',
      title: "Clairance de la créatinine",
      description: "Estimez la fonction rénale avec la formule de Cockcroft-Gault",
      icon: <Droplets className="h-6 w-6 text-cyan-500" />,
      category: "Néphrologie",
    },
  ];

  return (
    <MainLayout requireAuth={true}>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calculator className="h-8 w-8 text-medical-blue" />
            <div>
              <h1 className="text-2xl font-bold">Calculateurs médicaux</h1>
              <p className="text-gray-500">Collection de calculateurs pour les calculs cliniques</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setShowHistory(!showHistory)}>
            <History className="mr-2 h-4 w-4" />
            Historique
          </Button>
        </div>

        {showHistory && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Historique des calculs</CardTitle>
            </CardHeader>
            <CardContent>
              {results.length > 0 ? (
                <div className="space-y-3">
                  {results.map((result) => (
                    <div key={result.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{result.calculator_type.replace('_', ' ').toUpperCase()}</span>
                          <span className="ml-2 text-lg font-bold text-blue-600">
                            {result.result_value.toFixed(2)} {result.result_unit}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(result.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {result.notes && (
                        <p className="text-sm text-gray-600 mt-1">{result.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">Aucun calcul enregistré</p>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculators.map((calculator) => (
            <Card key={calculator.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white shadow-sm">
                      {calculator.icon}
                    </div>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {calculator.category}
                  </span>
                </div>
                <CardTitle className="text-lg">{calculator.title}</CardTitle>
                <CardDescription>{calculator.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  onClick={() => setActiveCalculator(activeCalculator === calculator.id ? null : calculator.id)}
                >
                  {activeCalculator === calculator.id ? 'Fermer' : 'Utiliser'}
                </Button>

                {activeCalculator === calculator.id && (
                  <div className="mt-4 space-y-3">
                    {calculator.id === 'bmi' && (
                      <>
                        <Input
                          placeholder="Poids (kg)"
                          value={bmiInputs.weight}
                          onChange={(e) => setBmiInputs({ ...bmiInputs, weight: e.target.value })}
                        />
                        <Input
                          placeholder="Taille (cm)"
                          value={bmiInputs.height}
                          onChange={(e) => setBmiInputs({ ...bmiInputs, height: e.target.value })}
                        />
                        <Button onClick={calculateBMI} className="w-full">Calculer l'IMC</Button>
                        {bmiResult && (
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="font-medium">IMC: {bmiResult.toFixed(1)} kg/m²</p>
                            <p className={`text-sm ${getBMICategory(bmiResult).color}`}>
                              {getBMICategory(bmiResult).category}
                            </p>
                          </div>
                        )}
                      </>
                    )}

                    {calculator.id === 'heart_rate' && (
                      <>
                        <Input
                          placeholder="Âge (années)"
                          value={hrInputs.age}
                          onChange={(e) => setHrInputs({ ...hrInputs, age: e.target.value })}
                        />
                        <Input
                          placeholder="FC de repos (bpm)"
                          value={hrInputs.restingHR}
                          onChange={(e) => setHrInputs({ ...hrInputs, restingHR: e.target.value })}
                        />
                        <Button onClick={calculateTargetHeartRate} className="w-full">Calculer</Button>
                        {hrResult && (
                          <div className="p-3 bg-red-50 rounded-lg">
                            <p className="font-medium">Zone cible: {hrResult.min} - {hrResult.max} bpm</p>
                            <p className="text-sm text-gray-600">50-85% de la FC maximale</p>
                          </div>
                        )}
                      </>
                    )}

                    {calculator.id === 'bsa' && (
                      <>
                        <Input
                          placeholder="Poids (kg)"
                          value={bsaInputs.weight}
                          onChange={(e) => setBsaInputs({ ...bsaInputs, weight: e.target.value })}
                        />
                        <Input
                          placeholder="Taille (cm)"
                          value={bsaInputs.height}
                          onChange={(e) => setBsaInputs({ ...bsaInputs, height: e.target.value })}
                        />
                        <Button onClick={calculateBSA} className="w-full">Calculer la SC</Button>
                        {bsaResult && (
                          <div className="p-3 bg-orange-50 rounded-lg">
                            <p className="font-medium">Surface corporelle: {bsaResult.toFixed(2)} m²</p>
                            <p className="text-sm text-gray-600">Formule de Dubois</p>
                          </div>
                        )}
                      </>
                    )}

                    {calculator.id === 'creatinine' && (
                      <>
                        <Input
                          placeholder="Âge (années)"
                          value={crcInputs.age}
                          onChange={(e) => setCrcInputs({ ...crcInputs, age: e.target.value })}
                        />
                        <Input
                          placeholder="Poids (kg)"
                          value={crcInputs.weight}
                          onChange={(e) => setCrcInputs({ ...crcInputs, weight: e.target.value })}
                        />
                        <Input
                          placeholder="Créatinine (mg/dL)"
                          value={crcInputs.creatinine}
                          onChange={(e) => setCrcInputs({ ...crcInputs, creatinine: e.target.value })}
                        />
                        <select 
                          className="w-full p-2 border rounded"
                          value={crcInputs.gender}
                          onChange={(e) => setCrcInputs({ ...crcInputs, gender: e.target.value })}
                        >
                          <option value="male">Homme</option>
                          <option value="female">Femme</option>
                        </select>
                        <Button onClick={calculateCreatinineClearance} className="w-full">Calculer la clairance</Button>
                        {crcResult && (
                          <div className="p-3 bg-cyan-50 rounded-lg">
                            <p className="font-medium">Clairance: {crcResult.toFixed(1)} mL/min</p>
                            <p className="text-sm text-gray-600">Formule de Cockcroft-Gault</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default MedicalCalculators;
