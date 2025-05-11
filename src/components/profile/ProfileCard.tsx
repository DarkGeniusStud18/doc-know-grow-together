
// Composant pour afficher la carte de profil utilisateur
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Mail, School, Briefcase, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * Affiche les informations principales du profil de l'utilisateur dans une carte
 */
const ProfileCard = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <Card className="shadow-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.profileImage || "/placeholder.svg"} alt={user.displayName} />
            <AvatarFallback className="bg-medical-blue text-white text-2xl">
              {user.displayName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle>{user.displayName}</CardTitle>
        <CardDescription className="flex items-center justify-center gap-1">
          <Mail className="w-4 h-4" />
          {user.email}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-medical-blue" />
          <div>
            <p className="text-sm font-medium">Rôle</p>
            <p className="text-sm text-gray-500 capitalize">{user.role}</p>
          </div>
        </div>
        
        {user.university && (
          <div className="flex items-center gap-2">
            <School className="w-5 h-5 text-medical-blue" />
            <div>
              <p className="text-sm font-medium">Université</p>
              <p className="text-sm text-gray-500">{user.university}</p>
            </div>
          </div>
        )}
        
        {user.specialty && (
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-medical-blue" />
            <div>
              <p className="text-sm font-medium">Spécialité</p>
              <p className="text-sm text-gray-500">{user.specialty}</p>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          {user.kycStatus === 'verified' ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-500" />
          )}
          <div>
            <p className="text-sm font-medium">Statut de vérification</p>
            <p className="text-sm text-gray-500 capitalize">
              {user.kycStatus === 'verified' ? 'Vérifié' : 'Non vérifié'}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {user.kycStatus !== 'verified' && (
          <Button variant="outline" className="w-full" asChild>
            <Link to="/kyc">Vérifier mon identité</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
