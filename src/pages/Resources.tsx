
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Book, BookOpen, FileText, Filter, Search, Video } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Données simulées - Dans une application réelle, elles proviendraient d'une API
const RESOURCES = [
  {
    id: 1,
    title: "Atlas d'anatomie humaine",
    description: "Un atlas complet d'anatomie humaine avec illustrations détaillées",
    type: "book",
    category: "anatomy",
    language: "fr",
    thumbnail: "/placeholder.svg",
    featured: true,
  },
  {
    id: 2,
    title: "Guide de pharmacologie clinique",
    description: "Les principes fondamentaux de la pharmacologie pour les étudiants en médecine",
    type: "document",
    category: "pharmacology",
    language: "fr",
    thumbnail: "/placeholder.svg",
  },
  {
    id: 3,
    title: "Dissection du membre supérieur",
    description: "Vidéo éducative montrant la dissection détaillée du membre supérieur",
    type: "video",
    category: "anatomy",
    language: "fr",
    duration: "45 min",
    thumbnail: "/placeholder.svg",
  },
  {
    id: 4,
    title: "Diagnostic différentiel en médecine interne",
    description: "Un guide pratique pour établir des diagnostics différentiels",
    type: "book",
    category: "internal-medicine",
    language: "fr",
    thumbnail: "/placeholder.svg",
  },
  {
    id: 5,
    title: "Fondamentaux de la neurologie",
    description: "Les bases essentielles pour comprendre le système nerveux et ses pathologies",
    type: "document",
    category: "neurology",
    language: "fr",
    thumbnail: "/placeholder.svg",
    featured: true,
  },
  {
    id: 6,
    title: "Examen clinique cardiovasculaire",
    description: "Techniques et méthodologies pour l'examen cardiovasculaire",
    type: "video",
    category: "cardiology",
    language: "fr",
    duration: "32 min",
    thumbnail: "/placeholder.svg",
  },
];

// Options de catégories
const CATEGORIES = [
  { value: "all", label: "Toutes les catégories" },
  { value: "anatomy", label: "Anatomie" },
  { value: "pharmacology", label: "Pharmacologie" },
  { value: "internal-medicine", label: "Médecine interne" },
  { value: "cardiology", label: "Cardiologie" },
  { value: "neurology", label: "Neurologie" },
];

// Icônes des types de ressources
const getResourceIcon = (type: string) => {
  switch (type) {
    case 'book':
      return <Book className="h-5 w-5" />;
    case 'video':
      return <Video className="h-5 w-5" />;
    case 'document':
    default:
      return <FileText className="h-5 w-5" />;
  }
};

// Composant principal
const Resources: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  
  // Fonction pour gérer le changement de langue (simulation)
  const handleLanguageChange = (language: string) => {
    // Dans un cas réel, cela activerait la traduction de l'application
    toast({
      title: "Changement de langue",
      description: `La langue a été changée en ${language}`,
    });
  };
  
  // Filtrer les ressources en fonction des critères
  const filteredResources = RESOURCES.filter(resource => {
    // Filtrer par recherche
    const matchesQuery = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtrer par catégorie
    const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
    
    // Filtrer par onglet
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'featured' && resource.featured) ||
                      resource.type === activeTab;
    
    return matchesQuery && matchesCategory && matchesTab;
  });
  
  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-medical-navy">Ressources médicales</h1>
            <p className="text-gray-500 mt-1">
              Parcourez notre bibliothèque de ressources médicales validées
            </p>
          </div>
          
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher des ressources..."
              className="pl-9 md:w-80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-64 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>
                  <div className="text-lg flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filtres
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <h4 className="text-sm font-medium mb-3">Catégories</h4>
                  <div className="space-y-2">
                    {CATEGORIES.map(category => (
                      <Button 
                        key={category.value}
                        variant={activeCategory === category.value ? "default" : "ghost"}
                        className="w-full justify-start text-sm h-9"
                        onClick={() => setActiveCategory(category.value)}
                      >
                        {category.label}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-3">Langues</h4>
                  <div className="space-y-2">
                    <Button 
                      variant="ghost"
                      className="w-full justify-start text-sm h-9"
                      onClick={() => handleLanguageChange('fr')}
                    >
                      Français
                    </Button>
                    <Button 
                      variant="ghost"
                      className="w-full justify-start text-sm h-9"
                      onClick={() => handleLanguageChange('en')}
                    >
                      Anglais
                    </Button>
                    <Button 
                      variant="ghost"
                      className="w-full justify-start text-sm h-9"
                      onClick={() => handleLanguageChange('es')}
                    >
                      Espagnol
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex-1">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-between items-center mb-6">
                <TabsList>
                  <TabsTrigger value="all" className="text-sm">Tous</TabsTrigger>
                  <TabsTrigger value="featured" className="text-sm">À la une</TabsTrigger>
                  <TabsTrigger value="book" className="text-sm">Livres</TabsTrigger>
                  <TabsTrigger value="document" className="text-sm">Documents</TabsTrigger>
                  <TabsTrigger value="video" className="text-sm">Vidéos</TabsTrigger>
                </TabsList>
                
                <span className="text-sm text-gray-500">
                  {filteredResources.length} ressource(s)
                </span>
              </div>
              
              <TabsContent value="all" className="mt-0">
                <ResourceGrid resources={filteredResources} onResourceClick={(id) => navigate(`/resources/${id}`)} />
              </TabsContent>
              
              <TabsContent value="featured" className="mt-0">
                <ResourceGrid resources={filteredResources} onResourceClick={(id) => navigate(`/resources/${id}`)} />
              </TabsContent>
              
              <TabsContent value="book" className="mt-0">
                <ResourceGrid resources={filteredResources} onResourceClick={(id) => navigate(`/resources/${id}`)} />
              </TabsContent>
              
              <TabsContent value="document" className="mt-0">
                <ResourceGrid resources={filteredResources} onResourceClick={(id) => navigate(`/resources/${id}`)} />
              </TabsContent>
              
              <TabsContent value="video" className="mt-0">
                <ResourceGrid resources={filteredResources} onResourceClick={(id) => navigate(`/resources/${id}`)} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// Interface pour les propriétés de ResourceGrid
interface ResourceGridProps {
  resources: typeof RESOURCES;
  onResourceClick: (id: number) => void;
}

// Composant de grille de ressources
const ResourceGrid: React.FC<ResourceGridProps> = ({ resources, onResourceClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.length > 0 ? (
        resources.map(resource => (
          <Card key={resource.id} className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onResourceClick(resource.id)}>
            <div className="h-48 bg-gray-100 relative">
              <img 
                src={resource.thumbnail}
                alt={resource.title}
                className="w-full h-full object-cover"
              />
              {resource.featured && (
                <Badge className="absolute top-2 right-2 bg-medical-teal">
                  À la une
                </Badge>
              )}
              {resource.type === 'video' && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {resource.duration}
                </div>
              )}
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                <span className="flex items-center gap-1">
                  {getResourceIcon(resource.type)}
                  <span>{resource.type === 'book' ? 'Livre' : resource.type === 'video' ? 'Vidéo' : 'Document'}</span>
                </span>
                <span>•</span>
                <span className="capitalize">{CATEGORIES.find(cat => cat.value === resource.category)?.label}</span>
              </div>
              <CardTitle className="text-lg leading-tight">{resource.title}</CardTitle>
            </CardHeader>
            <CardContent className="pb-0">
              <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
            </CardContent>
            <CardFooter className="mt-auto pt-4">
              <Button className="w-full">
                <BookOpen className="h-4 w-4 mr-2" />
                Accéder
              </Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <div className="col-span-full text-center py-16">
          <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium">Aucune ressource trouvée</h3>
          <p className="text-gray-500 mt-1">Essayez de modifier vos filtres ou votre recherche</p>
        </div>
      )}
    </div>
  );
};

export default Resources;
