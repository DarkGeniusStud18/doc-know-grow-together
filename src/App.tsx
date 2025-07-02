
/**
 * 🚀 Application Principale - Version Complète avec Splash Screen
 * Point d'entrée de l'application avec navigation optimisée
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

// Import des outils
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
import Music from '@/pages/Music';

import './App.css';

// Configuration du client React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * 🛡️ Composant de protection des routes authentifiées
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-teal"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

/**
 * 🚀 Application Principale
 */
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <div className="App">
            <Routes>
              {/* 🚀 Page de démarrage */}
              <Route path="/splash" element={<Splash />} />
              
              {/* 🏠 Pages publiques */}
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
              
              {/* 🛠️ Outils d'étude */}
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
              
              {/* 📚 Autres pages */}
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
                    <Music />
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
              
              {/* 🔐 Dashboard Administrateur */}
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              
              {/* 🔀 Redirection par défaut */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            
            {/* 🔔 Notifications toast */}
            <Toaster position="top-right" richColors />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
