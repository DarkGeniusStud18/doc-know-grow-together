
// Page de profil utilisateur
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import ProfileCard from '@/components/profile/ProfileCard';
import ProfileEditor from '@/components/profile/ProfileEditor';
import DangerZone from '@/components/profile/DangerZone';
import RoleSwitcher from '@/components/profile/RoleSwitcher';

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
          <div className="md:col-span-1 space-y-6">
            <ProfileCard />
            <div className="flex flex-col gap-3">
              <RoleSwitcher />
              <Button asChild variant="outline" className="w-full">
                <Link to="/subscription">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="m7 11 2-2-2-2"/>
                    <path d="M11 13h4"/>
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                  </svg>
                  Gérer mon abonnement
                </Link>
              </Button>
            </div>
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
