
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { Book, Calendar, CheckCircle, FileText, Globe, MessageSquare, Shield, Video, Users } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  
  return (
    <MainLayout requireAuth={false}>
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-medical-navy">
            <span className="text-medical-blue">Med</span>Collab
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-700">
            La plateforme collaborative pour les étudiants et professionnels de santé
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
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-medical-navy">
            Une plateforme complète pour votre parcours médical
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Book className="text-medical-blue h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ressources Multilingues</h3>
              <p className="text-gray-600">
                Accédez à des milliers de ressources médicales validées dans plus de 50 langues.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="bg-teal-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Shield className="text-medical-teal h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaboration Sécurisée</h3>
              <p className="text-gray-600">
                Échangez avec la communauté médicale dans un environnement vérifié et sécurisé.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Calendar className="text-green-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Outils de Productivité</h3>
              <p className="text-gray-600">
                Optimisez votre temps d'étude et de travail avec des outils conçus pour les professionnels de santé.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Globe className="text-purple-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Traduction Médicale</h3>
              <p className="text-gray-600">
                Traduisez des documents médicaux avec une précision exceptionnelle grâce à notre glossaire spécialisé.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Video className="text-amber-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Groupes d'Étude</h3>
              <p className="text-gray-600">
                Créez ou rejoignez des groupes d'étude avec visioconférence et partage de documents intégrés.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <MessageSquare className="text-red-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cas Cliniques</h3>
              <p className="text-gray-600">
                Partagez et consultez des cas cliniques anonymisés pour améliorer votre pratique médicale.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Role-Based Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-medical-navy">
            Adapté à votre rôle dans le monde médical
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="bg-blue-50 p-8 rounded-lg border border-blue-100">
              <h3 className="text-2xl font-semibold mb-4 text-medical-blue">Pour les Étudiants</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <CheckCircle className="text-medical-blue h-5 w-5 mr-2" />
                  <span>Ressources académiques organisées par année et spécialité</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-medical-blue h-5 w-5 mr-2" />
                  <span>Simulateurs d'examens et QCM interactifs</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-medical-blue h-5 w-5 mr-2" />
                  <span>Groupes d'étude avec visioconférence</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-medical-blue h-5 w-5 mr-2" />
                  <span>Outils de focus et de gestion du temps</span>
                </li>
              </ul>
              <div className="mt-8">
                <Link to="/register">
                  <Button className="w-full">Rejoindre comme étudiant</Button>
                </Link>
              </div>
            </div>
            
            <div className="bg-teal-50 p-8 rounded-lg border border-teal-100">
              <h3 className="text-2xl font-semibold mb-4 text-medical-teal">Pour les Professionnels</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <CheckCircle className="text-medical-teal h-5 w-5 mr-2" />
                  <span>Accès à des bases de données médicales expertes</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-medical-teal h-5 w-5 mr-2" />
                  <span>Partage de cas cliniques anonymisés</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-medical-teal h-5 w-5 mr-2" />
                  <span>Suivi de formation continue (CME/CPD)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-medical-teal h-5 w-5 mr-2" />
                  <span>Outils d'annotation avancés</span>
                </li>
              </ul>
              <div className="mt-8">
                <Link to="/register">
                  <Button className="w-full bg-medical-teal hover:bg-medical-teal/90">Rejoindre comme professionnel</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Community Section */}
      <section className="py-16 bg-medical-navy text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Rejoignez une communauté de médecins et étudiants
          </h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto text-blue-100">
            Connectez-vous avec des milliers de professionnels et étudiants en médecine du monde entier
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
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-medical-navy">
            Prêt à rejoindre MedCollab?
          </h2>
          <p className="text-xl mb-10 text-gray-700">
            Créez votre compte gratuitement et commencez à collaborer avec la communauté médicale mondiale
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
