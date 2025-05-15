
import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/seo/SEOHead';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, BookOpen, Calendar, Clock, FileText, 
  GraduationCap, Microscope, Brain, Music, 
  Briefcase, Stethoscope, CheckCircle, Activity
} from 'lucide-react';

const Index = () => {
  // Liste des fonctionnalités pour les étudiants
  const studentFeatures = [
    { 
      icon: <GraduationCap className="h-6 w-6 text-medical-blue" />, 
      title: "Fiches de révision", 
      description: "Créez et partagez des fiches pour optimiser vos révisions" 
    },
    { 
      icon: <Users className="h-6 w-6 text-medical-blue" />, 
      title: "Groupes d'étude", 
      description: "Rejoignez des groupes d'étude pour une préparation collaborative" 
    },
    { 
      icon: <Brain className="h-6 w-6 text-medical-blue" />, 
      title: "Simulateur d'examens", 
      description: "Entraînez-vous avec des QCM dans des conditions réelles d'examen" 
    },
    { 
      icon: <Clock className="h-6 w-6 text-medical-blue" />, 
      title: "Pomodoro & focus", 
      description: "Techniques de concentration et timer pour optimiser votre temps" 
    },
    { 
      icon: <Calendar className="h-6 w-6 text-medical-blue" />, 
      title: "Planificateur d'études", 
      description: "Organisez votre emploi du temps et vos révisions efficacement" 
    },
    { 
      icon: <Music className="h-6 w-6 text-medical-blue" />, 
      title: "Musique d'ambiance", 
      description: "Bibliothèque musicale pour améliorer votre concentration" 
    }
  ];

  // Liste des fonctionnalités pour les professionnels
  const professionalFeatures = [
    { 
      icon: <Stethoscope className="h-6 w-6 text-medical-green" />, 
      title: "Cas cliniques", 
      description: "Accédez à une base de données de cas cliniques pour la formation" 
    },
    { 
      icon: <BookOpen className="h-6 w-6 text-medical-green" />, 
      title: "Formation continue", 
      description: "Modules de DPC et ressources pour maintenir vos compétences" 
    },
    { 
      icon: <FileText className="h-6 w-6 text-medical-green" />, 
      title: "Bibliothèque médicale", 
      description: "Accédez aux dernières recherches et publications scientifiques" 
    },
    { 
      icon: <Microscope className="h-6 w-6 text-medical-green" />, 
      title: "Outils cliniques", 
      description: "Calculateurs médicaux et aides à la décision clinique" 
    },
    { 
      icon: <Activity className="h-6 w-6 text-medical-green" />, 
      title: "Échanges entre pairs", 
      description: "Communauté de professionnels pour partager expertise et conseils" 
    },
    { 
      icon: <Briefcase className="h-6 w-6 text-medical-green" />, 
      title: "Gestion documentaire", 
      description: "Organisez vos documents professionnels et vos présentations" 
    }
  ];

  return (
    <MainLayout>
      <SEOHead 
        title="MedCollab - Plateforme collaborative pour étudiants et professionnels de santé"
        description="MedCollab est une plateforme numérique qui facilite la collaboration et l'apprentissage pour les étudiants en médecine et les professionnels de santé."
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-medical-navy to-medical-blue text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1 space-y-6">
              <Badge className="bg-medical-teal text-white px-3 py-1 mb-2">Version 1.0 - Nouveautés</Badge>
              <h1 className="text-4xl md:text-5xl font-bold">
                Votre réussite médicale commence ici
              </h1>
              <p className="text-lg md:text-xl opacity-90 max-w-2xl">
                MedCollab est la plateforme collaborative qui connecte étudiants et professionnels de santé 
                pour un apprentissage optimisé avec des outils innovants et des ressources de qualité.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="bg-white text-medical-navy hover:bg-gray-100">
                  <Link to="/register">Commencer gratuitement</Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                  <Link to="/login">Se connecter</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 mt-8 lg:mt-0 max-w-md">
              <img 
                src="/pictures/wallpaper.png" 
                alt="MedCollab Platform" 
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-medical-navy">Fonctionnalités de la plateforme</h2>
            <p className="text-lg text-gray-600 mt-3">
              Des outils adaptés pour chaque utilisateur, qu'il soit étudiant ou professionnel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Fonctionnalités pour étudiants */}
            <Card className="border-t-4 border-t-medical-blue">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-medical-blue" />
                  <CardTitle className="text-2xl">Étudiants en médecine</CardTitle>
                </div>
                <CardDescription>
                  Outils et ressources dédiés aux étudiants pour optimiser leur apprentissage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {studentFeatures.map((feature, index) => (
                    <div key={`student-${index}`} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="mt-1">{feature.icon}</div>
                      <div>
                        <h3 className="font-medium">{feature.title}</h3>
                        <p className="text-sm text-gray-500">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/register?role=student">S'inscrire comme étudiant</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Fonctionnalités pour professionnels */}
            <Card className="border-t-4 border-t-medical-green">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-6 w-6 text-medical-green" />
                  <CardTitle className="text-2xl">Professionnels de santé</CardTitle>
                </div>
                <CardDescription>
                  Solutions professionnelles pour la formation continue et la pratique médicale
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {professionalFeatures.map((feature, index) => (
                    <div key={`pro-${index}`} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="mt-1">{feature.icon}</div>
                      <div>
                        <h3 className="font-medium">{feature.title}</h3>
                        <p className="text-sm text-gray-500">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/register?role=professional">S'inscrire comme professionnel</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-medical-navy">Pourquoi choisir MedCollab ?</h2>
            <p className="text-lg text-gray-600 mt-3">
              Une solution complète pour votre parcours médical
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CheckCircle className="h-10 w-10 text-medical-teal mb-2" />
                <CardTitle>Approche collaborative</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Connectez-vous avec d'autres étudiants et professionnels. Partagez des connaissances, 
                  collaborez sur des cas cliniques et créez des groupes d'étude thématiques.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CheckCircle className="h-10 w-10 text-medical-teal mb-2" />
                <CardTitle>Ressources vérifiées</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Accédez à une bibliothèque de ressources médicales de qualité, revues par des professionnels 
                  et constamment mises à jour selon les dernières avancées scientifiques.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CheckCircle className="h-10 w-10 text-medical-teal mb-2" />
                <CardTitle>Outils innovants</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Bénéficiez d'outils spécialement conçus pour l'apprentissage médical : simulateurs d'examens, 
                  planificateur d'études, bibliothèque musicale pour la concentration et plus encore.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-medical-teal text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Prêt à transformer votre apprentissage et votre pratique médicale ?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Rejoignez des milliers d'étudiants et de professionnels qui utilisent déjà MedCollab 
            pour améliorer leurs connaissances et leur pratique médicale.
          </p>
          <Button size="lg" className="bg-white text-medical-teal hover:bg-gray-100">
            <Link to="/register">Créer un compte gratuit</Link>
          </Button>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
