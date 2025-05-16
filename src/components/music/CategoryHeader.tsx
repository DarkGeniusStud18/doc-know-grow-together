
import React from 'react';

interface CategoryHeaderProps {
  category: string;
}

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({ category }) => {
  const getCategoryDescription = (category: string): string => {
    switch (category.toLowerCase()) {
      case 'lofi':
        return 'Beats relaxants parfaits pour étudier et se concentrer.';
      case 'classique':
        return 'Musique classique pour stimuler votre concentration et productivité.';
      case 'ambient':
        return 'Sons ambiants apaisants pour créer un environnement de travail serein.';
      case 'nature':
        return 'Sons de la nature pour vous aider à vous détendre et à vous concentrer.';
      case 'méditation':
        return 'Musique méditative pour calmer votre esprit avant ou pendant vos études.';
      case 'instrumentale':
        return 'Mélodies instrumentales pour accompagner vos sessions de travail.';
      default:
        return `Sélection de musiques adaptées à votre concentration.`;
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">{category}</h2>
      <p className="text-gray-600 mb-4">
        {getCategoryDescription(category)}
      </p>
    </div>
  );
};
