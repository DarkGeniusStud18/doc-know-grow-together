
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Book, BookOpen, Download, FileText, Video } from 'lucide-react';
import SEOHead from '@/components/seo/SEOHead';
import { toast } from 'sonner';

// Simulated resource data - in a real app, this would be fetched from an API
const RESOURCES = [
  {
    id: "1",
    title: "Atlas d'anatomie humaine",
    description: "Un atlas complet d'anatomie humaine avec illustrations détaillées du corps humain. Cet atlas offre une représentation précise et détaillée de l'anatomie humaine, permettant aux étudiants et professionnels de la santé de visualiser clairement les structures anatomiques. Les illustrations sont accompagnées de légendes précises et d'explications concises pour faciliter l'apprentissage.",
    content: "L'atlas d'anatomie humaine est un outil essentiel pour les étudiants en médecine et les professionnels de la santé. Il présente une vision complète et détaillée du corps humain, des os aux organes internes. Les illustrations de haute qualité permettent une visualisation claire des structures anatomiques, facilitant ainsi l'apprentissage et la compréhension. Cet atlas couvre tous les systèmes du corps humain, y compris le système musculo-squelettique, le système nerveux, le système cardiovasculaire, le système respiratoire, le système digestif, le système urinaire, le système reproducteur, et le système endocrinien. Chaque section comprend des vues multiples et des coupes transversales pour une compréhension en trois dimensions des structures anatomiques.",
    type: "book",
    category: "anatomy",
    language: "fr",
    thumbnail: "/placeholder.svg",
    featured: true,
    author: "Dr. Jean Dupont",
    publishedDate: "2024-01-15",
    fileSize: "45.7 MB",
    format: "PDF",
    pages: 512,
    downloadUrl: "#",
    relatedResources: [3, 4],
    tags: ["anatomie", "corps humain", "atlas médical", "illustrations"]
  },
  {
    id: "2",
    title: "Guide de pharmacologie clinique",
    description: "Les principes fondamentaux de la pharmacologie pour les étudiants en médecine",
    content: "Ce guide complet de pharmacologie clinique couvre les principes fondamentaux de la pharmacodynamie et de la pharmacocinétique, ainsi que les applications cliniques des médicaments couramment utilisés. Il présente les mécanismes d'action, les indications thérapeutiques, les contre-indications, les effets indésirables et les interactions médicamenteuses importantes. Ce guide est essentiel pour comprendre comment les médicaments agissent dans l'organisme et comment les utiliser efficacement dans la pratique clinique.",
    type: "document",
    category: "pharmacology",
    language: "fr",
    thumbnail: "/placeholder.svg",
    author: "Dr. Marie Lambert",
    publishedDate: "2023-09-22",
    fileSize: "28.3 MB",
    format: "PDF",
    pages: 340,
    downloadUrl: "#",
    tags: ["pharmacologie", "médicaments", "thérapeutique"]
  },
  {
    id: "3",
    title: "Dissection du membre supérieur",
    description: "Vidéo éducative montrant la dissection détaillée du membre supérieur",
    content: "Cette vidéo éducative présente une dissection complète et détaillée du membre supérieur. Elle montre les structures anatomiques importantes, y compris les os, les muscles, les vaisseaux sanguins, les nerfs et les articulations. La dissection est accompagnée d'explications claires sur les relations anatomiques et les implications cliniques. Cette vidéo est un outil précieux pour les étudiants en médecine et en anatomie.",
    type: "video",
    category: "anatomy",
    language: "fr",
    duration: "45 min",
    thumbnail: "/placeholder.svg",
    author: "Prof. Philippe Martin",
    publishedDate: "2023-11-30",
    fileSize: "1.2 GB",
    format: "MP4",
    downloadUrl: "#",
    tags: ["anatomie", "dissection", "membre supérieur"]
  },
  {
    id: "4",
    title: "Diagnostic différentiel en médecine interne",
    description: "Un guide pratique pour établir des diagnostics différentiels",
    content: "Ce livre présente une approche systématique pour établir des diagnostics différentiels en médecine interne. Il couvre les principaux symptômes et signes cliniques, ainsi que les stratégies pour affiner le diagnostic. Le guide inclut des arbres décisionnels, des études de cas cliniques et des recommandations basées sur les preuves. C'est un outil indispensable pour les médecins et les étudiants qui cherchent à développer leur raisonnement clinique.",
    type: "book",
    category: "internal-medicine",
    language: "fr",
    thumbnail: "/placeholder.svg",
    author: "Dr. Thomas Bernard",
    publishedDate: "2023-06-12",
    fileSize: "32.5 MB",
    format: "PDF",
    pages: 420,
    downloadUrl: "#",
    tags: ["diagnostic", "médecine interne", "raisonnement clinique"]
  },
  {
    id: "5",
    title: "Fondamentaux de la neurologie",
    description: "Les bases essentielles pour comprendre le système nerveux et ses pathologies",
    content: "Ce document couvre les concepts fondamentaux de la neurologie, depuis l'anatomie et la physiologie du système nerveux jusqu'aux principales pathologies neurologiques. Il présente les méthodes d'examen neurologique, les tests diagnostiques courants et les approches thérapeutiques. Le document inclut également des illustrations détaillées des voies neurologiques et des cas cliniques pour illustrer les concepts présentés.",
    type: "document",
    category: "neurology",
    language: "fr",
    thumbnail: "/placeholder.svg",
    featured: true,
    author: "Dr. Sophie Dubois",
    publishedDate: "2024-02-28",
    fileSize: "18.9 MB",
    format: "PDF",
    pages: 280,
    downloadUrl: "#",
    tags: ["neurologie", "système nerveux", "pathologies neurologiques"]
  },
  {
    id: "6",
    title: "Examen clinique cardiovasculaire",
    description: "Techniques et méthodologies pour l'examen cardiovasculaire",
    content: "Cette vidéo démontre les techniques appropriées pour réaliser un examen clinique cardiovasculaire complet. Elle couvre l'inspection, la palpation, la percussion et l'auscultation cardiaque, ainsi que l'évaluation du système vasculaire périphérique. La vidéo met en évidence les signes cliniques importants et explique leur signification diagnostique. C'est une ressource essentielle pour les étudiants et les professionnels de la santé qui souhaitent perfectionner leurs compétences d'examen clinique.",
    type: "video",
    category: "cardiology",
    language: "fr",
    duration: "32 min",
    thumbnail: "/placeholder.svg",
    author: "Dr. Antoine Moreau",
    publishedDate: "2023-10-15",
    fileSize: "850 MB",
    format: "MP4",
    downloadUrl: "#",
    tags: ["cardiologie", "examen clinique", "auscultation"]
  },
];

/**
 * Composant pour afficher une ressource détaillée
 */
const ResourceArticle: React.FC = () => {
  const { resourceId } = useParams<{ resourceId: string }>();
  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [relatedResources, setRelatedResources] = useState<any[]>([]);
  
  // Récupération de la ressource par ID
  useEffect(() => {
    setLoading(true);
    
    // Simulation d'un appel API
    setTimeout(() => {
      const foundResource = RESOURCES.find(r => r.id === resourceId);
      setResource(foundResource || null);
      
      // Récupération des ressources liées
      if (foundResource && foundResource.relatedResources) {
        const related = RESOURCES.filter(r => 
          foundResource.relatedResources.includes(parseInt(r.id))
        );
        setRelatedResources(related);
      }
      
      setLoading(false);
    }, 500);
  }, [resourceId]);
  
  // Gestion du téléchargement
  const handleDownload = () => {
    toast.success("Téléchargement démarré", {
      description: `Le fichier ${resource?.title} sera bientôt disponible`
    });
  };
  
  // Icône en fonction du type de ressource
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'book':
        return <Book className="h-6 w-6" />;
      case 'video':
        return <Video className="h-6 w-6" />;
      case 'document':
      default:
        return <FileText className="h-6 w-6" />;
    }
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded-md w-80"></div>
            <div className="h-64 bg-gray-200 rounded-md w-full"></div>
            <div className="h-8 bg-gray-200 rounded-md w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded-md w-1/2"></div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!resource) {
    return (
      <MainLayout>
        <div className="py-16 px-4 text-center">
          <div className="mb-8">
            <FileText className="h-16 w-16 text-gray-400 mx-auto" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Ressource non trouvée</h2>
          <p className="text-gray-600 mb-8">
            La ressource que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <Link to="/resources">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux ressources
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <SEOHead 
        title={`${resource.title} | MedCollab`}
        description={resource.description}
        canonicalUrl={`/resources/${resourceId}`}
      />
      
      <div className="space-y-6">
        {/* Bouton retour et fil d'Ariane */}
        <div>
          <Link to="/resources">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux ressources
            </Button>
          </Link>
        </div>
        
        {/* En-tête de la ressource */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Vignette à gauche */}
          <div className="md:col-span-1">
            <div className="bg-gray-100 rounded-lg overflow-hidden aspect-[3/4] relative">
              <img 
                src={resource.thumbnail} 
                alt={resource.title}
                className="w-full h-full object-cover"
              />
              {resource.type === 'video' && (
                <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                  {resource.duration}
                </div>
              )}
            </div>
            
            {/* Bouton de téléchargement */}
            <Button 
              className="w-full mt-4" 
              size="lg"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
            
            {/* Informations sur le fichier */}
            <Card className="mt-4">
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">Informations</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-500">Format:</span>
                    <span>{resource.format}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">Taille:</span>
                    <span>{resource.fileSize}</span>
                  </li>
                  {resource.pages && (
                    <li className="flex justify-between">
                      <span className="text-gray-500">Pages:</span>
                      <span>{resource.pages}</span>
                    </li>
                  )}
                  <li className="flex justify-between">
                    <span className="text-gray-500">Publié le:</span>
                    <span>{new Date(resource.publishedDate).toLocaleDateString()}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">Auteur:</span>
                    <span>{resource.author}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">Langue:</span>
                    <span>Français</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          {/* Contenu principal à droite */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-gray-200 text-gray-800 hover:bg-gray-300">
                {resource.category === 'anatomy' ? 'Anatomie' : 
                 resource.category === 'pharmacology' ? 'Pharmacologie' :
                 resource.category === 'internal-medicine' ? 'Médecine interne' :
                 resource.category === 'cardiology' ? 'Cardiologie' :
                 resource.category === 'neurology' ? 'Neurologie' : 
                 resource.category}
              </Badge>
              <Badge className={`
                ${resource.type === 'book' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : 
                 resource.type === 'video' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
                 'bg-green-100 text-green-800 hover:bg-green-200'}
              `}>
                <div className="flex items-center gap-1">
                  {getResourceIcon(resource.type)}
                  <span>
                    {resource.type === 'book' ? 'Livre' : 
                     resource.type === 'video' ? 'Vidéo' : 'Document'}
                  </span>
                </div>
              </Badge>
              {resource.featured && (
                <Badge className="bg-medical-teal text-white">
                  À la une
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{resource.title}</h1>
            <p className="text-gray-700 mb-8">{resource.description}</p>
            
            {/* Onglets de contenu */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="overview" className="flex-1">Aperçu</TabsTrigger>
                <TabsTrigger value="content" className="flex-1">Contenu</TabsTrigger>
                {resource.type === 'video' && (
                  <TabsTrigger value="watch" className="flex-1">Regarder</TabsTrigger>
                )}
                {relatedResources.length > 0 && (
                  <TabsTrigger value="related" className="flex-1">Connexes</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="overview" className="pt-6">
                <div className="prose max-w-none">
                  <p className="leading-relaxed text-gray-700">{resource.content}</p>
                </div>
                
                {/* Tags */}
                {resource.tags && resource.tags.length > 0 && (
                  <div className="mt-8">
                    <h3 className="font-medium mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {resource.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="content" className="pt-6">
                {resource.type === 'book' || resource.type === 'document' ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className="font-medium mb-4">Table des matières</h3>
                    <ul className="space-y-3">
                      <li className="flex justify-between">
                        <span>Introduction</span>
                        <span className="text-gray-500">Page 1</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Chapitre 1: Principes fondamentaux</span>
                        <span className="text-gray-500">Page 15</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Chapitre 2: Applications cliniques</span>
                        <span className="text-gray-500">Page 42</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Chapitre 3: Études de cas</span>
                        <span className="text-gray-500">Page 87</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Conclusion</span>
                        <span className="text-gray-500">Page 120</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Références</span>
                        <span className="text-gray-500">Page 125</span>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className="font-medium mb-4">Segments</h3>
                    <ul className="space-y-3">
                      <li className="flex justify-between">
                        <span>Introduction</span>
                        <span className="text-gray-500">00:00 - 02:15</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Présentation de la technique</span>
                        <span className="text-gray-500">02:16 - 10:45</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Démonstration pratique</span>
                        <span className="text-gray-500">10:46 - 25:30</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Cas cliniques</span>
                        <span className="text-gray-500">25:31 - 40:20</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Conclusion</span>
                        <span className="text-gray-500">40:21 - 45:00</span>
                      </li>
                    </ul>
                  </div>
                )}
              </TabsContent>
              
              {resource.type === 'video' && (
                <TabsContent value="watch" className="pt-6">
                  <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                    <div className="text-center text-white p-6">
                      <Video className="h-16 w-16 mx-auto mb-4 opacity-70" />
                      <h3 className="text-xl font-medium mb-2">Prévisualisation de la vidéo</h3>
                      <p className="mb-4 text-gray-300">
                        Cette vidéo est disponible après téléchargement
                      </p>
                      <Button onClick={handleDownload}>
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger pour regarder
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              )}
              
              {relatedResources.length > 0 && (
                <TabsContent value="related" className="pt-6">
                  <h3 className="font-medium mb-4">Ressources connexes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {relatedResources.map((relatedResource) => (
                      <Link 
                        to={`/resources/${relatedResource.id}`} 
                        key={relatedResource.id}
                        className="block"
                      >
                        <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex gap-3">
                            <div className="bg-gray-100 h-16 w-16 flex-shrink-0 rounded overflow-hidden">
                              <img 
                                src={relatedResource.thumbnail} 
                                alt={relatedResource.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium line-clamp-2">{relatedResource.title}</h4>
                              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                {getResourceIcon(relatedResource.type)}
                                <span>
                                  {relatedResource.type === 'book' ? 'Livre' : 
                                   relatedResource.type === 'video' ? 'Vidéo' : 'Document'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ResourceArticle;
