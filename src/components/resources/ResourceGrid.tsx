
/**
 * 📚 Grille de Ressources Optimisée
 * 
 * Composant dédié à l'affichage responsive des ressources
 * - Grille adaptative selon la taille d'écran
 * - Chargement progressif pour de meilleures performances
 * - Interface tactile optimisée pour mobile
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, FileText, BookOpen, Eye, Download } from 'lucide-react';
import ResourceEditor from './ResourceEditor';

/**
 * Interface pour une ressource médicale
 */
interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  author?: string;
  url?: string;
  content_type?: string;
  views_count?: number;
  reading_time?: number;
  profiles?: { display_name: string };
  created_at: string;
  edit_count?: number;
  excerpt?: string; // Added missing property
}

interface ResourceGridProps {
  resources: Resource[];
  articles: Resource[];
  viewType: 'all' | 'resources' | 'articles' | 'files';
  userRole?: string;
  onEditComplete: () => void;
  onViewArticle: (id: string) => void;
}

/**
 * Catégories médicales avec leurs labels français
 */
const categories = [
  { value: 'cardiologie', label: 'Cardiologie' },
  { value: 'neurologie', label: 'Neurologie' },
  { value: 'pediatrie', label: 'Pédiatrie' },
  { value: 'chirurgie', label: 'Chirurgie' },
  { value: 'medecine_generale', label: 'Médecine générale' },
  { value: 'pharmacologie', label: 'Pharmacologie' },
  { value: 'anatomie', label: 'Anatomie' },
  { value: 'autre', label: 'Autre' }
];

/**
 * Composant principal de la grille de ressources
 * Gère l'affichage responsive et l'interaction utilisateur
 */
const ResourceGrid: React.FC<ResourceGridProps> = ({
  resources,
  articles,
  viewType,
  userRole,
  onEditComplete,
  onViewArticle
}) => {

  /**
   * 🏷️ Obtient le label français d'une catégorie
   */
  const getCategoryLabel = (categoryValue: string): string => {
    return categories.find(c => c.value === categoryValue)?.label || categoryValue;
  };

  /**
   * 🖼️ Rendu d'une carte de ressource externe
   */
  const renderResourceCard = (resource: Resource) => (
    <Card 
      key={resource.id} 
      className="group hover:shadow-lg transition-all duration-300 h-full flex flex-col"
    >
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg line-clamp-2 mb-2 group-hover:text-medical-teal transition-colors">
              <div className="flex items-start gap-2">
                <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 text-medical-teal flex-shrink-0 mt-0.5" />
                <span className="break-words">{resource.title}</span>
              </div>
            </CardTitle>
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2">
              {resource.category && (
                <Badge variant="secondary" className="text-xs">
                  {getCategoryLabel(resource.category)}
                </Badge>
              )}
              {resource.content_type && (
                <Badge variant="outline" className="text-xs">
                  {resource.content_type}
                </Badge>
              )}
            </div>
          </div>
          {userRole === 'professional' && (
            <div className="flex-shrink-0">
              <ResourceEditor
                resource={resource}
                type="resource"
                onEditComplete={onEditComplete}
              />
            </div>
          )}
        </div>
        <CardDescription className="line-clamp-3 text-sm">
          {resource.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {resource.author && (
            <p className="text-xs sm:text-sm text-gray-600">
              <strong>Auteur:</strong> <span className="break-words">{resource.author}</span>
            </p>
          )}
          
          <div className="text-xs text-gray-500 space-y-1">
            <div className="break-words">
              Ajouté par {resource.profiles?.display_name || 'Utilisateur'} le{' '}
              {new Date(resource.created_at).toLocaleDateString('fr-FR')}
            </div>
            {(resource.edit_count ?? 0) > 0 && (
              <div>• {resource.edit_count} modification(s)</div>
            )}
          </div>
        </div>
        
        <Button 
          asChild 
          className="w-full mt-4 text-sm"
          size="sm"
        >
          <a 
            href={resource.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Accéder à la ressource</span>
          </a>
        </Button>
      </CardContent>
    </Card>
  );

  /**
   * 📄 Rendu d'une carte d'article
   */
  const renderArticleCard = (article: Resource) => (
    <Card 
      key={article.id} 
      className="group hover:shadow-lg transition-all duration-300 h-full flex flex-col"
    >
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg line-clamp-2 mb-2 group-hover:text-medical-blue transition-colors">
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-medical-blue flex-shrink-0 mt-0.5" />
                <span className="break-words">{article.title}</span>
              </div>
            </CardTitle>
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2">
              {article.category && (
                <Badge variant="secondary" className="text-xs">
                  {getCategoryLabel(article.category)}
                </Badge>
              )}
            </div>
          </div>
          {userRole === 'professional' && (
            <div className="flex-shrink-0">
              <ResourceEditor
                resource={article}
                type="article"
                onEditComplete={onEditComplete}
              />
            </div>
          )}
        </div>
        <CardDescription className="line-clamp-3 text-sm">
          {article.excerpt || article.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
            {article.reading_time && (
              <span>{article.reading_time} min de lecture</span>
            )}
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
              {article.views_count || 0}
            </span>
          </div>
          
          <div className="text-xs text-gray-500 break-words">
            Par {article.profiles?.display_name || 'Auteur'} le{' '}
            {new Date(article.created_at).toLocaleDateString('fr-FR')}
          </div>
        </div>
        
        <Button 
          className="w-full mt-4 text-sm"
          size="sm"
          onClick={() => onViewArticle(article.id)}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Lire l'article
        </Button>
      </CardContent>
    </Card>
  );

  // 📊 Filtrage des ressources selon le type de vue
  const filteredResources = (viewType === 'all' || viewType === 'resources') ? resources : [];
  const filteredArticles = (viewType === 'all' || viewType === 'articles') ? articles : [];

  // 📋 Vérification si aucune ressource n'est disponible
  const hasNoContent = filteredResources.length === 0 && filteredArticles.length === 0;

  if (hasNoContent) {
    return (
      <div className="text-center py-8 sm:py-12">
        <FileText className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
          Aucune ressource trouvée
        </h3>
        <p className="text-sm sm:text-base text-gray-500 px-4">
          Essayez de modifier vos filtres ou ajoutez une nouvelle ressource.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* 🔗 Ressources externes */}
      {filteredResources.map(renderResourceCard)}
      
      {/* 📄 Articles */}
      {filteredArticles.map(renderArticleCard)}
    </div>
  );
};

export default ResourceGrid;
