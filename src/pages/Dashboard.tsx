
// Tableau de bord principal - Page d'accueil après connexion
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Book,
  Calendar,
  Clock,
  FileText,
  LucideAudioLines,
  MessageSquare,
  Search,
  User,
  Users,
  Stethoscope,
  GraduationCap,
  BookOpen,
  Microscope,
} from "lucide-react";

/**
 * Tableau de bord personnalisé qui affiche des fonctionnalités adaptées
 * au rôle de l'utilisateur (étudiant ou professionnel)
 */
const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Cartes de fonctionnalités pour les étudiants
  const studentFeatureCards = [
    {
      title: "Fiches de révision",
      description:
        "Créez et partagez des fiches pour optimiser vos révisions.",
      icon: <GraduationCap className="h-8 w-8 text-blue-500" />,
      link: "/notes",
      color: "bg-blue-50",
    },
    {
      title: "Groupes d'étude",
      description: "Rejoignez ou créez des groupes d'étude collaboratifs.",
      icon: <Users className="h-8 w-8 text-orange-500" />,
      link: "/study-groups",
      color: "bg-orange-50",
    },
    {
      title: "Simulateur d'examens",
      description:
        "Entraînez-vous aux examens avec des QCM et des cas cliniques.",
      icon: <FileText className="h-8 w-8 text-red-500" />,
      link: "/exam-simulator",
      color: "bg-red-50",
    },
    {
      title: "Pomodoro & focus",
      description:
        "Techniques de concentration et timer pour optimiser votre temps.",
      icon: <Clock className="h-8 w-8 text-green-500" />,
      link: "/tools",
      color: "bg-green-50",
    },
    {
      title: "Planificateur d'études",
      description: "Organisez votre emploi du temps et vos révisions efficacement.",
      icon: <Calendar className="h-8 w-8 text-purple-500" />,
      link: "/calendar",
      color: "bg-purple-50",
    },
    {
      title: "Musique d'ambiance",
      description:
        "Bibliothèque musicale pour améliorer votre concentration.",
      icon: <LucideAudioLines className="h-8 w-8 text-cyan-500" />,
      link: "/music-library",
      color: "bg-cyan-50",
    },
  ];

  // Fonctionnalités spécifiques aux professionnels
  const professionalFeatureCards = [
    {
      title: "Cas cliniques",
      description: "Accédez à une base de données de cas cliniques pour la formation.",
      icon: <Stethoscope className="h-8 w-8 text-amber-500" />,
      link: "/clinical-cases",
      color: "bg-amber-50",
    },
    {
      title: "Formation continue",
      description:
        "Modules de DPC et ressources pour maintenir vos compétences.",
      icon: <BookOpen className="h-8 w-8 text-teal-500" />,
      link: "/continuing-education",
      color: "bg-teal-50",
    },
    {
      title: "Bibliothèque médicale",
      description: "Accédez aux dernières recherches et publications scientifiques.",
      icon: <Book className="h-8 w-8 text-blue-500" />,
      link: "/resources",
      color: "bg-blue-50",
    },
    {
      title: "Outils cliniques",
      description: "Calculateurs médicaux et aides à la décision clinique.",
      icon: <Microscope className="h-8 w-8 text-violet-500" />,
      link: "/tools",
      color: "bg-violet-50",
    },
    {
      title: "Échanges entre pairs",
      description: "Communauté de professionnels pour partager expertise et conseils.",
      icon: <MessageSquare className="h-8 w-8 text-green-500" />,
      link: "/community",
      color: "bg-green-50",
    },
    {
      title: "Gestion documentaire",
      description: "Organisez vos documents professionnels et vos présentations.",
      icon: <FileText className="h-8 w-8 text-orange-500" />,
      link: "/notes",
      color: "bg-orange-50",
    },
  ];

  // Déterminer quelles cartes spécifiques afficher en fonction du rôle de l'utilisateur
  const featureCards = user.role === "student" ? studentFeatureCards : professionalFeatureCards;

  return (
    <MainLayout requireAuth={true}>
      <div className="space-y-8">
        {/* Section de bienvenue */}
        <section className="bg-gradient-to-r from-medical-blue to-medical-teal text-white rounded-lg p-6 md:p-8 shadow-md">
          <div className="max-w-3xl">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">
              Bonjour, {user.displayName}!
            </h1>
            <p className="md:text-lg mb-6 opacity-90">
              Bienvenue sur MedCollab, votre plateforme de collaboration
              médicale{user.role === "student" ? " pour étudiants." : " pour professionnels de santé."}
              {user.kycStatus !== "verified" &&
                " Complétez la vérification de votre identité pour accéder à toutes nos fonctionnalités."}
            </p>
            {user.kycStatus !== "verified" && (
              <Link to="/kyc">
                <Button size="lg" variant="secondary">
                  Vérifier mon identité
                </Button>
              </Link>
            )}
          </div>
        </section>

        {/* KYC Status banner if not verified */}
        {user.kycStatus !== "verified" && user.kycStatus !== "pending" && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-medium text-amber-800">
                Vérification requise
              </h3>
              <p className="text-sm text-amber-700 mt-1">
                Certaines fonctionnalités ne sont accessibles qu'après
                vérification de votre identité. Soumettez vos documents pour
                bénéficier d'un accès complet.
              </p>
              <Link to="/kyc" className="inline-block mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-amber-800 border-amber-300 hover:bg-amber-100"
                >
                  Vérifier maintenant
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* KYC Status banner if pending */}
        {user.kycStatus === "pending" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-800">
                Vérification en cours
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                Vos documents sont en cours d'examen. Vous recevrez une
                notification par email lorsque votre identité sera vérifiée.
              </p>
            </div>
          </div>
        )}

        {/* Search section */}
        <section className="relative">
          <div className="flex items-center max-w-2xl mx-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                className="w-full rounded-full border border-gray-300 py-3 px-12 focus:outline-none focus:ring-2 focus:ring-medical-teal focus:border-transparent"
                placeholder={user.role === "student" 
                  ? "Rechercher des fiches, groupes d'étude ou outils..." 
                  : "Rechercher des ressources, cas cliniques ou outils..."}
              />
            </div>
          </div>
        </section>

        {/* Features section */}
        <section>
          <h2 className="text-2xl font-semibold mb-5">
            {user.role === "student" 
              ? "Fonctionnalités pour étudiants" 
              : "Fonctionnalités pour professionnels"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((card, index) => (
              <Link to={card.link} key={index}>
                <Card className="h-full hover:shadow-md transition-all cursor-pointer">
                  <CardHeader className={`${card.color} rounded-t-lg`}>
                    <div className="flex justify-between items-center">
                      {card.icon}
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </Button>
                    </div>
                    <CardTitle className="text-xl">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-gray-600">{card.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Activity section */}
        <section>
          <h2 className="text-2xl font-semibold mb-5">Activité récente</h2>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Votre activité</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* For demo purposes - this would be dynamic in a real app */}
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Book className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Nouvelles ressources ajoutées</p>
                    <p className="text-sm text-gray-500">
                      10 nouveaux documents ont été ajoutés à la base de
                      connaissances
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Il y a 2 heures
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Événement à venir</p>
                    <p className="text-sm text-gray-500">
                      Webinaire: Les avancées en médecine d'urgence
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Demain, 18:00</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full" asChild>
                <Link to="/activities">Voir toutes les activités</Link>
              </Button>
            </CardFooter>
          </Card>
        </section>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
