
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookOpen, Download, Clock, ArrowLeft, Play, FileText, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

// Types pour les ressources
type Resource = {
  id: string;
  title: string;
  description: string;
  content_type: string;
  category: string;
  language: string;
  author: string | null;
  url: string;
  thumbnail: string | null;
  featured: boolean;
  is_premium: boolean;
  requires_verification: boolean;
  created_at: string;
  updated_at: string;
  content?: string;
  related_resources?: RelatedResource[];
  videos?: ResourceVideo[];
  images?: ResourceImage[];
};

type RelatedResource = {
  id: string;
  title: string;
  content_type: string;
  thumbnail: string | null;
};

type ResourceVideo = {
  title: string;
  url: string;
  thumbnail?: string;
  duration: string;
};

type ResourceImage = {
  title: string;
  url: string;
  description?: string;
};

// Données enrichies (en pratique, viendraient d'une base de données)
const ENRICHED_CONTENT: Record<string, Partial<Resource>> = {
  "1": {
    content: `# Atlas d'anatomie humaine

L'atlas d'anatomie humaine est un ouvrage de référence complet qui présente les structures anatomiques du corps humain avec un niveau de détail exceptionnel. Conçu pour les étudiants en médecine, les professionnels de la santé et tous ceux qui s'intéressent à l'anatomie humaine, cet ouvrage combine des illustrations de haute qualité avec des descriptions précises.

## Contenu

- **Système musculosquelettique**: Présentation détaillée des os, articulations et muscles.
- **Système nerveux**: Illustrations du cerveau, de la moelle épinière et des nerfs périphériques.
- **Système cardiovasculaire**: Cartographie complète du cœur et des vaisseaux sanguins.
- **Systèmes respiratoire et digestif**: Anatomie détaillée des poumons, de l'estomac et des intestins.
- **Systèmes urinaire et reproducteur**: Illustrations précises des organes et de leurs connexions.

## Caractéristiques principales

- Plus de 500 illustrations anatomiques en couleur
- Nomenclature anatomique complète en latin et en français
- Index détaillé pour une recherche facile
- Présentation systématique région par région
- Notes cliniques pour mettre en évidence l'importance médicale

Ce document constitue un outil indispensable pour l'apprentissage de l'anatomie humaine et la préparation aux examens médicaux.`,
    videos: [
      {
        title: "Introduction à l'Atlas d'anatomie",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=500",
        duration: "5:42"
      },
      {
        title: "Système musculosquelettique - Aperçu",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=500",
        duration: "12:18"
      }
    ],
    images: [
      {
        title: "Anatomie du cœur humain",
        url: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800",
        description: "Vue détaillée des chambres cardiaques et des valves"
      },
      {
        title: "Système nerveux central",
        url: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800",
        description: "Vue latérale du cerveau et de ses principales structures"
      },
      {
        title: "Anatomie musculaire",
        url: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800",
        description: "Vue frontale des principaux groupes musculaires"
      }
    ],
    related_resources: [
      {
        id: "3",
        title: "Dissection du membre supérieur",
        content_type: "video",
        thumbnail: "/placeholder.svg"
      },
      {
        id: "5",
        title: "Fondamentaux de la neurologie",
        content_type: "document",
        thumbnail: "/placeholder.svg"
      }
    ]
  },
  "2": {
    content: `# Guide de pharmacologie clinique

Ce guide de pharmacologie clinique offre une présentation complète des principes fondamentaux de la pharmacologie, adaptée aux besoins des étudiants en médecine et des professionnels de santé. Il couvre l'ensemble des aspects essentiels, de la pharmacocinétique à la pharmacodynamie, en passant par les interactions médicamenteuses et les effets indésirables.

## Contenu principal

- **Principes généraux de pharmacologie**: Mécanismes d'action, absorption, distribution, métabolisme et excrétion.
- **Pharmacologie par système corporel**: Médicaments affectant les systèmes cardiovasculaire, respiratoire, nerveux, digestif, etc.
- **Antibiotiques et agents anti-infectieux**: Classification, spectre d'activité et résistance antimicrobienne.
- **Pharmacologie de la douleur**: Analgésiques, anesthésiques et traitement de la douleur chronique.
- **Interactions médicamenteuses**: Mécanismes, conséquences cliniques et stratégies de prévention.

## Caractéristiques pédagogiques

- Tableaux récapitulatifs des principaux médicaments par classe
- Études de cas cliniques pour illustrer l'application pratique
- Algorithmes de prise de décision thérapeutique
- Questions d'auto-évaluation à la fin de chaque chapitre
- Références aux dernières recommandations de pratique clinique

Ce guide est conçu pour servir de référence rapide et fiable dans la pratique clinique quotidienne, tout en fournissant les bases théoriques nécessaires à la compréhension approfondie de la pharmacologie.`,
    videos: [
      {
        title: "Principes de base de pharmacocinétique",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500",
        duration: "14:23"
      }
    ],
    images: [
      {
        title: "Cycle d'action des médicaments",
        url: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800",
        description: "Diagramme du cycle complet ADME (Absorption, Distribution, Métabolisme, Excrétion)"
      },
      {
        title: "Interactions médicamenteuses courantes",
        url: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800",
        description: "Tableau des interactions médicamenteuses les plus fréquentes en pratique clinique"
      }
    ],
    related_resources: [
      {
        id: "4",
        title: "Diagnostic différentiel en médecine interne",
        content_type: "book",
        thumbnail: "/placeholder.svg"
      }
    ]
  },
  "3": {
    content: `# Vidéo éducative: Dissection du membre supérieur

Cette vidéo éducative présente une dissection détaillée du membre supérieur humain, réalisée par des anatomistes experts. Elle offre une visualisation claire des structures anatomiques et de leurs relations spatiales, accompagnée d'explications précises sur la fonction et l'importance clinique de chaque élément.

## Points abordés

- **Architecture osseuse**: Clavicule, scapula, humérus, radius et ulna.
- **Articulations majeures**: Épaule, coude et poignet.
- **Groupes musculaires**: Deltoïde, biceps, triceps et muscles de l'avant-bras.
- **Vascularisation**: Artères sous-clavière, axillaire, brachiale, et leurs branches.
- **Innervation**: Plexus brachial et ses divisions en nerfs périphériques.

## Intérêt pédagogique

Cette ressource est particulièrement utile pour:
- Les étudiants en médecine préparant leurs examens d'anatomie
- Les étudiants en physiothérapie et kinésithérapie
- Les chirurgiens orthopédiques en formation
- Les professionnels de santé souhaitant rafraîchir leurs connaissances anatomiques

La vidéo comprend des séquences filmées en haute définition, des animations 3D pour clarifier certains concepts complexes, et des repères visuels pour identifier facilement les structures anatomiques importantes.`,
    videos: [
      {
        title: "Dissection complète du membre supérieur",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=500",
        duration: "45:00"
      },
      {
        title: "Focus sur l'articulation de l'épaule",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1579684453377-8b660f7172b0?w=500",
        duration: "12:35"
      },
      {
        title: "Innervation du membre supérieur",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1578496479932-143a1908d7fe?w=500",
        duration: "18:22"
      }
    ],
    images: [
      {
        title: "Muscles de l'avant-bras",
        url: "https://images.unsplash.com/photo-1579684453377-8b660f7172b0?w=800",
        description: "Vue antérieure des muscles de l'avant-bras avec légendes"
      }
    ],
    related_resources: [
      {
        id: "1",
        title: "Atlas d'anatomie humaine",
        content_type: "book",
        thumbnail: "/placeholder.svg"
      }
    ]
  },
  "4": {
    content: `# Diagnostic différentiel en médecine interne

Ce guide pratique de diagnostic différentiel en médecine interne est un outil essentiel pour tout clinicien confronté à des présentations cliniques complexes. L'ouvrage adopte une approche méthodique, organisée par symptômes et signes cliniques, pour aider les médecins à développer un raisonnement diagnostique structuré et exhaustif.

## Organisation du contenu

- **Approche par symptômes**: Fièvre, douleur thoracique, dyspnée, œdème, etc.
- **Syndromes cliniques**: Insuffisance cardiaque, syndrome néphrotique, etc.
- **Anomalies biologiques**: Anémie, hypercalcémie, perturbations des tests hépatiques, etc.
- **Approches diagnostiques spécifiques**: Maladies rares, présentations atypiques, comorbidités

## Caractéristiques distinctives

L'ouvrage se distingue par:
- Des algorithmes décisionnels clairs pour guider la démarche diagnostique
- Des tableaux comparatifs des pathologies pouvant produire des symptômes similaires
- Des conseils sur les explorations complémentaires à privilégier selon les hypothèses
- Des alertes sur les diagnostics à ne pas manquer (urgences diagnostiques)
- Des études de cas illustrant l'application du raisonnement différentiel

Ce guide est conçu pour être utilisé aussi bien au chevet du patient que dans un contexte de formation médicale, permettant d'affiner le jugement clinique et d'optimiser la prise en charge des patients.`,
    videos: [
      {
        title: "Introduction au diagnostic différentiel",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500",
        duration: "8:45"
      }
    ],
    images: [
      {
        title: "Algorithme de diagnostic de la douleur thoracique",
        url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800",
        description: "Arbre décisionnel pour l'évaluation de la douleur thoracique en médecine interne"
      },
      {
        title: "Diagnostic différentiel de l'anémie",
        url: "https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=800",
        description: "Tableau comparatif des différents types d'anémie et leurs caractéristiques"
      }
    ],
    related_resources: [
      {
        id: "5",
        title: "Fondamentaux de la neurologie",
        content_type: "document",
        thumbnail: "/placeholder.svg"
      }
    ]
  },
  "5": {
    content: `# Fondamentaux de la neurologie

Ce document présente les bases essentielles pour comprendre le système nerveux et ses pathologies. Conçu comme une ressource pédagogique complète, il couvre les aspects anatomiques, physiologiques et cliniques de la neurologie, offrant une vision intégrée de cette discipline médicale complexe.

## Structure et contenu

- **Neuroanatomie fonctionnelle**: Organisation du système nerveux central et périphérique.
- **Neurophysiologie**: Principes de base du fonctionnement neuronal et de la transmission synaptique.
- **Sémiologie neurologique**: Examen clinique et interprétation des signes neurologiques.
- **Pathologies neurologiques courantes**: 
  - Accidents vasculaires cérébraux
  - Épilepsies
  - Maladies neurodégénératives
  - Céphalées et migraines
  - Neuropathies périphériques
- **Approche diagnostique**: Stratégies d'investigation en neurologie.

## Caractéristiques pédagogiques

Le document intègre de nombreuses aides à l'apprentissage:
- Schémas anatomiques détaillés avec corrélations cliniques
- Illustrations des voies neurologiques et de leur sémiologie
- Tableaux synoptiques des principales pathologies
- Cas cliniques commentés avec raisonnement diagnostique
- Iconographie d'imagerie neurologique (IRM, scanner, électroencéphalogrammes)

Ce document est particulièrement adapté aux étudiants en médecine, internes en neurologie, et médecins généralistes souhaitant actualiser leurs connaissances en neurologie.`,
    videos: [
      {
        title: "Introduction à la neuroanatomie",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=500",
        duration: "17:32"
      },
      {
        title: "Examen neurologique complet",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=500",
        duration: "22:15"
      }
    ],
    images: [
      {
        title: "Anatomie du système nerveux central",
        url: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800",
        description: "Coupe sagittale du cerveau montrant les principales structures"
      },
      {
        title: "Voies neurologiques sensitives",
        url: "https://images.unsplash.com/photo-1583912268183-46dde2f6bc52?w=800",
        description: "Schéma des voies sensitives de la moelle épinière au cortex cérébral"
      },
      {
        title: "IRM cérébrale normale",
        url: "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=800",
        description: "Image d'IRM cérébrale en coupe axiale avec annotations des structures"
      }
    ],
    related_resources: [
      {
        id: "1",
        title: "Atlas d'anatomie humaine",
        content_type: "book",
        thumbnail: "/placeholder.svg"
      },
      {
        id: "6",
        title: "Examen clinique cardiovasculaire",
        content_type: "video",
        thumbnail: "/placeholder.svg"
      }
    ]
  },
  "6": {
    content: `# Examen clinique cardiovasculaire

Cette vidéo éducative présente les techniques et méthodologies pour réaliser un examen cardiovasculaire complet et précis. Elle offre une démonstration pas à pas des différentes étapes de l'examen, accompagnée d'explications détaillées sur la signification clinique des observations.

## Contenu de la vidéo

- **Inspection**: Observation de l'aspect général, des signes cutanés, du pouls visible, etc.
- **Palpation**: Technique de palpation des pouls périphériques, du choc de pointe, des œdèmes.
- **Percussion**: Délimitation des contours cardiaques.
- **Auscultation**: 
  - Technique d'auscultation cardiaque
  - Reconnaissance des bruits cardiaques normaux
  - Identification des souffles cardiaques et leur interprétation
  - Auscultation des vaisseaux

## Points forts pédagogiques

La vidéo comprend:
- Des démonstrations cliniques en conditions réelles
- Des animations illustrant les phénomènes physiologiques sous-jacents
- Des séquences audio des différents bruits cardiaques normaux et pathologiques
- Des corrélations entre les signes cliniques et les pathologies cardiovasculaires
- Des conseils pratiques pour optimiser l'examen clinique

Cette ressource est particulièrement utile pour les étudiants en médecine, les internes, et les médecins souhaitant perfectionner leur technique d'examen cardiovasculaire.`,
    videos: [
      {
        title: "Examen clinique cardiovasculaire complet",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1628348068343-c6a848eb2bf4?w=500",
        duration: "32:00"
      },
      {
        title: "Focus sur l'auscultation cardiaque",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500",
        duration: "12:45"
      }
    ],
    images: [
      {
        title: "Points d'auscultation cardiaque",
        url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
        description: "Schéma des quatre foyers d'auscultation cardiaque sur le thorax"
      },
      {
        title: "Cycle cardiaque et bruits",
        url: "https://images.unsplash.com/photo-1628348068343-c6a848eb2bf4?w=800",
        description: "Illustration du cycle cardiaque corrélé aux bruits auscultatoires"
      }
    ],
    related_resources: [
      {
        id: "4",
        title: "Diagnostic différentiel en médecine interne",
        content_type: "book",
        thumbnail: "/placeholder.svg"
      }
    ]
  }
};

const ResourceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("content");
  
  // Récupération des données de la ressource
  const { data: resource, isLoading, error } = useQuery({
    queryKey: ['resource', id],
    queryFn: async () => {
      // En production, cette requête récupérerait les données depuis la base de données
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      // Enrichissement des données avec le contenu personnalisé
      if (ENRICHED_CONTENT[id as string]) {
        return {
          ...data,
          ...ENRICHED_CONTENT[id as string]
        };
      }
      
      return data;
    },
    enabled: !!id
  });
  
  // Fonction pour formater le temps de lecture estimé
  const estimatedReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content?.split(/\s+/).length || 0;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  };
  
  // Fonction pour rendre le contenu Markdown en HTML (simplifiée)
  const renderMarkdown = (content: string) => {
    if (!content) return '';
    
    // Transformation basique des titres et paragraphes (en production, utilisez une bibliothèque comme marked)
    const html = content
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-5 mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mt-4 mb-2">$1</h3>')
      .replace(/^- (.*$)/gm, '<li class="ml-6 list-disc">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4">');
      
    return '<p class="mb-4">' + html + '</p>';
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-teal"></div>
        </div>
      </MainLayout>
    );
  }
  
  if (error || !resource) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6">
          <div className="flex flex-col items-center justify-center py-12">
            <h2 className="text-2xl font-bold mb-4">Ressource non trouvée</h2>
            <p className="text-gray-600 mb-6">La ressource que vous recherchez n'existe pas ou n'est plus disponible.</p>
            <Button onClick={() => navigate('/resources')}>
              Retour aux ressources
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        {/* En-tête avec bouton de retour */}
        <Button 
          variant="outline" 
          className="mb-6" 
          onClick={() => navigate('/resources')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux ressources
        </Button>
        
        {/* En-tête de la ressource */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge>{resource.category}</Badge>
            <Badge variant="outline" className="flex items-center">
              <FileText className="h-3 w-3 mr-1" /> 
              {resource.content_type === 'book' ? 'Livre' : 
               resource.content_type === 'video' ? 'Vidéo' : 'Document'}
            </Badge>
            {resource.featured && (
              <Badge className="bg-medical-teal">À la une</Badge>
            )}
            {resource.language && (
              <Badge variant="secondary">{resource.language === 'fr' ? 'Français' : resource.language}</Badge>
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-medical-navy mb-3">{resource.title}</h1>
          
          <p className="text-gray-600 mb-4">{resource.description}</p>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
            {resource.author && (
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback>{resource.author.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span>{resource.author}</span>
              </div>
            )}
            
            {resource.content && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>Lecture: {estimatedReadingTime(resource.content)} min</span>
              </div>
            )}
            
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              <span>Mis à jour le {new Date(resource.updated_at).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </div>
        
        {/* Contenu principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card className="overflow-hidden">
              {/* Image principale ou vidéo en vedette */}
              {resource.content_type === 'video' && resource.videos && resource.videos[0] ? (
                <div className="aspect-w-16 aspect-h-9">
                  <iframe 
                    src={resource.videos[0].url}
                    title={resource.videos[0].title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              ) : (
                resource.images && resource.images[0] && (
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                    <img 
                      src={resource.images[0].url} 
                      alt={resource.images[0].title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )
              )}
              
              {/* Onglets pour naviguer entre le contenu, les vidéos et les images */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="px-6 pt-6 border-b">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="content">Contenu</TabsTrigger>
                    {resource.videos && resource.videos.length > 0 && (
                      <TabsTrigger value="videos">Vidéos ({resource.videos.length})</TabsTrigger>
                    )}
                    {resource.images && resource.images.length > 0 && (
                      <TabsTrigger value="images">Images ({resource.images.length})</TabsTrigger>
                    )}
                  </TabsList>
                </div>
                
                {/* Onglet de contenu textuel */}
                <TabsContent value="content" className="p-0">
                  <CardContent className="p-6">
                    {resource.content ? (
                      <div 
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(resource.content) }}
                      />
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>Le contenu détaillé de cette ressource n'est pas disponible.</p>
                      </div>
                    )}
                    
                    {/* Boutons d'action */}
                    <div className="flex gap-3 mt-8">
                      <Button className="flex-1">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Accéder à la ressource complète
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  </CardContent>
                </TabsContent>
                
                {/* Onglet des vidéos */}
                <TabsContent value="videos" className="p-0">
                  <CardContent className="p-6">
                    {resource.videos && resource.videos.length > 0 ? (
                      <div className="space-y-6">
                        {resource.videos.map((video, index) => (
                          <div key={index} className="group">
                            <div className="relative rounded-lg overflow-hidden mb-2">
                              {/* Miniature de la vidéo avec bouton de lecture */}
                              <AspectRatio ratio={16 / 9}>
                                <img 
                                  src={video.thumbnail || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d"} 
                                  alt={video.title} 
                                  className="w-full h-full object-cover transition-opacity group-hover:opacity-90"
                                />
                              </AspectRatio>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Button 
                                  size="icon" 
                                  className="w-14 h-14 rounded-full bg-medical-navy/80 hover:bg-medical-navy transition-colors group-hover:scale-105"
                                >
                                  <Play className="h-7 w-7" />
                                </Button>
                              </div>
                              {video.duration && (
                                <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 text-xs text-white rounded">
                                  {video.duration}
                                </div>
                              )}
                            </div>
                            <h3 className="font-medium">{video.title}</h3>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>Aucune vidéo disponible pour cette ressource.</p>
                      </div>
                    )}
                  </CardContent>
                </TabsContent>
                
                {/* Onglet des images */}
                <TabsContent value="images" className="p-0">
                  <CardContent className="p-6">
                    {resource.images && resource.images.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {resource.images.map((image, index) => (
                          <div key={index} className="space-y-1">
                            <div className="rounded-lg overflow-hidden border">
                              <AspectRatio ratio={4 / 3}>
                                <img 
                                  src={image.url} 
                                  alt={image.title} 
                                  className="w-full h-full object-cover"
                                />
                              </AspectRatio>
                            </div>
                            <h3 className="font-medium text-sm">{image.title}</h3>
                            {image.description && (
                              <p className="text-xs text-gray-500">{image.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>Aucune image disponible pour cette ressource.</p>
                      </div>
                    )}
                  </CardContent>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
          
          {/* Sidebar avec ressources associées */}
          <div className="space-y-8">
            {/* Carte pour accéder à la ressource complète */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Accéder à cette ressource</h3>
                <Button className="w-full">
                  {resource.content_type === 'video' ? (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Regarder
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Lire
                    </>
                  )}
                </Button>
                
                <Button variant="outline" className="w-full mt-2">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
              </CardContent>
            </Card>
            
            {/* Ressources connexes */}
            {resource.related_resources && resource.related_resources.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Ressources associées</h3>
                  <div className="space-y-4">
                    {resource.related_resources.map((relatedResource, index) => (
                      <div 
                        key={index} 
                        className="flex gap-3 items-center hover:bg-gray-50 p-2 rounded-md cursor-pointer"
                        onClick={() => navigate(`/resources/${relatedResource.id}`)}
                      >
                        <div className="w-16 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          <img 
                            src={relatedResource.thumbnail || "/placeholder.svg"} 
                            alt={relatedResource.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm line-clamp-2">{relatedResource.title}</h4>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              {relatedResource.content_type === 'book' ? 'Livre' : 
                              relatedResource.content_type === 'video' ? 'Vidéo' : 'Document'}
                            </Badge>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    ))}
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

export default ResourceDetail;
