/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react';
import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from '@/components/ui/sonner';
import { PWAInstallPrompt } from '@/components/layout/PWAInstallPrompt';
import { ErrorBoundary } from '@/components/ui/error-boundary';

import ScrollToTop from '@/components/layout/ScrollToTop';

// Lazy loading des pages pour améliorer les performances de chargement initial
const Splash = React.lazy(() => import('@/pages/Splash'));
const Index = React.lazy(() => import('@/pages/Index'));
const Login = React.lazy(() => import('@/pages/Login'));
const Register = React.lazy(() => import('@/pages/Register'));
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Profile = React.lazy(() => import('@/pages/Profile'));
const Settings = React.lazy(() => import('@/pages/Settings'));
const Resources = React.lazy(() => import('@/pages/Resources'));
const Community = React.lazy(() => import('@/pages/Community'));
const CommunityDiscussion = React.lazy(() => import('@/pages/CommunityDiscussion'));
const Calendar = React.lazy(() => import('@/pages/Calendar'));
const Notes = React.lazy(() => import('@/pages/Notes'));
const StudyGroups = React.lazy(() => import('@/pages/StudyGroups'));
const StudyGroupDetail = React.lazy(() => import('@/pages/StudyGroupDetail'));
const Tools = React.lazy(() => import('@/pages/Tools'));

// Lazy loading des outils spécialisés pour optimiser le bundle
const FlashcardGenerator = React.lazy(() => import('@/pages/tools/flashcards/FlashcardGenerator'));
const PomodoroTimer = React.lazy(() => import('@/pages/tools/PomodoroTimer'));
const StudyTimer = React.lazy(() => import('@/pages/tools/StudyTimer'));
const StudyPlanner = React.lazy(() => import('@/pages/tools/StudyPlanner'));
const StudyGoals = React.lazy(() => import('@/pages/tools/StudyGoals'));
const TaskList = React.lazy(() => import('@/pages/tools/TaskList'));
const MedicalCalculators = React.lazy(() => import('@/pages/tools/MedicalCalculators'));
const ResearchAssistant = React.lazy(() => import('@/pages/tools/ResearchAssistant'));
const QuizGenerator = React.lazy(() => import('@/pages/tools/QuizGenerator'));
const PerformanceTracker = React.lazy(() => import('@/pages/tools/PerformanceTracker'));
const InteractivePresentations = React.lazy(() => import('@/pages/tools/InteractivePresentations'));
const ClinicalCasesExplorer = React.lazy(() => import('@/pages/tools/ClinicalCasesExplorer'));
const ExamSimulator = React.lazy(() => import('@/pages/tools/ExamSimulator'));

// Lazy loading des autres pages
const ExamHistory = React.lazy(() => import('@/pages/ExamHistory'));
const ClinicalCases = React.lazy(() => import('@/pages/ClinicalCases'));
const ContinuingEducation = React.lazy(() => import('@/pages/ContinuingEducation'));
const MusicLibrary = React.lazy(() => import('@/pages/MusicLibrary'));
const Subscription = React.lazy(() => import('@/pages/Subscription'));
const KYCVerification = React.lazy(() => import('@/pages/KYCVerification'));
const AdminDashboard = React.lazy(() => import('@/pages/admin/AdminDashboard'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));
const Chat = React.lazy(() => import('@/pages/Chat'));
const Messaging = React.lazy(() => import('@/pages/Messaging'));
const Notifications = React.lazy(() => import('@/pages/Notifications'));

/**
 * Configuration optimisée du QueryClient avec gestion intelligente du cache
 * Paramètres ajustés pour une meilleure performance et fiabilité réseau
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - données considérées comme fraîches
      gcTime: 1000 * 60 * 30, // 30 minutes - temps de conservation en cache
      refetchOnWindowFocus: false, // Évite les requêtes inutiles
      refetchOnReconnect: true, // Actualise à la reconnexion
      retry: (failureCount, error: any) => {
        // Stratégie de retry intelligente selon le type d'erreur
        if (error?.status === 404 || error?.status === 403) return false;
        return failureCount < 2; // Maximum 2 tentatives
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000), // Délai exponentiel max 10s
    },
    mutations: {
      retry: 1, // Une seule tentative pour les mutations
      retryDelay: 1000
    }
  },
});

/**
 * Composant de chargement optimisé pour le Suspense
 * Design cohérent avec le thème médical de l'application
 */
const SuspenseLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-medical-light to-medical-blue/5">
    <div className="flex flex-col items-center gap-6 p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-medical-light border-t-medical-blue rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-2 border-medical-teal/20 rounded-full animate-pulse"></div>
      </div>
      <div className="text-center space-y-2">
        <p className="text-lg font-semibold text-medical-navy">
          Chargement de MedCollab
        </p>
        <p className="text-sm text-gray-500 animate-pulse">
          Préparation de votre espace de travail...
        </p>
      </div>
    </div>
  </div>
);

/**
 * 🔄 Composant de redirection intelligent - ENTIÈREMENT REVU
 * Résout définitivement les problèmes de boucles infinites et pages blanches
 */
const InitialRedirect: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [hasChecked, setHasChecked] = React.useState(false);

  React.useEffect(() => {
    // 🚫 Éviter la redirection multiple
    if (hasChecked || loading) return;

    const checkAndRedirect = async () => {
      try {
        // 🔍 Vérifier l'état de l'utilisateur d'abord
        const hasVisited = localStorage.getItem('medcollab-visited');
        
        console.log('🔍 Vérification état utilisateur:', {
          user: !!user,
          hasVisited: !!hasVisited,
          loading
        });

        // ✅ Si utilisateur connecté -> dashboard
        if (user) {
          console.log('✅ Utilisateur connecté -> dashboard');
          navigate('/dashboard', { replace: true });
          setHasChecked(true);
          return;
        }

        // 🆕 Si premier utilisateur -> splash
        if (!hasVisited) {
          console.log('🆕 Premier utilisateur -> splash');
          navigate('/splash', { replace: true });
          setHasChecked(true);
          return;
        }

        // 👤 Utilisateur existant sans connexion -> index
        console.log('👤 Utilisateur existant -> index');
        navigate('/index', { replace: true });
        setHasChecked(true);

      } catch (error) {
        console.error('❌ Erreur redirection:', error);
        navigate('/index', { replace: true });
        setHasChecked(true);
      }
    };

    // 📱 Délai minimal pour éviter les flickers
    const timer = setTimeout(checkAndRedirect, 100);
    return () => clearTimeout(timer);
  }, [user, loading, hasChecked, navigate]);

  // 🔄 Écran de chargement pendant la vérification
  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-light to-medical-blue/5 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-medical-light border-t-medical-blue rounded-full animate-spin"></div>
        <p className="text-medical-navy font-medium">Initialisation...</p>
      </div>
    </div>
  );
};

/**
 * Composant principal de l'application avec architecture optimisée
 * 
 * Fonctionnalités avancées :
 * - Lazy loading intelligent pour optimiser les performances
 * - Gestion d'erreurs robuste avec ErrorBoundary
 * - Support PWA complet avec notifications
 * - Toasts contextuelles pour les feedbacks utilisateur
 * - Thèmes adaptatifs avec contexte global
 * - Gestion d'état centralisée avec React Query
 * - Page de démarrage avec animations
 * - Scroll automatique vers le haut lors des changements de route
 */
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <Router>
                <ScrollToTop />
                <Suspense fallback={<SuspenseLoader />}>
                  <Routes>
                    {/* Redirection initiale */}
                    <Route path="/" element={<InitialRedirect />} />
                    
                    {/* Page de démarrage avec animations */}
                    <Route path="/splash" element={<Splash />} />
                    
                    {/* Routes publiques avec lazy loading */}
                    <Route path="/index" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Routes protégées principales */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />

                    {/* Routes de contenu éducatif */}
                    <Route path="/resources" element={<Resources />} />
                    
                    {/* Route de messagerie unifiée - Chat System */}
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/messaging" element={<Messaging />} />
                    <Route path="/notifications" element={<Notifications />} />

                    {/* Routes d'organisation et planification */}
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/notes" element={<Notes />} />

                    {/* Routes des outils d'étude avec lazy loading optimisé */}
                    <Route path="/tools" element={<Tools />} />
                    <Route path="/tools/flashcard-generator" element={<FlashcardGenerator />} />
                    <Route path="/tools/pomodoro" element={<PomodoroTimer />} />
                    <Route path="/tools/study-timer" element={<StudyTimer />} />
                    <Route path="/tools/study-planner" element={<StudyPlanner />} />
                    <Route path="/tools/study-goals" element={<StudyGoals />} />
                    <Route path="/tools/task-list" element={<TaskList />} />
                    <Route path="/tools/medical-calculator" element={<MedicalCalculators />} />
                    <Route path="/tools/research-assistant" element={<ResearchAssistant />} />
                    <Route path="/tools/quiz-generator" element={<QuizGenerator />} />
                    <Route path="/tools/performance-tracker" element={<PerformanceTracker />} />
                    <Route path="/tools/interactive-presentations" element={<InteractivePresentations />} />
                    <Route path="/tools/clinical-cases" element={<ClinicalCasesExplorer />} />
                    <Route path="/tools/exam-simulator" element={<ExamSimulator />} />

                    {/* Routes d'évaluation et formation */}
                    {/*<Route path="/exam-simulator" element={<ExamSimulator />} />*/}
                    <Route path="/exam-history" element={<ExamHistory />} />
                    <Route path="/clinical-cases" element={<ClinicalCases />} />
                    <Route path="/continuing-education" element={<ContinuingEducation />} />

                    {/* Routes utilitaires et services */}
                    <Route path="/music-library" element={<MusicLibrary />} />
                    <Route path="/subscription" element={<Subscription />} />
                    <Route path="/kyc" element={<KYCVerification />} />
                    <Route path="/kyc-verification" element={<KYCVerification />} />

                    {/* Route admin ultra-sécurisée */}
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />

                    {/* Route 404 avec lazy loading */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </Router>

            {/* Composants globaux avec ordre d'affichage optimisé */}
            <Toaster 
              position="top-right"
              closeButton
              richColors
              theme="light"
              duration={4000}
            />
            
            {/* Prompt d'installation PWA avec gestion intelligente */}
            <PWAInstallPrompt />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
