
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PremiumContent from '@/components/subscription/PremiumContent';
import PremiumBadge from '@/components/subscription/PremiumBadge';

const Demo: React.FC = () => {
  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Démonstration des fonctionnalités Premium</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Contenu Standard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Ce contenu est accessible à tous les utilisateurs, qu'ils soient sur un plan gratuit ou premium.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Contenu Premium <PremiumBadge />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PremiumContent>
                <p>Ce contenu n'est visible que pour les utilisateurs premium. Si vous voyez ceci, c'est que vous êtes abonné!</p>
              </PremiumContent>
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-2xl font-semibold mb-4">Contenu premium avec effet de flou</h2>
        <PremiumContent blur>
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <h3 className="text-xl font-bold mb-3">Document médical exclusif</h3>
            <p className="mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget
              ultricies aliquam, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <p>
              Nullam auctor, nisl eget ultricies aliquam, nisl nisl aliquam nisl, eget aliquam
              nisl nisl eget nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        </PremiumContent>
        
        {/* Comment illustrating how to conditionally import premium components */}
        {/* 
          // Example for conditionally importing premium components:
          import { usePremiumStatus } from '@/hooks/usePremiumStatus';
          
          const { isPremium } = usePremiumStatus();
          
          // Later in your component:
          {isPremium && <PremiumFeature />}
        */}
      </div>
    </MainLayout>
  );
};

export default Demo;

// This is an example component - you can use it as reference for implementing premium features
// throughout the application. To use it, you would need to add a route in App.tsx.
