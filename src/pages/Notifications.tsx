/**
 * 🔔 Page Notifications - Interface utilisateur complète
 * Gestion centralisée des notifications push et système
 */

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import SEOHead from '@/components/seo/SEOHead';

const Notifications: React.FC = () => {
  return (
    <>
      <SEOHead 
        title="Notifications - MedCollab"
        description="Centre de notifications pour rester informé des messages, invitations et mises à jour importantes"
      />
      
      <MainLayout>
        <NotificationCenter />
      </MainLayout>
    </>
  );
};

export default Notifications;