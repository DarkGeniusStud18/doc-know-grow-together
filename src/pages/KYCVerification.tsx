import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { uploadIcon, documentIcon, verifiedIcon } from '@/components/icons/KycIcons';
import { submitKycDocuments } from '@/lib/auth/kyc-service';

const KYCVerification: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  if (!user) return null;
  
  // If user is already verified, show success screen
  if (user.kycStatus === 'verified') {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto py-10">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                {verifiedIcon}
              </div>
              <CardTitle className="text-2xl">Identité Vérifiée</CardTitle>
              <CardDescription>
                Votre identité a été vérifiée avec succès. Vous avez maintenant accès à toutes les fonctionnalités de MedCollab.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button 
                onClick={() => navigate('/dashboard')}
                className="w-full"
              >
                Retourner au tableau de bord
              </Button>
            </CardFooter>
          </Card>
        </div>
      </MainLayout>
    );
  }
  
  // If verification is pending, show pending screen
  if (user.kycStatus === 'pending') {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto py-10">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-yellow-500"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <CardTitle className="text-2xl">Vérification en cours</CardTitle>
              <CardDescription>
                Nous examinons actuellement vos documents. Cela peut prendre jusqu'à 48 heures. Vous recevrez un email lorsque la vérification sera terminée.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button 
                onClick={() => navigate('/dashboard')}
                className="w-full"
              >
                Retourner au tableau de bord
              </Button>
            </CardFooter>
          </Card>
        </div>
      </MainLayout>
    );
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (files.length === 0) {
      toast.error('Veuillez importer au moins un document');
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await submitKycDocuments(files, user.id);
      if (success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Error submitting documents:", error);
      toast.error('Erreur lors de l\'envoi des documents', {
        description: 'Veuillez réessayer plus tard.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getKycRequirements = () => {
    if (user.role === 'student') {
      return (
        <>
          <li className="flex items-start gap-2 mb-2">
            <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mt-0.5">1</span>
            <span>Carte étudiante ou certificat d'inscription</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mt-0.5">2</span>
            <span>Pièce d'identité (carte d'identité, passeport)</span>
          </li>
        </>
      );
    } else {
      return (
        <>
          <li className="flex items-start gap-2 mb-2">
            <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mt-0.5">1</span>
            <span>Licence médicale ou carte professionnelle</span>
          </li>
          <li className="flex items-start gap-2 mb-2">
            <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mt-0.5">2</span>
            <span>Pièce d'identité (carte d'identité, passeport)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mt-0.5">3</span>
            <span>Diplôme médical (facultatif)</span>
          </li>
        </>
      );
    }
  };
  
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8 text-center">Vérification d'identité</h1>
        
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Pourquoi vérifier votre identité ?</CardTitle>
              <CardDescription>
                La vérification de l'identité permet de garantir la qualité et la sécurité de notre communauté médicale.
                Une fois vérifié, vous aurez accès à toutes les fonctionnalités de MedCollab.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Documents requis pour les {user.role === 'student' ? 'étudiants' : 'professionnels'} :</h3>
                <ul>
                  {getKycRequirements()}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Téléverser vos documents</CardTitle>
            <CardDescription>
              Vos documents sont chiffrés et seront supprimés après vérification.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="documents">Documents d'identité</Label>
                  <div 
                    className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={handleClickUpload}
                  >
                    <div className="mb-4 flex justify-center">
                      {files.length ? documentIcon : uploadIcon}
                    </div>
                    {files.length ? (
                      <div>
                        <p className="text-sm font-medium">{files.length} fichier(s) sélectionné(s)</p>
                        <ul className="mt-2 text-xs text-gray-500">
                          {Array.from(files).map((file, index) => (
                            <li key={index}>{file.name}</li>
                          ))}
                        </ul>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="mt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFiles([]);
                          }}
                        >
                          Supprimer
                        </Button>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-medium">Cliquez pour sélectionner</p>
                        <p className="text-xs text-gray-500 mt-1">
                          PDF, JPG, PNG ou HEIC (max 10MB)
                        </p>
                      </>
                    )}
                    <Input
                      id="documents"
                      type="file"
                      multiple
                      className="hidden"
                      ref={fileInputRef}
                      accept=".pdf,.jpg,.jpeg,.png,.heic"
                      onChange={handleFileChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>En soumettant ces documents, vous acceptez notre <a href="#" className="text-medical-blue underline">politique de confidentialité</a> et autorisez MedCollab à vérifier votre identité professionnelle ou étudiante.</p>
                </div>
                
                <Button type="submit" className="w-full hover-scale transition-all duration-300" disabled={isLoading || files.length === 0}>
                  {isLoading ? 'Envoi en cours...' : 'Soumettre pour vérification'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default KYCVerification;
