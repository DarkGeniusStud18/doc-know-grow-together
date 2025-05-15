
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

/**
 * SEOHead component for managing page-specific meta tags
 * This helps with SEO by providing proper titles and descriptions for each page
 */
const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'MedCollab',
  description = 'MedCollab est une plateforme collaborative pour les étudiants et professionnels de santé.',
  canonicalUrl = '',
  ogImage = '/public/pictures/wallpaper.png',
}) => {
  const fullTitle = title === 'MedCollab' ? title : `${title} | MedCollab`;
  const fullUrl = `https://medcollab.app${canonicalUrl}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEOHead;
