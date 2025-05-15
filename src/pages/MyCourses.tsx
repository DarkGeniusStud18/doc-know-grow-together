
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, CheckCircle, ChevronRight } from 'lucide-react';

const MyCourses: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const courses = [
    {
      id: '1',
      title: 'Anatomie fonctionnelle',
      instructor: 'Dr. Philippe Martin',
      progress: 68,
      totalLessons: 12,
      completedLessons: 8,
      enrolledStudents: 345,
      duration: '24 heures',
      category: 'Anatomie',
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
      id: '2',
      title: 'Physiologie cardiovasculaire',
      instructor: 'Dr. Marie Dubois',
      progress: 32,
      totalLessons: 10,
      completedLessons: 3,
      enrolledStudents: 289,
      duration: '18 heures',
      category: 'Physiologie',
      image: 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
      id: '3',
      title: 'Pharmacologie clinique',
      instructor: 'Dr. Thomas Leroy',
      progress: 15,
      totalLessons: 14,
      completedLessons: 2,
      enrolledStudents: 412,
      duration: '30 heures',
      category: 'Pharmacologie',
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    }
  ];
  
  if (!user) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-semibold mb-4">Connexion requise</h1>
          <p className="text-gray-600 mb-6">Veuillez vous connecter pour accéder à vos cours.</p>
          <Button onClick={() => navigate('/login')}>Se connecter</Button>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-medical-navy">Mes Cours</h1>
            <p className="text-gray-500 mt-1">
              Suivez votre progression et accédez à vos cours
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-md transition-all">
              <div 
                className="h-40 bg-cover bg-center" 
                style={{ backgroundImage: `url(${course.image})` }}
              ></div>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <Badge className="bg-medical-teal">{course.category}</Badge>
                  <Badge variant="outline" className="text-medical-navy">
                    {course.completedLessons}/{course.totalLessons} leçons
                  </Badge>
                </div>
                <CardTitle className="mt-2">{course.title}</CardTitle>
                <CardDescription>{course.instructor}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progression</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-medical-teal rounded-full" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {course.enrolledStudents} étudiants
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full flex justify-between" onClick={() => navigate(`/my-courses/${course.id}`)}>
                  <span>Continuer</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Cours disponibles pour vous</h2>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">Découvrez notre catalogue de cours</h3>
                  <p className="text-gray-500 mt-1">
                    Explorez notre bibliothèque de plus de 200 cours spécialisés pour enrichir vos connaissances médicales
                  </p>
                </div>
                <Button className="flex items-center gap-2" onClick={() => navigate('/resources')}>
                  <BookOpen className="h-4 w-4" />
                  Explorer les cours
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default MyCourses;
