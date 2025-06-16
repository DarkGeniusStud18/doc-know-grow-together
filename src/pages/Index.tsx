
import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/seo/SEOHead';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, BookOpen, Calendar, Clock, FileText, 
  GraduationCap, Microscope, Brain, Music, 
  Briefcase, Stethoscope, CheckCircle, Activity,
  ArrowRight, Star, Globe, Shield, Award,
  Play, ChevronRight, Zap
} from 'lucide-react';

const Index = () => {
  // Liste des fonctionnalités pour les étudiants - optimisée pour mobile
  const studentFeatures = [
    { 
      icon: <GraduationCap className="h-5 w-5 md:h-6 md:w-6 text-medical-blue" />, 
      title: "Fiches de révision", 
      description: "Créez et partagez des fiches pour optimiser vos révisions",
      category: "study"
    },
    { 
      icon: <Users className="h-5 w-5 md:h-6 md:w-6 text-medical-blue" />, 
      title: "Groupes d'étude", 
      description: "Rejoignez des groupes d'étude pour une préparation collaborative",
      category: "collaboration"
    },
    { 
      icon: <Brain className="h-5 w-5 md:h-6 md:w-6 text-medical-blue" />, 
      title: "Simulateur d'examens", 
      description: "Entraînez-vous avec des QCM dans des conditions réelles",
      category: "practice"
    },
    { 
      icon: <Clock className="h-5 w-5 md:h-6 md:w-6 text-medical-blue" />, 
      title: "Pomodoro & focus", 
      description: "Techniques de concentration et timer pour optimiser votre temps",
      category: "productivity"
    },
    { 
      icon: <Calendar className="h-5 w-5 md:h-6 md:w-6 text-medical-blue" />, 
      title: "Planificateur d'études", 
      description: "Organisez votre emploi du temps et vos révisions efficacement",
      category: "planning"
    },
    { 
      icon: <Music className="h-5 w-5 md:h-6 md:w-6 text-medical-blue" />, 
      title: "Musique d'ambiance", 
      description: "Bibliothèque musicale pour améliorer votre concentration",
      category: "wellness"
    }
  ];

  // Liste des fonctionnalités pour les professionnels - optimisée pour tablette/desktop
  const professionalFeatures = [
    { 
      icon: <Stethoscope className="h-5 w-5 md:h-6 md:w-6 text-medical-green" />, 
      title: "Cas cliniques", 
      description: "Accédez à une base de données de cas cliniques pour la formation",
      category: "clinical"
    },
    { 
      icon: <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-medical-green" />, 
      title: "Formation continue", 
      description: "Modules de DPC et ressources pour maintenir vos compétences",
      category: "education"
    },
    { 
      icon: <FileText className="h-5 w-5 md:h-6 md:w-6 text-medical-green" />, 
      title: "Bibliothèque médicale", 
      description: "Accédez aux dernières recherches et publications scientifiques",
      category: "research"
    },
    { 
      icon: <Microscope className="h-5 w-5 md:h-6 md:w-6 text-medical-green" />, 
      title: "Outils cliniques", 
      description: "Calculateurs médicaux et aides à la décision clinique",
      category: "tools"
    },
    { 
      icon: <Activity className="h-5 w-5 md:h-6 md:w-6 text-medical-green" />, 
      title: "Échanges entre pairs", 
      description: "Communauté de professionnels pour partager expertise et conseils",
      category: "networking"
    },
    { 
      icon: <Briefcase className="h-5 w-5 md:h-6 md:w-6 text-medical-green" />, 
      title: "Gestion documentaire", 
      description: "Organisez vos documents professionnels et vos présentations",
      category: "management"
    }
  ];

  const stats = [
    { number: "50K+", label: "Étudiants actifs", icon: <Users className="h-4 w-4" /> },
    { number: "10K+", label: "Professionnels", icon: <Stethoscope className="h-4 w-4" /> },
    { number: "25+", label: "Spécialités", icon: <Award className="h-4 w-4" /> },
    { number: "100+", label: "Établissements", icon: <Globe className="h-4 w-4" /> }
  ];

  return (
    <MainLayout requireAuth={false}>
      <SEOHead 
        title="MedCollab - Plateforme collaborative pour étudiants et professionnels de santé"
        description="MedCollab est une plateforme numérique qui facilite la collaboration et l'apprentissage pour les étudiants en médecine et les professionnels de santé."
      />

      {/* Hero Section - Design adaptatif */}
      <section className="relative overflow-hidden">
        {/* Background gradient optimisé pour mobile */}
        <div className="absolute inset-0 bg-gradient-to-br from-medical-navy via-medical-blue to-medical-teal opacity-95"></div>
        
        {/* Contenu principal du hero */}
        <div className="relative px-4 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              
              {/* Contenu textuel - Mobile First */}
              <div className="text-center lg:text-left space-y-4 md:space-y-6">
                {/* Badge nouveau - Design mobile optimisé */}
                <div className="inline-flex items-center">
                  <Badge className="bg-medical-teal/20 text-medical-teal border-medical-teal/30 px-3 py-1 text-xs md:text-sm font-medium">
                    <Zap className="h-3 w-3 mr-1" />
                    Nouvelle version 1.0
                  </Badge>
                </div>

                {/* Titre principal - Typographie responsive */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Votre réussite médicale
                  <span className="block text-medical-teal">commence ici</span>
                </h1>

                {/* Description - Adaptation mobile/desktop */}
                <p className="text-base sm:text-lg md:text-xl text-blue-100 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  MedCollab connecte étudiants et professionnels de santé pour un apprentissage 
                  collaboratif avec des outils innovants et des ressources de qualité.
                </p>

                {/* CTA Buttons - Stack mobile, inline desktop */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 justify-center lg:justify-start">
                  <Button 
                    size="lg" 
                    className="bg-white text-medical-navy hover:bg-gray-100 font-semibold px-6 py-3 h-auto"
                    asChild
                  >
                    <Link to="/register" className="flex items-center justify-center">
                      Commencer gratuitement
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="bg-transparent border-white text-white hover:bg-white/10 font-semibold px-6 py-3 h-auto"
                    asChild
                  >
                    <Link to="/login" className="flex items-center justify-center">
                      <Play className="h-4 w-4 mr-2" />
                      Voir la démo
                    </Link>
                  </Button>
                </div>

                {/* Stats - Visible uniquement sur tablette+ */}
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center lg:text-left">
                      <div className="flex items-center justify-center lg:justify-start text-medical-teal mb-1">
                        {stat.icon}
                      </div>
                      <div className="text-xl lg:text-2xl font-bold text-white">{stat.number}</div>
                      <div className="text-xs lg:text-sm text-blue-200">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image/Illustration - Design responsive */}
              <div className="relative mt-8 lg:mt-0">
                <div className="relative z-10">
                  <div className="aspect-square md:aspect-[4/3] lg:aspect-square max-w-md mx-auto">
                    <img 
                      src="/pictures/wallpaper.png" 
                      alt="MedCollab Platform Interface" 
                      className="w-full h-full object-cover rounded-2xl shadow-2xl border border-white/20"
                    />
                  </div>
                </div>
                
                {/* Éléments décoratifs - Visibles uniquement sur desktop */}
                <div className="hidden lg:block absolute -top-4 -right-4 w-24 h-24 bg-medical-teal/20 rounded-full blur-xl"></div>
                <div className="hidden lg:block absolute -bottom-8 -left-8 w-32 h-32 bg-medical-blue/20 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats mobiles - Version compacte */}
        <div className="md:hidden relative px-4 pb-8">
          <div className="max-w-sm mx-auto grid grid-cols-2 gap-4">
            {stats.slice(0, 4).map((stat, index) => (
              <div key={index} className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="text-lg font-bold text-white">{stat.number}</div>
                <div className="text-xs text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Design adaptatif par type d'écran */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Header de section */}
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-medical-navy mb-3 md:mb-4">
              Fonctionnalités de la plateforme
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
              Des outils adaptés pour chaque utilisateur, qu'il soit étudiant ou professionnel
            </p>
          </div>

          {/* Grille adaptative - Mobile: 1 col, Tablette: 1 col, Desktop: 2 cols */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
            
            {/* Card Étudiants - Design mobile-first */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-medical-blue rounded-xl">
                    <GraduationCap className="h-5 w-5 md:h-6 md:w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl md:text-2xl text-medical-navy">
                      Étudiants en médecine
                    </CardTitle>
                    <CardDescription className="text-sm md:text-base mt-1">
                      Outils et ressources dédiés aux étudiants
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {studentFeatures.map((feature, index) => (
                    <div 
                      key={`student-${index}`} 
                      className="group flex items-start gap-3 p-3 md:p-4 rounded-xl hover:bg-white/70 transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                        {feature.icon}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm md:text-base text-gray-900 group-hover:text-medical-blue transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600 mt-1 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4">
                  <Button 
                    className="w-full bg-medical-blue hover:bg-medical-blue/90 font-semibold h-11"
                    asChild
                  >
                    <Link to="/register?role=student" className="flex items-center justify-center">
                      S'inscrire comme étudiant
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Card Professionnels - Design cohérent mais distinctif */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-medical-green rounded-xl">
                    <Stethoscope className="h-5 w-5 md:h-6 md:w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl md:text-2xl text-medical-navy">
                      Professionnels de santé
                    </CardTitle>
                    <CardDescription className="text-sm md:text-base mt-1">
                      Solutions pour la formation continue et la pratique
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {professionalFeatures.map((feature, index) => (
                    <div 
                      key={`pro-${index}`} 
                      className="group flex items-start gap-3 p-3 md:p-4 rounded-xl hover:bg-white/70 transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                        {feature.icon}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm md:text-base text-gray-900 group-hover:text-medical-green transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600 mt-1 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4">
                  <Button 
                    className="w-full bg-medical-green hover:bg-medical-green/90 font-semibold h-11"
                    asChild
                  >
                    <Link to="/register?role=professional" className="flex items-center justify-center">
                      S'inscrire comme professionnel
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section - Design premium */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-medical-navy mb-3 md:mb-4">
              Pourquoi choisir MedCollab ?
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
              Une solution complète pour votre parcours médical
            </p>
          </div>

          {/* Grille responsive des bénéfices */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            
            <Card className="group border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="pb-4">
                <div className="mb-4 p-3 bg-medical-teal/10 rounded-2xl w-fit group-hover:bg-medical-teal/20 transition-colors">
                  <Users className="h-8 w-8 md:h-10 md:w-10 text-medical-teal" />
                </div>
                <CardTitle className="text-lg md:text-xl">Approche collaborative</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Connectez-vous avec d'autres étudiants et professionnels. Partagez des connaissances, 
                  collaborez sur des cas cliniques et créez des groupes d'étude thématiques.
                </p>
              </CardContent>
            </Card>
            
            <Card className="group border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="pb-4">
                <div className="mb-4 p-3 bg-medical-blue/10 rounded-2xl w-fit group-hover:bg-medical-blue/20 transition-colors">
                  <Shield className="h-8 w-8 md:h-10 md:w-10 text-medical-blue" />
                </div>
                <CardTitle className="text-lg md:text-xl">Ressources vérifiées</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Accédez à une bibliothèque de ressources médicales de qualité, revues par des professionnels 
                  et constamment mises à jour selon les dernières avancées scientifiques.
                </p>
              </CardContent>
            </Card>
            
            <Card className="group border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 md:col-span-2 lg:col-span-1">
              <CardHeader className="pb-4">
                <div className="mb-4 p-3 bg-medical-green/10 rounded-2xl w-fit group-hover:bg-medical-green/20 transition-colors">
                  <Zap className="h-8 w-8 md:h-10 md:w-10 text-medical-green" />
                </div>
                <CardTitle className="text-lg md:text-xl">Outils innovants</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Bénéficiez d'outils spécialement conçus pour l'apprentissage médical : simulateurs d'examens, 
                  planificateur d'études, bibliothèque musicale pour la concentration et plus encore.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action - Design impactant */}
      <section className="relative py-12 md:py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-medical-teal to-medical-blue"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6">
            Prêt à transformer votre apprentissage médical ?
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-blue-100 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed">
            Rejoignez des milliers d'étudiants et de professionnels qui utilisent déjà MedCollab 
            pour améliorer leurs connaissances et leur pratique médicale.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-white text-medical-teal hover:bg-gray-100 font-semibold px-8 py-3 h-auto w-full sm:w-auto"
              asChild
            >
              <Link to="/register" className="flex items-center justify-center">
                Créer un compte gratuit
                <Star className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            
            <div className="flex items-center text-blue-100 text-sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              Gratuit • Sans engagement
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
