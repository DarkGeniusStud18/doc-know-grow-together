
// Page de profil utilisateur
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import ProfileCard from '@/components/profile/ProfileCard';
import ProfileEditor from '@/components/profile/ProfileEditor';
import DangerZone from '@/components/profile/DangerZone';

/**
 * Page principale du profil utilisateur
 * Permet de voir et modifier les informations de l'utilisateur connecté
 */
const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-2">Accès non autorisé</h1>
            <p className="text-gray-500 mb-4">Vous devez être connecté pour accéder à cette page.</p>
            <Button asChild>
              <Link to="/login">Se connecter</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-4xl py-8">
        <h1 className="text-3xl font-bold mb-6">Mon Profil</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Colonne gauche - Carte d'information utilisateur */}
          <div className="md:col-span-1">
            <ProfileCard />
          </div>
          
          {/* Colonne droite - Modifier le profil et autres informations */}
          <div className="md:col-span-2">
            <ProfileEditor />
            <DangerZone />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
