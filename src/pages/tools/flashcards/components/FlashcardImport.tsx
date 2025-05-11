
// Composant pour importer des fiches depuis différentes sources
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, FileUp, List } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Flashcard } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface FlashcardImportProps {
  onImport: (flashcards: Flashcard[]) => void;
}

/**
 * Composant pour importer des fiches d'étude depuis différentes sources
 */
const FlashcardImport: React.FC<FlashcardImportProps> = ({ onImport }) => {
  const [textData, setTextData] = useState('');
  const [activeTab, setActiveTab] = useState('csv');
  
  // Fonction pour gérer le changement d'onglet
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Fonction pour parser le format CSV
  const parseCsvData = (text: string): Flashcard[] => {
    try {
      const lines = text.trim().split('\n');
      return lines.map(line => {
        // Permet de gérer les virgules dans les questions/réponses (entourées de guillemets)
        const parts = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
        
        if (!parts || parts.length < 2) {
          throw new Error(`Format incorrect à la ligne: ${line}`);
        }
        
        // Nettoyer les guillemets si présents
        const question = parts[0].replace(/^"(.*)"$/, '$1').trim();
        const answer = parts[1].replace(/^"(.*)"$/, '$1').trim();
        
        // Catégorie optionnelle
        const category = parts[2] ? parts[2].replace(/^"(.*)"$/, '$1').trim() : undefined;
        
        if (!question || !answer) {
          throw new Error(`Question ou réponse manquante à la ligne: ${line}`);
        }
        
        return {
          id: uuidv4(),
          question,
          answer,
          category
        };
      });
    } catch (error: any) {
      toast.error("Erreur de format", { description: error.message });
      return [];
    }
  };

  // Fonction pour parser le format texte simple
  const parseTextData = (text: string): Flashcard[] => {
    try {
      const sections = text.split('---').filter(Boolean);
      
      return sections.map(section => {
        const lines = section.trim().split('\n');
        
        if (lines.length < 2) {
          throw new Error('Chaque section doit contenir au moins une question et une réponse');
        }
        
        const question = lines[0].trim();
        // La réponse peut être sur plusieurs lignes
        const answer = lines.slice(1).join('\n').trim();
        
        if (!question || !answer) {
          throw new Error('Question ou réponse manquante');
        }
        
        return {
          id: uuidv4(),
          question,
          answer
        };
      });
    } catch (error: any) {
      toast.error("Erreur de format", { description: error.message });
      return [];
    }
  };

  // Gestionnaire d'importation
  const handleImport = () => {
    if (!textData.trim()) {
      toast.error("Aucune donnée à importer");
      return;
    }
    
    let flashcards: Flashcard[] = [];
    
    if (activeTab === 'csv') {
      flashcards = parseCsvData(textData);
    } else {
      flashcards = parseTextData(textData);
    }
    
    if (flashcards.length > 0) {
      onImport(flashcards);
      toast.success(`${flashcards.length} fiches importées avec succès!`);
      setTextData('');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Importer des fiches</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="csv" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="csv" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              <span>Format CSV</span>
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileUp className="h-4 w-4" />
              <span>Format Texte</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="csv" className="space-y-4">
            <p className="text-sm text-gray-500">
              Entrez chaque fiche sur une ligne au format CSV: "Question","Réponse","Catégorie (optionnelle)"
            </p>
            <div className="bg-gray-50 p-2 rounded text-sm font-mono">
              <pre>Qu'est-ce que l'ADN?,Acide désoxyribonucléique,Biologie</pre>
              <pre>Quel est le symbole du sodium?,Na,Chimie</pre>
            </div>
          </TabsContent>
          
          <TabsContent value="text" className="space-y-4">
            <p className="text-sm text-gray-500">
              Entrez vos fiches au format texte: la première ligne est la question, les lignes suivantes sont la réponse.
              Utilisez "---" pour séparer les fiches.
            </p>
            <div className="bg-gray-50 p-2 rounded text-sm font-mono">
              <pre>Qu'est-ce que l'ADN?</pre>
              <pre>Acide désoxyribonucléique, molécule support de l'information génétique.</pre>
              <pre>---</pre>
              <pre>Quel est le symbole du sodium?</pre>
              <pre>Na</pre>
            </div>
          </TabsContent>
        </Tabs>
        
        <Textarea
          placeholder={
            activeTab === 'csv'
              ? 'Question,Réponse,Catégorie'
              : 'Question\nRéponse\n---\nQuestion\nRéponse'
          }
          value={textData}
          onChange={(e) => setTextData(e.target.value)}
          className="min-h-[200px]"
        />
        
        <Button 
          onClick={handleImport}
          disabled={!textData.trim()}
          className="w-full flex items-center gap-2"
        >
          <span>Importer</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default FlashcardImport;
