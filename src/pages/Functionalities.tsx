
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BookText, Users, TestTube, Clock, Calendar,
  Music, Stethoscope, GraduationCap, FileText,
  Calculator, MessageSquare, FolderOpen
} from 'lucide-react';

const Functionalities: React.FC = () => {
  return (
    <MainLayout requireAuth={false}>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-medical-navy mb-4">Fonctionnalités de la plateforme</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Des outils adaptés pour chaque utilisateur, qu'il soit étudiant ou professionnel
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Section Étudiants en médecine */}
          <Card className="border-t-4 border-medical-blue">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <GraduationCap className="h-6 w-6 text-medical-blue" />
                </div>
                <CardTitle className="text-2xl">Étudiants en médecine</CardTitle>
              </div>
              <CardDescription>
                Outils et ressources dédiés aux étudiants pour optimiser leur apprentissage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6">
                {/* Fiches de révision */}
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <BookText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Fiches de révision</h3>
                    <p className="text-gray-600">Créez et partagez des fiches pour optimiser vos révisions</p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" className="mt-1" asChild>
                        <Link to="/tools/flashcards/flashcard-generator">Découvrir</Link>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Groupes d'étude */}
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Groupes d'étude</h3>
                    <p className="text-gray-600">Rejoignez des groupes d'étude pour une préparation collaborative</p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" className="mt-1" asChild>
                        <Link to="/study-groups">Découvrir</Link>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Simulateur d'examens */}
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <TestTube className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Simulateur d'examens</h3>
                    <p className="text-gray-600">Entraînez-vous avec des QCM dans des conditions réelles d'examen</p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" className="mt-1" asChild>
                        <Link to="/exam-simulator">Découvrir</Link>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Pomodoro & focus */}
                <div className="flex items-start gap-4">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Pomodoro & focus</h3>
                    <p className="text-gray-600">Techniques de concentration et timer pour optimiser votre temps</p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" className="mt-1" asChild>
                        <Link to="/tools/study-timer">Découvrir</Link>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Planificateur d'études */}
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Calendar className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Planificateur d'études</h3>
                    <p className="text-gray-600">Organisez votre emploi du temps et vos révisions efficacement</p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" className="mt-1" asChild>
                        <Link to="/tools/study-planner">Découvrir</Link>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Musique d'ambiance */}
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <Music className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Musique d'ambiance</h3>
                    <p className="text-gray-600">Bibliothèque musicale pour améliorer votre concentration</p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" className="mt-1" asChild>
                        <Link to="/music-library">Découvrir</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link to="/register?role=student">S'inscrire comme étudiant</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Section Professionnels de santé */}
          <Card className="border-t-4 border-medical-green">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Stethoscope className="h-6 w-6 text-medical-green" />
                </div>
                <CardTitle className="text-2xl">Professionnels de santé</CardTitle>
              </div>
              <CardDescription>
                Solutions professionnelles pour la formation continue et la pratique médicale
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6">
                {/* Cas cliniques */}
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Stethoscope className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Cas cliniques</h3>
                    <p className="text-gray-600">Accédez à une base de données de cas cliniques pour la formation</p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" className="mt-1" asChild>
                        <Link to="/clinical-cases">Découvrir</Link>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Formation continue */}
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Formation continue</h3>
                    <p className="text-gray-600">Modules de DPC et ressources pour maintenir vos compétences</p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" className="mt-1" asChild>
                        <Link to="/continuing-education">Découvrir</Link>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Bibliothèque médicale */}
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Bibliothèque médicale</h3>
                    <p className="text-gray-600">Accédez aux dernières recherches et publications scientifiques</p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" className="mt-1" asChild>
                        <Link to="/resources">Découvrir</Link>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Outils cliniques */}
                <div className="flex items-start gap-4">
                  <div className="bg-teal-100 p-3 rounded-lg">
                    <Calculator className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Outils cliniques</h3>
                    <p className="text-gray-600">Calculateurs médicaux et aides à la décision clinique</p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" className="mt-1" asChild>
                        <Link to="/tools">Découvrir</Link>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Échanges entre pairs */}
                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 p-3 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Échanges entre pairs</h3>
                    <p className="text-gray-600">Communauté de professionnels pour partager expertise et conseils</p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" className="mt-1" asChild>
                        <Link to="/community">Découvrir</Link>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Gestion documentaire */}
                <div className="flex items-start gap-4">
                  <div className="bg-rose-100 p-3 rounded-lg">
                    <FolderOpen className="h-6 w-6 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Gestion documentaire</h3>
                    <p className="text-gray-600">Organisez vos documents professionnels et vos présentations</p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" className="mt-1" asChild>
                        <Link to="/tools">Découvrir</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link to="/register?role=professional">S'inscrire comme professionnel</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Functionalities;
