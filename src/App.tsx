
/**
 * 🚀 Application Principale MedCollab - Version Complète Corrigée
 * 
 * Architecture moderne avec :
 * - Navigation complète et routes optimisées
 * - Support PWA avec fonctionnalités offline
 * - Synchronisation en temps réel avec la base de données
 * - Interface responsive pour tous les écrans
 * - Gestion d'état locale pour les utilisateurs PWA
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from '@/components/layout/ScrollToTop';

// Import des pages principales
import Splash from '@/pages/Splash';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Tools from '@/pages/Tools';
import StudyGroups from '@/pages/StudyGroups';
import AdminDashboard from '@/pages/AdminDashboard';
import NotFound from '@/pages/NotFound';

// Import des outils d'étude
import PomodoroTimer from '@/pages/tools/PomodoroTimer';
import StudyGoals from '@/pages/tools/StudyGoals';
import StudyTimer from '@/pages/tools/StudyTimer';
import InteractivePresentations from '@/pages/tools/InteractivePresentations';
import PerformanceTracker from '@/pages/tools/PerformanceTracker';
import ExamSimulator from '@/pages/tools/ExamSimulator';

// Import des autres pages
import Resources from '@/pages/Resources';
import Community from '@/pages/Community';
import Calendar from '@/pages/Calendar';
import Settings from '@/pages/Settings';
import Profile from '@/pages/Profile';
import ClinicalCases from '@/pages/ClinicalCases';
import Notes from '@/pages/Notes';
import MusicLibrary from '@/pages/Music';

import './App.css';

/**
 * 🔧 Configuration optimisée du client React Query
 * Paramètres pour une meilleure performance et gestion du cache
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - durée de validité des données
      gcTime: 10 * 60 * 1000, // 10 minutes - durée de conservation en cache
      refetchOnWindowFocus: false, // Éviter les requêtes automatiques lors du focus
      retry: 3, // Nombre de tentatives en cas d'échec
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Délai progressif
    },
  },
});

/**
 * 🛡️ Composant de protection des routes authentifiées
 * Gère la redirection automatique et les états de chargement
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  // Affichage du loader pendant la vérification d'authentification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-medical-light to-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-teal"></div>
          <p className="text-medical-navy font-medium">Chargement en cours...</p>
        </div>
      </div>
    );
  }

  // Redirection vers la page de connexion si non authentifié
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

/**
 * 🚀 Composant Application Principal
 * Point d'entrée de l'application avec toutes les fonctionnalités
 */
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          {/* Composant pour gérer le scroll vers le haut lors des changements de page */}
          <ScrollToTop />
          
          <div className="App overflow-x-hidden">
            <Routes>
              {/* 🚀 Page de démarrage avec logo animé */}
              <Route path="/splash" element={<Splash />} />
              
              {/* 🏠 Pages publiques - Accessibles sans authentification */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* 🔐 Pages protégées principales */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/tools"
                element={
                  <ProtectedRoute>
                    <Tools />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/study-groups"
                element={
                  <ProtectedRoute>
                    <StudyGroups />
                  </ProtectedRoute>
                }
              />
              
              {/* 🛠️ Outils d'étude spécialisés */}
              <Route
                path="/tools/pomodoro"
                element={
                  <ProtectedRoute>
                    <PomodoroTimer />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/tools/study-goals"
                element={
                  <ProtectedRoute>
                    <StudyGoals />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/tools/study-timer"
                element={
                  <ProtectedRoute>
                    <StudyTimer />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/tools/interactive-presentations"
                element={
                  <ProtectedRoute>
                    <InteractivePresentations />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/tools/performance-tracker"
                element={
                  <ProtectedRoute>
                    <PerformanceTracker />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/tools/exam-simulator"
                element={
                  <ProtectedRoute>
                    <ExamSimulator />
                  </ProtectedRoute>
                }
              />
              
              {/* 📚 Pages de contenu et ressources */}
              <Route
                path="/resources"
                element={
                  <ProtectedRoute>
                    <Resources />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/community"
                element={
                  <ProtectedRoute>
                    <Community />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <Calendar />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/clinical-cases"
                element={
                  <ProtectedRoute>
                    <ClinicalCases />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/notes"
                element={
                  <ProtectedRoute>
                    <Notes />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/music"
                element={
                  <ProtectedRoute>
                    <MusicLibrary />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              
              {/* 🔐 Dashboard Administrateur sécurisé */}
              <Route 
                path="/admin-dashboard" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* 🔀 Page 404 pour les routes invalides */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            {/* 🔔 Système de notifications toast avec position optimisée */}
            <Toaster position="top-right" richColors closeButton />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
