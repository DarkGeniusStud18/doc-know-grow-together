
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, BookOpen, Clock, Award, TrendingUp } from 'lucide-react';

const ContinuingEducation = () => {
  const featuredCourses = [
    {
      title: "Actualités en cardiologie interventionnelle",
      instructor: "Dr. Marie Laurent",
      duration: "8 heures",
      level: "Avancé",
      rating: 4.8,
      enrolled: 324,
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      progress: 0
    },
    {
      title: "Nouveaux protocoles en anesthésiologie",
      instructor: "Dr. Thomas Martin",
      duration: "6 heures",
      level: "Intermédiaire",
      rating: 4.6,
      enrolled: 245,
      image: "https://images.unsplash.com/photo-1579154341098-e4e157cc0b85?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      progress: 0
    },
    {
      title: "Techniques avancées d'imagerie médicale",
      instructor: "Dr. Sophie Dubois",
      duration: "10 heures",
      level: "Expert",
      rating: 4.9,
      enrolled: 189,
      image: "https://images.unsplash.com/photo-1516069677018-378971d5d4cf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      progress: 0
    }
  ];

  const inProgressCourses = [
    {
      title: "Nouveautés en pharmacologie clinique",
      instructor: "Dr. Philippe Moreau",
      duration: "12 heures",
      level: "Intermédiaire",
      rating: 4.7,
      enrolled: 412,
      image: "https://images.unsplash.com/photo-1563213126-a4273aed2016?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      progress: 45
    },
    {
      title: "Gestion des urgences pédiatriques",
      instructor: "Dr. Clara Bernard",
      duration: "8 heures",
      level: "Avancé",
      rating: 4.9,
      enrolled: 276,
      image: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      progress: 68
    }
  ];

  const certificates = [
    {
      title: "Certificat en médecine d'urgence",
      issuer: "Académie Nationale de Médecine",
      date: "Mars 2025",
      credits: 20
    },
    {
      title: "Formation continue en chirurgie laparoscopique",
      issuer: "Association Française de Chirurgie",
      date: "Janvier 2025",
      credits: 15
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Formation Continue</h1>
            <p className="text-gray-500">Développez vos compétences médicales et restez à jour</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button>
              <TrendingUp className="mr-2 h-4 w-4" />
              Explorer tous les cours
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2">
            {inProgressCourses.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Continuer votre apprentissage</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {inProgressCourses.map((course, index) => (
                    <Card key={index} className="overflow-hidden hover:shadow-lg transition-all">
                      <div 
                        className="h-40 bg-cover bg-center" 
                        style={{ backgroundImage: `url(${course.image})` }}
                      ></div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <Badge className="bg-medical-teal">{course.level}</Badge>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400" />
                            <span className="ml-1 text-sm">{course.rating}</span>
                          </div>
                        </div>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription>{course.instructor}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {course.duration}
                          </div>
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-1" />
                            {course.enrolled} inscrits
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progression</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">Continuer</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-xl font-semibold mb-4">Cours recommandés pour vous</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredCourses.map((course, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-all">
                    <div 
                      className="h-40 bg-cover bg-center" 
                      style={{ backgroundImage: `url(${course.image})` }}
                    ></div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <Badge className="bg-medical-teal">{course.level}</Badge>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400" />
                          <span className="ml-1 text-sm">{course.rating}</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription>{course.instructor}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {course.duration}
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {course.enrolled} inscrits
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">S'inscrire</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
          
          <div className="col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Vos crédits de formation</CardTitle>
                <CardDescription>Suivez vos heures de formation continue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <div className="text-4xl font-bold text-medical-teal">35</div>
                  <div className="text-sm text-gray-500">crédits obtenus cette année</div>
                  <div className="mt-4">
                    <Progress value={70} className="h-2" />
                    <div className="text-xs text-gray-500 mt-1">
                      70% de votre objectif annuel (50 crédits)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Certificats récents</CardTitle>
                <CardDescription>Vos dernières certifications obtenues</CardDescription>
              </CardHeader>
              <CardContent>
                {certificates.map((certificate, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-md hover:bg-gray-50 cursor-pointer ${
                      index !== certificates.length - 1 ? 'border-b' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">{certificate.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{certificate.issuer}</div>
                        <div className="text-xs text-gray-500">{certificate.date}</div>
                      </div>
                      <Badge className="bg-medical-teal flex items-center">
                        <Award className="h-3 w-3 mr-1" />
                        {certificate.credits}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Voir tous les certificats</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContinuingEducation;
