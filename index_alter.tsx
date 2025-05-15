import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import {
  Book,
  Calendar,
  CheckCircle,
  FileText,
  Globe,
  MessageSquare,
  Shield,
  Video,
  Users,
  Music,
  Brain,
  FileCheck,
  BookOpen,
  Award,
  GraduationCap,
  Stethoscope,
  HeartPulse,
  LucideAward,
} from "lucide-react";

const Index = () => {
  const { user } = useAuth();

  return (
    <MainLayout requireAuth={false}>
      {/* Section Héro */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-medical-navy">
            <span className="text-medical-blue">Med</span>Collab
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-700">
            La plateforme collaborative pour les étudiants et professionnels de
            santé
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="text-lg px-8">
                  Accéder à mon espace
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="text-lg px-8">
                    S'inscrire gratuitement
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Se connecter
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Section Fonctionnalités */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-medical-navy">
            Une plateforme complète pour votre parcours médical
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Book className="text-medical-blue h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Ressources Multilingues
              </h3>
              <p className="text-gray-600">
                Accédez à des milliers de ressources médicales validées dans
                plus de 50 langues, couvrant toutes les spécialités médicales.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="bg-teal-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Shield className="text-medical-teal h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Collaboration Sécurisée
              </h3>
              <p className="text-gray-600">
                Échangez avec la communauté médicale dans un environnement
                vérifié et sécurisé, avec vérification d'identité pour les
                professionnels.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Calendar className="text-green-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Outils de Productivité
              </h3>
              <p className="text-gray-600">
                Optimisez votre temps d'étude avec des planificateurs, minuteurs
                Pomodoro, et des outils de gestion des tâches spécialisés pour
                le domaine médical.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Globe className="text-purple-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Traduction Médicale
              </h3>
              <p className="text-gray-600">
                Traduisez des documents médicaux avec une précision
                exceptionnelle grâce à notre glossaire spécialisé et nos outils
                d'IA adaptés à la terminologie médicale.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Video className="text-amber-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Groupes d'Étude</h3>
              <p className="text-gray-600">
                Créez ou rejoignez des groupes d'étude avec visioconférence
                intégrée, tableaux blancs collaboratifs et partage de documents
                en temps réel.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <MessageSquare className="text-red-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cas Cliniques</h3>
              <p className="text-gray-600">
                Partagez et consultez des cas cliniques anonymisés pour
                améliorer votre pratique clinique avec les retours d'experts
                internationaux.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Brain className="text-blue-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Simulateur d'Examen
              </h3>
              <p className="text-gray-600">
                Entraînez-vous avec des milliers de QCM et questions ouvertes
                correspondant à votre curriculum, avec corrections détaillées et
                suivi de progression.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <FileCheck className="text-indigo-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Formation Continue</h3>
              <p className="text-gray-600">
                Suivez vos crédits de formation continue (CME/CPD) et accédez à
                des cours accrédités dans diverses spécialités médicales et
                régions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="bg-rose-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Music className="text-rose-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Bibliothèque Musicale
              </h3>
              <p className="text-gray-600">
                Améliorez votre concentration avec notre collection de musiques
                spécialement sélectionnées pour optimiser vos sessions d'étude
                et de travail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Rôles */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-medical-navy">
            Adapté à votre rôle dans le monde médical
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="bg-blue-50 p-8 rounded-lg border border-blue-100">
              <div className="flex items-center mb-6">
                <div className="bg-medical-blue rounded-full p-2 mr-3">
                  <GraduationCap className="text-white h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold text-medical-blue">
                  Pour les Étudiants
                </h3>
              </div>

              <ul className="space-y-4">
                <li className="flex items-center">
                  <CheckCircle className="text-medical-blue h-5 w-5 mr-2" />
                  <span>
                    Ressources académiques organisées par année et spécialité
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-medical-blue h-5 w-5 mr-2" />
                  <span>
                    Simulateurs d'examens et QCM interactifs avec suivi de
                    progression
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-medical-blue h-5 w-5 mr-2" />
                  <span>
                    Groupes d'étude avec visioconférence et tableaux blancs
                    collaboratifs
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-medical-blue h-5 w-5 mr-2" />
                  <span>
                    Outils de focus et de gestion du temps avec méthode Pomodoro
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-medical-blue h-5 w-5 mr-2" />
                  <span>
                    Générateur de fiches de révision avec IA et partage entre
                    étudiants
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-medical-blue h-5 w-5 mr-2" />
                  <span>
                    Bibliothèque musicale pour améliorer la concentration et
                    l'étude
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-medical-blue h-5 w-5 mr-2" />
                  <span>Forums d'entraide par spécialité et année d'étude</span>
                </li>
              </ul>
              <div className="mt-8">
                <Link to="/register">
                  <Button className="w-full">Rejoindre comme étudiant</Button>
                </Link>
              </div>
            </div>

            <div className="bg-teal-50 p-8 rounded-lg border border-teal-100">
              <div className="flex items-center mb-6">
                <div className="bg-medical-teal rounded-full p-2 mr-3">
                  <Stethoscope className="text-white h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold text-medical-teal">
                  Pour les Professionnels
                </h3>
              </div>

              <ul className="space-y-4">
                <li className="flex items-center">
                  <CheckCircle className="text-medical-teal h-5 w-5 mr-2" />
                  <span>
                    Accès à des bases de données médicales expertes et à jour
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-medical-teal h-5 w-5 mr-2" />
                  <span>
                    Partage de cas cliniques anonymisés et discussion entre
                    pairs
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-medical-teal h-5 w-5 mr-2" />
                  <span>
                    Suivi automatisé de formation continue (CME/CPD) conforme
                    aux normes
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-medical-teal h-5 w-5 mr-2" />
                  <span>
                    Outils d'annotation avancés pour articles scientifiques
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-medical-teal h-5 w-5 mr-2" />
                  <span>
                    Communauté vérifiée de professionnels de votre spécialité
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-medical-teal h-5 w-5 mr-2" />
                  <span>
                    Opportunités de mentorat et d'enseignement auprès
                    d'étudiants
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-medical-teal h-5 w-5 mr-2" />
                  <span>
                    Traduction médicale spécialisée pour publications
                    internationales
                  </span>
                </li>
              </ul>
              <div className="mt-8">
                <Link to="/register">
                  <Button className="w-full bg-medical-teal hover:bg-medical-teal/90">
                    Rejoindre comme professionnel
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Fontionnalités par Spécialité */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-medical-navy">
            Ressources Spécialisées par Discipline
          </h2>
          <p className="text-xl text-center mb-12 max-w-3xl mx-auto text-gray-600">
            MedCollab propose des contenus et outils adaptés aux besoins
            spécifiques de chaque spécialité médicale
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Cardiologie */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 rounded-full p-2 mr-3">
                  <HeartPulse className="text-red-600 h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg">Cardiologie</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Bibliothèque d'ECG commentés</li>
                <li>• Atlas d'échographie cardiaque</li>
                <li>• Cas cliniques de pathologies valvulaires</li>
                <li>• Dernières guidelines ESC/AHA</li>
              </ul>
            </div>

            {/* Neurologie */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 rounded-full p-2 mr-3">
                  <Brain className="text-purple-600 h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg">Neurologie</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Banque d'images IRM/CT annotées</li>
                <li>• Simulateur d'examen neurologique</li>
                <li>• Collection de vidéos de mouvements anormaux</li>
                <li>• Protocoles de traitement AVC en urgence</li>
              </ul>
            </div>

            {/* Pédiatrie */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 rounded-full p-2 mr-3">
                  <Users className="text-blue-600 h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg">Pédiatrie</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Courbes de croissance interactives</li>
                <li>• Guide des vaccinations par pays</li>
                <li>• Cas cliniques de maladies infantiles rares</li>
                <li>• Protocoles de réanimation néonatale</li>
              </ul>
            </div>

            {/* Chirurgie */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 rounded-full p-2 mr-3">
                  <FileCheck className="text-green-600 h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg">Chirurgie</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Vidéothèque de techniques opératoires</li>
                <li>• Simulateur de sutures virtuelles</li>
                <li>• Guide de préparation préopératoire</li>
                <li>• Protocoles de gestion des complications</li>
              </ul>
            </div>

            {/* Psychiatrie */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 rounded-full p-2 mr-3">
                  <MessageSquare className="text-indigo-600 h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg">Psychiatrie</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Échelles d'évaluation interactives</li>
                <li>• Vidéos d'entretiens cliniques commentés</li>
                <li>• Guide des psychotropes actualisé</li>
                <li>• Protocoles de gestion de crise</li>
              </ul>
            </div>

            {/* Médecine Interne */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-amber-100 rounded-full p-2 mr-3">
                  <BookOpen className="text-amber-600 h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg">Médecine Interne</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Algorithmes diagnostiques interactifs</li>
                <li>• Atlas de pathologies systémiques rares</li>
                <li>• Guide de médecine factuelle (EBM)</li>
                <li>• Fiches de gestion des maladies auto-immunes</li>
              </ul>
            </div>

            {/* Urgences */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 rounded-full p-2 mr-3">
                  <FileText className="text-red-600 h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg">Médecine d'Urgence</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Protocoles ABCDE interactifs</li>
                <li>• Simulateur de triage</li>
                <li>• Fiches toxicologiques d'urgence</li>
                <li>• Guides de procédures techniques</li>
              </ul>
            </div>

            {/* Formation Continue */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-teal-100 rounded-full p-2 mr-3">
                  <LucideAward className="text-teal-600 h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg">Formation Continue</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Cours accrédités pour toutes spécialités</li>
                <li>• Suivi automatisé des crédits CME/CPD</li>
                <li>• Webinaires interactifs hebdomadaires</li>
                <li>• Certificats reconnus internationalement</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link to="/resources">
              <Button
                variant="outline"
                className="text-medical-navy border-medical-navy hover:bg-medical-navy/10"
              >
                Explorer toutes les spécialités
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section Communauté */}
      <section className="py-16 bg-medical-navy text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Rejoignez une communauté de médecins et étudiants
          </h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto text-blue-100">
            Connectez-vous avec des milliers de professionnels et étudiants en
            médecine du monde entier
          </p>

          <div className="flex justify-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-medical-teal">10k+</div>
                <div className="mt-2">Étudiants</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-medical-teal">5k+</div>
                <div className="mt-2">Médecins</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-medical-teal">50+</div>
                <div className="mt-2">Pays</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-medical-teal">20k+</div>
                <div className="mt-2">Ressources</div>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-medical-navy/70 p-6 rounded-lg border border-blue-800">
              <Users className="h-8 w-8 text-blue-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Groupes d'étude</h3>
              <p className="text-blue-200">
                Rejoignez ou créez des groupes d'étude spécialisés avec d'autres
                étudiants et professionnels du monde entier.
              </p>
            </div>

            <div className="bg-medical-navy/70 p-6 rounded-lg border border-blue-800">
              <MessageSquare className="h-8 w-8 text-blue-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Forums spécialisés</h3>
              <p className="text-blue-200">
                Posez vos questions et partagez vos connaissances sur des forums
                modérés par des experts de chaque spécialité.
              </p>
            </div>

            <div className="bg-medical-navy/70 p-6 rounded-lg border border-blue-800">
              <Globe className="h-8 w-8 text-blue-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Réseau international
              </h3>
              <p className="text-blue-200">
                Développez votre réseau professionnel au-delà des frontières et
                découvrez des opportunités à l'international.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Appel à l'action */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-medical-navy">
            Prêt à rejoindre MedCollab?
          </h2>
          <p className="text-xl mb-10 text-gray-700">
            Créez votre compte gratuitement et commencez à collaborer avec la
            communauté médicale mondiale
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="text-lg px-8">
                  Accéder à mon espace
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="text-lg px-8">
                    S'inscrire gratuitement
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Se connecter
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
/**
 * Index.tsx
 *
 * Page d'accueil principale de MedCollab
 * Présente les fonctionnalités clés et invite les utilisateurs à s'inscrire ou se connecter
 */
